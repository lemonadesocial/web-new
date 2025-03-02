import React from 'react';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { useClient } from './provider';

interface QueryOption<T, V> {
  variables: V;
  initData?: T | null;
  skip: boolean;
}

export function useQuery<T, V extends object>(
  query: TypedDocumentNode<T, V>,
  { variables, initData = null, skip = false }: QueryOption<T, V>,
) {
  const { client } = useClient();
  const [data, setData] = React.useState<T | null>(initData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await client.query({ query, variables, initData });
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const variablesKey = React.useMemo(() => JSON.stringify(variables), [variables]);

  React.useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [skip, variablesKey]);

  return { data, loading, error, client };
}
