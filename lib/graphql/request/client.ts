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
  resolve: (result: { data: T | null; error: any }) => void;
  reject: (error: any) => void;
}

interface RequestConfig {
  cache?: 'no-store' | 'no-cache';
  credentials?: 'omit' | 'include' | 'same-origin';
}

export class GraphqlClient {
  private client: GraphQLClient;
  private cache?: InMemoryCache;
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
  }): Promise<{ data: T | null; error: any }> {
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
  }): Promise<{ data: T | null; error: any }> {
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

  private async executeNetworkRequest(request: QueryRequest<any, any>) {
    const { query, variables } = request;
    const result = await this.client.request(query, variables);

    this.cache?.normalizeAndStore(query, variables, result);
    request.resolve({ data: result, error: null });
  }

  private handleRequestError(request: QueryRequest<any, any>, error: any) {
    if (error && typeof error === 'object' && 'response' in error) {
      const gqlError = error as { response: { errors: Array<{ message: string }> } };

      if (gqlError.response?.errors?.[0]?.message) {
        request.resolve({
          data: null,
          error: { message: gqlError.response.errors[0].message },
        });
        return;
      }
    }

    request.resolve({ data: null, error });
  }

  writeQuery<T, V extends Record<string, any>>({
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

  readQuery<T, V extends Record<string, any>>(query: TypedDocumentNode<T, V>, variables?: V) {
    return this.cache?.readQuery(query, variables);
  }

  private getHeaders(headers?: HeadersInit): HeadersInit {
    const store = getDefaultStore();
    const session = store.get(sessionAtom);
    const defaultHeaders: HeadersInit = {};

    if (session?.token) {
      defaultHeaders['Authorization'] = `Bearer ${session.token}`;
    }

    return { ...defaultHeaders, ...headers, ...this.customHeader };
  }
}

export function getClient() {
  return new GraphqlClient({
    url: GRAPHQL_URL!,
  });
}
