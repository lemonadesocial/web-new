import { GraphQLClient } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { InMemoryCache } from './cache';
import { FetchPolicy } from './type';
import { GRAPHQL_URL } from '$lib/utils/constants';
import { log } from '$lib/utils/helpers';

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

  constructor({ url, cache, options = {} }: { url: string; cache?: InMemoryCache; options?: RequestConfig }) {
    this.client = new GraphQLClient(url, { cache: 'no-store', ...options });
    this.cache = cache;
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
        headers,
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
        headers,
        resolve,
        reject,
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    const request = this.queue.shift()!;
    this.processing = true;

    try {
      if (request.headers) this.client.setHeaders(request.headers);

      if (request.type === 'query') {
        const { query, variables, fetchPolicy, initData } = request;
        if (fetchPolicy === 'network-only') {
          const result = await this.client.request(query, variables);
          request.resolve({ data: result, error: null });
        } else {
          const cacheData = this.cache?.readQuery(query, variables);
          if (cacheData) {
            request.resolve({ data: cacheData, error: null });
          } else {
            let result = initData;
            if (!result) result = await this.client.request(query, variables);
            this.cache?.normalizeAndStore(query, variables, result);
            request.resolve({ data: result, error: null });
          }
        }
      } else if (request.type === 'refetch') {
        const { query, variables } = request;
        const result = await this.client.request(query, variables);
        this.cache?.normalizeAndStore(query, variables, result);
        request.resolve({ data: result, error: null });
      }
    } catch (error) {
      request.resolve({ data: null, error });
    } finally {
      this.processing = false;
      this.processQueue();
    }
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
}

export function getClient() {
  return new GraphqlClient({
    url: GRAPHQL_URL!,
  });
}
