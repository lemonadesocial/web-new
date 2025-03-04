export type QueryOptions<T, V> = {
  variables?: V;
  skip?: boolean;
  initData?: T | null;
  fetchPolicy?: FetchPolicy;
};

export type FetchPolicy = 'cache-first' | 'cache-and-network' | 'network-only';
