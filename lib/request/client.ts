/* eslint-disable  @typescript-eslint/no-explicit-any */

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
  query: TypedDocumentNode<T, V>;
  variables?: V;
  initData?: T | null;
  fetchPolicy?: FetchPolicy;
  headers?: HeadersInit;
  resolve: (result: T) => void;
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
  }): Promise<{ data: T; error: any }> {
    return new Promise((resolve, reject) => {
      this.queue.push({ query, variables, headers, initData, fetchPolicy, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue<T, V extends object>() {
    if (this.processing || this.queue.length === 0) return;

    const { query, variables, headers, fetchPolicy, initData, resolve } = this.queue.shift()!;
    if (headers) this.client.setHeaders(headers);

    try {
      if (fetchPolicy === 'network-only') {
        const result = await this.client.request(query, variables);
        resolve({ data: result, error: null });
        return;
      }

      const cacheData = this.cache?.readQuery<T, V>(query, variables);

      if (cacheData) {
        resolve({ data: cacheData });
        return;
      }

      this.processing = true;

      let result = initData;
      if (!result) result = await this.client.request(query, variables);
      this.cache?.normalizeAndStore<T, V>(query, variables, result);
      resolve({ data: result, error: null });
    } catch (error) {
      resolve({ data: null, error: error });
    } finally {
      this.processing = false;
      this.processQueue();
    }
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

export const client = new GraphqlClient({
  url: GRAPHQL_URL!,
});
