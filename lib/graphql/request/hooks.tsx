import React from 'react';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { MutationOptions, QueryOptions } from './type';
import { GraphqlClient } from './client';
import { defaultClient } from './instances';

export function useQuery<T, V extends object>(
  query: TypedDocumentNode<T, V>,
  {
    variables,
    initData = null,
    skip = false,
    fetchPolicy,
    onComplete,
  }: QueryOptions<T, V> & { onComplete?: (data: T) => void } = {},
  client: GraphqlClient = defaultClient,
) {
  const [data, setData] = React.useState<T | null>(initData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const fetchData = async (fetchDataPolicy = fetchPolicy) => {
    try {
      setLoading(true);
      const { data: queryData } = await client.query({
        query,
        variables,
        initData,
        fetchPolicy: fetchDataPolicy,
      });
      setData(queryData);
      onComplete?.(queryData as T);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = async (params: { variables: Partial<V>; updateQuery?: (existing: T, res: T) => T }) => {
    const { data: newData } = await client.query({
      query,
      variables: { ...variables, ...params.variables },
      fetchPolicy: 'network-only',
    });
    const latestData = params.updateQuery?.(data as T, newData);
    setData(latestData as T);
    onComplete?.(latestData as T); // Call onComplete with updated data
  };

  const variablesKey = React.useMemo(() => JSON.stringify(variables), [variables]);

  React.useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [skip, variablesKey]);

  React.useEffect(() => {
    client.subscribe({
      query,
      variables,
      callback: () => {
        const res = client.readQuery(query, variables);
        setData(res as T);
      },
    });
  }, []);

  return { data, loading, error, fetchMore, client, refetch: () => fetchData('network-only') };
}

export function useMutation<T, V extends object>(
  query: TypedDocumentNode<T, V>,
  options?: MutationOptions<T, V>,
  client: GraphqlClient = defaultClient,
): [
  (
    opts: MutationOptions<T, V>,
  ) => Promise<{ data?: T | null; error: unknown; loading: boolean; client: GraphqlClient }>,
  { data?: T | null; error: unknown; loading: boolean; client: GraphqlClient },
  client: GraphqlClient,
] {
  const [data, setData] = React.useState<T | null>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const mutate = async (opts: MutationOptions<T, V>) => {
    const merged = { ...options, ...opts };
    setLoading(true);
    const { data, error } = await client.query({
      query,
      variables: merged.variables,
      fetchPolicy: 'network-only',
    });
    setData(data);
    setError(error);
    setLoading(false);
    if (error) {
      merged.onError?.(error);
    } else {
      if (!error) {
        merged.onComplete?.(client, data);
      }
    }
    return { data, error, loading: false, client };
  };

  return [mutate, { data, error, client, loading }];
}
