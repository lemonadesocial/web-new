import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { createClient, Client, ClientOptions } from 'graphql-ws';
import { GraphQLWSContext } from './context';

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

  useEffect(() => {
    const newClient = createClient({
      url,
      connectionParams,
    });

    setClient(newClient);

    return () => {
      newClient.dispose();
      setClient(null);
    };
  }, [url, connectionParams]);

  const contextValue = useMemo(() => ({ client }), [client]);

  return (
    <GraphQLWSContext.Provider value={contextValue}>
      {children}
    </GraphQLWSContext.Provider>
  );
};
