/* eslint-disable  @typescript-eslint/no-explicit-any */

import { GraphQLClient } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { InMemoryCache } from './cache';

interface QueryRequest<T, V extends object> {
  query: TypedDocumentNode<T, V>;
  variables?: V;
  initData?: T;
  headers?: HeadersInit;
  resolve: (result: T) => void;
  reject: (error: any) => void;
}

export default class GraphqlClient {
  private client: GraphQLClient;
  cache?: InMemoryCache;
  private queue: QueryRequest<any, any>[] = [];
  private processing: boolean = false;

  constructor({ url, cache, headers }: { url: string; cache?: InMemoryCache; headers?: HeadersInit }) {
    this.client = new GraphQLClient(url, {
      cache: 'no-store',
      headers,
    });
    this.cache = cache;
  }

  // @ignore-check
  async query<T, V extends object>({
    query,
    variables,
    initData,
    headers,
  }: {
    query: TypedDocumentNode<T, V>;
    variables?: V;
    initData?: T;
    headers?: HeadersInit;
  }): Promise<{ data: T; error: any }> {
    return new Promise((resolve, reject) => {
      this.queue.push({ query, variables, headers, initData, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue<T, V extends object>() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const { query, variables = {}, initData, headers, resolve } = this.queue.shift()!;
    if (headers) this.client.setHeaders(headers);

    try {
      const cacheData = this.cache?.readQuery<T, V>(query, variables);

      if (cacheData) {
        resolve(cacheData);
      } else {
        let result = initData;
        if (!result) result = await this.client.request(query, variables);
        this.cache?.normalizeAndStore<T, V>(query, variables, result);
        resolve({ data: result, error: null });
      }
    } catch (error) {
      resolve({ data: null, error });
    } finally {
      this.processing = false;
      this.processQueue();
    }
  }
}

export const client = new GraphqlClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_URL!,
});
