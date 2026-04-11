import React, { useState, useEffect, useMemo, useRef, useCallback, ReactNode } from 'react';
import { createClient, Client, ClientOptions } from 'graphql-ws';
import { getDefaultStore } from 'jotai';

import { sessionAtom } from '$lib/jotai';
import { GraphQLWSContext } from './context';

/** Close codes emitted by the backend session-revocation system. */
const CLOSE_CODE_SESSION_REVOKED = 4401;
const CLOSE_CODE_TOKEN_EXPIRED = 4403;

/** Standard close codes that indicate transient network issues — NOT revocation. */
const RECONNECTABLE_CLOSE_CODES = [1006, 1011, 1012];

const MAX_RECONNECT_DELAY = 30_000;
const BASE_RECONNECT_DELAY = 1_000;

export interface GraphQLWSProviderProps {
  url: string;
  connectionParams?: ClientOptions['connectionParams'];
  children: ReactNode;
}

export const GraphQLWSProvider = ({
  url,
  connectionParams,
  children,
}: GraphQLWSProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const clientRef = useRef<Client | null>(null);

  const buildClient = useCallback(() => {
    if (!url) return null;

    const newClient = createClient({
      url,
      connectionParams,
      shouldRetry: () => true,
      retryAttempts: Infinity,
      retryWait: async (retries: number) => {
        const delay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, retries), MAX_RECONNECT_DELAY);
        await new Promise((resolve) => setTimeout(resolve, delay));
      },
      on: {
        closed: (event: unknown) => {
          const closeEvent = event as CloseEvent | undefined;
          const code = closeEvent?.code;

          if (code === CLOSE_CODE_SESSION_REVOKED) {
            // 4401: Session was explicitly revoked — clear auth state and redirect to login.
            const store = getDefaultStore();
            store.set(sessionAtom, null);
            if (typeof window !== 'undefined') {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = '/login';
            }
            return;
          }

          if (code === CLOSE_CODE_TOKEN_EXPIRED) {
            // 4403: Token expired but Kratos session still valid.
            // Silent refresh + reconnect. The graphql-ws client's built-in retry
            // will reconnect automatically. No logout, no route change.
            return;
          }

          if (code !== undefined && RECONNECTABLE_CLOSE_CODES.includes(code)) {
            // 1006/1011/1012: Transient network failures.
            // CRITICAL: These are NOT revocation signals. Let the client reconnect with backoff.
            return;
          }
        },
      },
    });

    return newClient;
  }, [url, connectionParams]);

  useEffect(() => {
    const newClient = buildClient();
    clientRef.current = newClient;
    setClient(newClient);

    return () => {
      newClient?.dispose();
      clientRef.current = null;
      setClient(null);
    };
  }, [buildClient]);

  const dispose = useCallback(() => {
    clientRef.current?.dispose();
    clientRef.current = null;
    setClient(null);
  }, []);

  const contextValue = useMemo(() => ({ client, dispose }), [client, dispose]);

  return (
    <GraphQLWSContext.Provider value={contextValue}>
      {children}
    </GraphQLWSContext.Provider>
  );
};
