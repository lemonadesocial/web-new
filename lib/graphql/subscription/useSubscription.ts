import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';

import { GraphQLWSContext } from './context';
import { OperationVariables } from './types';

export interface SubscriptionHookOptions<TData = any, TVariables = OperationVariables> {
  variables?: TVariables;
  onData?: (data: TData) => void;
  onError?: (error: any) => void;
}

export interface SubscriptionHookResult<TData = any> {
  data: TData | null;
  loading: boolean;
  error: any | null;
}

export const useSubscription = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | string,
  options?: SubscriptionHookOptions<TData, TVariables>
): SubscriptionHookResult<TData> => {
  const { client } = useContext(GraphQLWSContext);
  console.log('client', client);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [data, setData] = useState<TData | null>(null);

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

    const unsubscribe = client.subscribe<TData>(
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

  }, [client, queryString, variablesString, onData, onErrorCallback]);

  return { data, loading, error };
};
