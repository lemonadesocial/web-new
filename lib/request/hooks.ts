/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'react';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useClient } from './provider';

interface QueryOption<T, V> {
  variables: V;
  initData?: T | null;
  skip: boolean;
}

export default function useQuery<T, V extends object>(
  query: TypedDocumentNode<T, V>,
  { variables, initData = null, skip = false }: QueryOption<T, V>,
) {
  const { client } = useClient();

  const [data, setData] = React.useState<T | null>(initData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const fetch = async () => {
    const cachedData = client.cache?.readQuery<T, V>(query, variables);

    if (cachedData) {
      setData(cachedData);
    } else {
      try {
        if (!initData || !!Object.keys(initData).length) setLoading(true);
        const result = await client.query({ query, variables, initData });
        setError(null);
        setData(result as T);
      } catch (err) {
        setData(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if (!skip) {
      fetch();
      const key = client.cache?.createCacheKey(query);
      client.cache?.subscribe(key!, fetch);
    }
  }, [skip]);

  return { data, loading, error, refetch: fetch, client };
}
