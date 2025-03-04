import React from 'react';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { useClient } from './provider';
import { QueryOptions } from './type';

export function useQuery<T, V extends object>(
  query: TypedDocumentNode<T, V>,
  { variables, initData = null, skip = false, fetchPolicy }: QueryOptions<T, V>,
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

  return { data, loading, error, fetchMore, client };
}
