import { GraphqlClient } from './client';

export type QueryOptions<T, V> = {
  variables?: V;
  skip?: boolean;
  initData?: T | null;
  fetchPolicy?: FetchPolicy;
};

export type MutationOptions<T, V> = {
  variables?: V;
  onError?: (error: Error) => void;
  onComplete?: (client: GraphqlClient, response: T) => void;
};

export type FetchPolicy = 'cache-first' | 'cache-and-network' | 'network-only';
