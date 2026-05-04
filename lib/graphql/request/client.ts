import { GraphQLClient } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { getDefaultStore } from 'jotai';
import * as Sentry from '@sentry/nextjs';

import { GRAPHQL_URL } from '$lib/utils/constants';
import { log } from '$lib/utils/helpers';
import { sessionAtom } from '$lib/jotai';

import { InMemoryCache } from './cache';
import { FetchPolicy } from './type';

/** Structured error returned when a feature-gated mutation is rejected (HTTP 402). */
export interface FeatureGatedError {
  message: string;
  featureGated: boolean;
  featureCode: string;
  requiredTier: string;
  currentTier: string;
  upgradeUrl?: string;
}

if (!GRAPHQL_URL) {
  log.error({ message: 'Missing GRAPHQL_URL', exit: true });
}

interface QueryRequest<T, V extends object> {
  type: 'query' | 'refetch';
  query: TypedDocumentNode<T, V>;
  variables?: V;
  initData?: T | null;
  fetchPolicy?: FetchPolicy;
  headers?: HeadersInit;
  signal?: AbortSignal;
  resolve: (result: { data: T | null; error: unknown }) => void;
  reject: (error: unknown) => void;
}

interface RequestConfig {
  cache?: 'no-store' | 'no-cache';
  credentials?: 'omit' | 'include' | 'same-origin';
}

export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const name = 'name' in error ? String(error.name) : '';
  const message = 'message' in error ? String(error.message) : '';

  return name === 'AbortError' || message === 'AbortError' || message === 'cancelled' || /abort/i.test(message);
}

export class GraphqlClient {
  private client: GraphQLClient;
  private cache?: InMemoryCache;
  private queue: QueryRequest<any, any>[] = [];
  customHeader: Record<string, string> = {};

  constructor({ url, cache, options = {} }: { url: string; cache?: InMemoryCache; options?: RequestConfig }) {
    this.client = new GraphQLClient(url, { cache: 'no-store', ...options });
    this.cache = cache;
  }

  addCustomheader(header: Record<string, string>) {
    this.customHeader = header;
  }

  resetCustomerHeader() {
    this.customHeader = {};
  }

