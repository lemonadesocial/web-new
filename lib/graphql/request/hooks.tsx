import React from 'react';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { MutationOptions, QueryOptions } from './type';
import { GraphqlClient } from './client';
import { defaultClient } from './instances';

function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (a.constructor !== b.constructor) return false;
    let length, i;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!isEqual(a[i], b[i])) return false;
      return true;
    }
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;
    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    for (i = length; i-- !== 0; ) {
      const key = keys[i];
      if (!isEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return a !== a && b !== b;
}

export function useQuery<T, V extends object>(
  query: TypedDocumentNode<T, V>,
  {
    variables,
    initData = null,
    skip = false,
    fetchPolicy,
    onComplete,
    onError,
  }: QueryOptions<T, V> & { onComplete?: (data: T) => void; onError?: (error: unknown) => void } = {},
  client: GraphqlClient = defaultClient,
) {
  const variablesKey = React.useMemo(() => JSON.stringify(variables), [variables]);

  const [data, setData] = React.useState<T | null>(() => {
    if (initData) return initData;
    if (skip) return null;
    return (client.readQuery(query, variables as any) as T) || null;
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const lastUpdateRef = React.useRef<string>('');

  const fetchData = async (fetchDataPolicy = fetchPolicy) => {
    try {
      setLoading(true);
      const { data: queryData } = await client.query({
        query,
        variables,
        initData,
        fetchPolicy: fetchDataPolicy,
      });

      const nextData = queryData as T;
      const nextDataKey = JSON.stringify(nextData);

      setData((prev) => {
        if (isEqual(prev, nextData)) return prev;
        return nextData;
      });

      lastUpdateRef.current = nextDataKey;
      onComplete?.(nextData);
    } catch (error) {
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = async (params: { variables: Partial<V>; updateQuery?: (existing: T, res: T) => T }) => {
    try {
      setLoading(true);
      const { data: newData } = await client.query({
        query,
        variables: { ...(variables as any), ...(params.variables as any) },
        fetchPolicy: 'network-only',
      });
      const latestData = params.updateQuery?.(data as T, newData as T) as T;

      setData((prev) => {
        if (isEqual(prev, latestData)) return prev;
        return latestData;
      });

      lastUpdateRef.current = JSON.stringify(latestData);
      onComplete?.(latestData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [skip, variablesKey]);

  const subscriptionVariables = React.useMemo(() => ({ query, variables }), [query, variablesKey]);

  React.useEffect(() => {
    if (skip) return;

    const unsubscribe = client.subscribe({
      ...subscriptionVariables,
      callback: () => {
        const res = client.readQuery(subscriptionVariables.query, subscriptionVariables.variables as any);
        if (res) {
          const resKey = JSON.stringify(res);
          if (resKey === lastUpdateRef.current) return;

          setData((prev) => {
            if (isEqual(prev, res)) return prev;
            lastUpdateRef.current = resKey;
            return { ...res } as T;
          });
        }
      },
    });

    return unsubscribe;
  }, [skip, subscriptionVariables]);

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
    const { data: result, error } = await client.query({
      query,
      variables: merged.variables,
      fetchPolicy: 'network-only',
    });

    setData((prev) => {
      if (isEqual(prev, result)) return prev;
      return result as T;
    });

    setError(error);
    setLoading(false);
    if (error) {
      merged.onError?.(error as any);
    } else {
      merged.onComplete?.(client, result as T);
    }
    return { data: result as T, error, loading: false, client };
  };

  return [mutate, { data, error, client, loading }, client];
}


