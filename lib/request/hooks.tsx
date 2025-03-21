import React from 'react';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { useClient } from './provider';
import { MutationOptions, QueryOptions } from './type';
import { GraphqlClient } from './client';

export function useQuery<T, V extends object>(
  query: TypedDocumentNode<T, V>,
  { variables, initData = null, skip = false, fetchPolicy }: QueryOptions<T, V> = {},
) {
  const { client } = useClient();
  const [data, setData] = React.useState<T | null>(initData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await client.query({ query, variables, initData, fetchPolicy });
      setData(data);
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
  };

  const variablesKey = React.useMemo(() => JSON.stringify(variables), [variables]);

  React.useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [skip, variablesKey]);

  React.useEffect(() => {
    client.subscribe({ query, variables, callback: fetchData });
  }, []);

  return { data, loading, error, fetchMore, client };
}

export function useMutation<T, V extends object>(
  query: TypedDocumentNode<T, V>,
  options?: MutationOptions<T, V>,
): [
  (
    opts: MutationOptions<T, V>,
  ) => Promise<{ data?: T | null; error: unknown; loading: boolean; client: GraphqlClient }>,
  { data?: T | null; error: unknown; loading: boolean; client: GraphqlClient },
] {
  const { client } = useClient();
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
  };

  return [mutate, { data, error, client, loading }];
}