  async query<T, V extends object>({
    query,
    variables = {} as V,
    fetchPolicy = 'cache-first',
    headers,
    initData,
    signal,
  }: {
    query: TypedDocumentNode<T, V>;
    headers?: HeadersInit;
    variables?: V;
    fetchPolicy?: FetchPolicy;
    initData?: T;
    signal?: AbortSignal;
  }): Promise<{ data: T | null; error: unknown }> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        type: 'query',
        query,
        variables,
        headers: this.getHeaders(headers),
        initData,
        fetchPolicy,
        signal,
        resolve,
        reject,
      });
      this.processQueue();
    });
  }

  async refetchQuery<T, V extends object>({
    query,
    variables,
    headers,
    signal,
  }: {
    query: TypedDocumentNode<T, V>;
    variables?: V;
    headers?: HeadersInit;
    signal?: AbortSignal;
  }): Promise<{ data: T | null; error: unknown }> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        type: 'refetch',
        query,
        variables,
        headers: this.getHeaders(headers),
        signal,
        resolve,
        reject,
      });
      this.processQueue();
    });
  }

  private processQueue() {
    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      this.executeRequestWrapper(request);
    }
  }

  private async executeRequestWrapper(request: QueryRequest<any, any>) {
    try {
      await this.executeRequest(request);
    } catch (error) {
      this.handleRequestError(request, error);
    }
  }

  private async executeRequest(request: QueryRequest<any, any>) {
    if (request.type === 'refetch') {
      await this.executeNetworkRequest(request);
      return;
    }

    const { fetchPolicy, initData, headers } = request;

    if (fetchPolicy === 'network-only') {
      await this.executeNetworkRequest(request);
      return;
    }

    if (fetchPolicy === 'cache-and-network') {
      // FIXME: read cache and fetch data to update cache
      await this.executeNetworkRequest(request);
      return;
    }

    const cacheData = this.cache?.readQuery(request.query, request.variables);
    if (cacheData) {
      request.resolve({ data: cacheData, error: null });
      return;
    }

    let result = initData;
    if (!result) {
      result = await this.client.request({
        document: request.query,
        variables: request.variables,
        requestHeaders: headers as HeadersInit,
        signal: request.signal,
      });
    }
    this.cache?.normalizeAndStore(request.query, request.variables, result);
    request.resolve({ data: result, error: null });
  }

  private async executeNetworkRequest(request: QueryRequest<any, any>) {
    const { query, variables, headers, signal } = request;
    const result = await this.client.request({
      document: query,
      variables,
      requestHeaders: headers as HeadersInit,
      signal,
    });

    this.cache?.normalizeAndStore(query, variables, result);
    request.resolve({ data: result, error: null });
  }

  private handleRequestError(request: QueryRequest<any, any>, error: unknown) {
    if (request.signal?.aborted || isAbortError(error)) {
      request.resolve({ data: null, error });
      return;
    }

    // P0-4: Report GraphQL errors to Sentry with operation context
    const operationName = (request.query.definitions?.[0] as any)?.name?.value || 'unknown';
    const operationType = (request.query.definitions?.[0] as any)?.operation || 'query';

    // Gate out 402 feature-gating errors — they are business logic, not errors
    const is402FeatureGated =
      error &&
      typeof error === 'object' &&
      'response' in error &&
      String((error as any).response?.errors?.[0]?.extensions?.code) === '402';

    if (!is402FeatureGated) {
      Sentry.captureException(error, {
        tags: {
          'graphql.operation': operationName,
          'graphql.operationType': operationType,
          source: 'graphql-client',
        },
        extra: {
          operationName,
          operationType,
          httpStatus:
            error && typeof error === 'object' && 'response' in error
              ? (error as any).response?.status
              : undefined,
          errorMessage:
            error && typeof error === 'object' && 'response' in error
              ? (error as any).response?.errors?.[0]?.message
              : error instanceof Error
                ? error.message
                : String(error),
        },
      });
    }

    if (error && typeof error === 'object' && 'response' in error) {
      const gqlError = error as {
        response: {
          status?: number;
          errors: Array<{
            message: string;
            extensions?: {
              code?: string;
              feature_code?: string;
              required_tier?: string;
              current_tier?: string;
              upgrade_url?: string;
            };
          }>;
        };
      };

      const firstError = gqlError.response?.errors?.[0];

      // NOTE: This 402 feature-gating code depends on lemonade-backend PR #1911 (snake_case rename)
      // being merged first. The Space fragment fields (subscription_tier, subscription_status, etc.)
      // must exist on the backend schema.
      if (String(firstError?.extensions?.code) === '402') {
        try {
          const parsed = JSON.parse(firstError.message);
          if (parsed.error === 'feature_gated') {
            const featureError: FeatureGatedError = {
                message: parsed.message || 'This feature requires a plan upgrade',
                featureGated: true,
                featureCode: parsed.feature_code,
                requiredTier: parsed.required_tier,
                currentTier: parsed.current_tier,
                upgradeUrl: parsed.upgrade_url,
              };
            request.resolve({
              data: null,
              error: featureError,
            });
            return;
          }
        } catch {
          // message is not JSON, fall through to generic handler
        }
      }

      if (firstError?.message) {
        // Preserve `extensions.code` (e.g. 'CONFLICT' for 409, 'FORBIDDEN'
        // for 403, or the numeric-string status for anything not in the
        // formatError switch) alongside the message. This is additive — the
        // existing `{ message }` shape still works for callers that only
        // consume `.message`. Callers that want reliable status-based
        // classification (e.g. hostname verification's 409-reroll handling)
        // can read `.code` instead of regex-matching free-text messages.
        const extensionsCode = firstError.extensions?.code;
        const code = extensionsCode !== undefined ? String(extensionsCode) : undefined;
        request.resolve({
          data: null,
          error: { message: firstError.message, code },
        });
        return;
      }
    }

    request.resolve({ data: null, error });
  }

  writeQuery<T, V extends Record<string, unknown>>({
    query,
    variables = {} as V,
    data,
  }: {
    query: TypedDocumentNode<T, V>;
    variables?: V;
    data: T;
  }) {
    this.cache?.writeQuery({ query, variables, data });
  }

  writeFragment<T>({ id, data }: { id: string; data: Partial<T> }) {
    this.cache?.writeFragment({ id, data });
  }

  subscribe<T, V extends object>({
    query,
    variables = {} as V,
    callback,
  }: {
    query: TypedDocumentNode<T, V>;
    variables?: V;
    callback: () => void;
  }) {
    const queryKey = this.cache?.createCacheKey(query, variables as Record<string, unknown>);
    if (queryKey) this.cache?.subscribe(queryKey, callback);
  }

  readQuery<T, V extends Record<string, unknown>>(query: TypedDocumentNode<T, V>, variables?: V) {
    return this.cache?.readQuery(query, variables);
  }

  private getHeaders(headers?: HeadersInit): HeadersInit {
    const store = getDefaultStore();
    const session = store.get(sessionAtom) as any;
    const defaultHeaders: HeadersInit = {};

    if (session?.token) {
      defaultHeaders['Authorization'] = `Bearer ${session.token}`;
    }

    /**
     * @description using for detect user profile with lens account -
     * for some reasons it doesn't work at some requests - it's bc waiting for detect connect wallet - account from lens
     *
     * NOTE: it could be changed when user switch lens account - updated with customerHeader
     * */
    if (session?.lens_address) {
      defaultHeaders['x-lens-profile-id'] = session.lens_address;
    }

    // Session tracking headers for device fingerprinting
    defaultHeaders['X-Client-Type'] = 'web';
    defaultHeaders['X-Client-App-Version'] = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';
    if (typeof navigator !== 'undefined') {
      defaultHeaders['X-Client-Locale'] = navigator.language;
    }

    return { ...defaultHeaders, ...headers, ...this.customHeader };
  }
}

export function getClient() {
  return new GraphqlClient({
    url: GRAPHQL_URL!,
  });
}
