import { GraphQLClient } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { getDefaultStore } from 'jotai';

import { GRAPHQL_URL } from '$lib/utils/constants';
import { log } from '$lib/utils/helpers';
import { sessionAtom } from '$lib/jotai';

import { InMemoryCache } from './cache';
import { FetchPolicy } from './type';

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
  resolve: (result: { data: T | null; error: unknown }) => void;
  reject: (error: unknown) => void;
}

interface RequestConfig {
  cache?: 'no-store' | 'no-cache';
  credentials?: 'omit' | 'include' | 'same-origin';
}

export class GraphqlClient {
  private client: GraphQLClient;
  private cache?: InMemoryCache;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous queue requires type erasure
  private queue: QueryRequest<any, any>[] = [];
  private processing: boolean = false;
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
    variables = {},
    fetchPolicy = 'cache-first',
    headers,
    initData,
  }: {
    query: TypedDocumentNode<T, V>;
    headers?: HeadersInit;
    variables?: object;
    fetchPolicy?: FetchPolicy;
    initData?: T;
  }): Promise<{ data: T | null; error: unknown }> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        type: 'query',
        query,
        variables,
        headers: this.getHeaders(headers),
        initData,
        fetchPolicy,
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
  }: {
    query: TypedDocumentNode<T, V>;
    variables?: V;
    headers?: HeadersInit;
  }): Promise<{ data: T | null; error: unknown }> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        type: 'refetch',
        query,
        variables,
        headers: this.getHeaders(headers),
        resolve,
        reject,
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const request = this.queue.shift()!;

    try {
      if (request.headers) {
        this.client.setHeaders(request.headers);
      }

      await this.executeRequest(request);
    } catch (error) {
      this.handleRequestError(request, error);
    } finally {
      this.processing = false;
      this.processQueue();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- type-erased queue item
  private async executeRequest(request: QueryRequest<any, any>) {
    if (request.type === 'refetch') {
      await this.executeNetworkRequest(request);
      return;
    }

    const { fetchPolicy, initData } = request;

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
      result = await this.client.request(request.query, request.variables);
    }
    this.cache?.normalizeAndStore(request.query, request.variables, result);
    request.resolve({ data: result, error: null });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- type-erased queue item
  private async executeNetworkRequest(request: QueryRequest<any, any>) {
    const { query, variables } = request;
    const result = await this.client.request(query, variables);

    this.cache?.normalizeAndStore(query, variables, result);
    request.resolve({ data: result, error: null });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- type-erased queue item
  private handleRequestError(request: QueryRequest<any, any>, error: unknown) {
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

      if (firstError?.extensions?.code === 402) {
        try {
          const parsed = JSON.parse(firstError.message);
          if (parsed.error === 'feature_gated') {
            request.resolve({
              data: null,
              error: {
                message: parsed.message || 'This feature requires a plan upgrade',
                featureGated: true,
                featureCode: parsed.feature_code,
                requiredTier: parsed.required_tier,
                currentTier: parsed.current_tier,
                upgradeUrl: parsed.upgrade_url,
              },
            });
            return;
          }
        } catch {
          // message is not JSON, fall through to generic handler
        }
      }

      if (firstError?.message) {
        request.resolve({
          data: null,
          error: { message: firstError.message },
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
    variables = {},
    callback,
  }: {
    query: TypedDocumentNode<T, V>;
    variables?: object;
    callback: () => void;
  }) {
    const queryKey = this.cache?.createCacheKey(query, variables);
    if (queryKey) this.cache?.subscribe(queryKey, callback);
  }

  readQuery<T, V extends Record<string, unknown>>(query: TypedDocumentNode<T, V>, variables?: V) {
    return this.cache?.readQuery(query, variables);
  }

  private getHeaders(headers?: HeadersInit): HeadersInit {
    const store = getDefaultStore();
    const session = store.get(sessionAtom);
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

    return { ...defaultHeaders, ...headers, ...this.customHeader };
  }
}

export function getClient() {
  return new GraphqlClient({
    url: GRAPHQL_URL!,
  });
}
