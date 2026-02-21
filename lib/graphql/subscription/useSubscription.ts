import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql/language/printer';

import { GraphQLWSContext } from './context';
import { OperationVariables } from './types';

export interface SubscriptionHookOptions<TData = unknown, TVariables = OperationVariables> {
  variables?: TVariables;
  onData?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

export interface SubscriptionHookResult<TData = unknown> {
  data: TData | null;
  loading: boolean;
  error: unknown;
}

export const useSubscription = <T, V>(
  query: TypedDocumentNode<T, V>,
  options?: SubscriptionHookOptions<T, V>
): SubscriptionHookResult<T> => {
  const { client } = useContext(GraphQLWSContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [data, setData] = useState<T | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const onData = options?.onData;
  const onErrorCallback = options?.onError;

  const queryString = useMemo(() => (
      typeof query === 'string' ? query : print(query)
  ), [query]);

  const variablesString = useMemo(() => (
      options?.variables ? JSON.stringify(options.variables) : ''
  ), [options?.variables]);

  useEffect(() => {
    if (!client) {
      setError(new Error('GraphQL WS Client not available in context.'));
      setLoading(false);
      return () => {};
    }

    if (!queryString) {
        setError(new Error('Invalid GraphQL query provided.'));
        setLoading(false);
        return () => {};
    }

    setLoading(true);
    setError(null);
    setData(null);

    unsubscribeRef.current?.();

    const unsubscribe = client.subscribe<T>(
      {
        query: queryString,
        variables: options?.variables,
      },
      {
        next: (payload) => {
          let currentError = null;
          if (payload.errors) {
             console.error('GraphQL operation errors:', payload.errors);
             currentError = payload.errors;
             onErrorCallback?.(currentError);
          }

          if (payload.data !== undefined && payload.data !== null) {
             setData(payload.data);
             onData?.(payload.data);
          }

          setError(currentError);

          setLoading(false);
        },
        error: (err) => {
          setError(err);
          onErrorCallback?.(err);
          setLoading(false);
          unsubscribeRef.current = null;
        },
        complete: () => {
          setLoading(false);
          unsubscribeRef.current = null;
        },
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };

  }, [client, queryString, variablesString]);

  return { data, loading, error };
};
