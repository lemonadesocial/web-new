'use client';

import React from 'react';
import GraphqlClient from './client';

interface GraphqlClientContextType {
  client: GraphqlClient;
}

const GraphqlClientContext = React.createContext<GraphqlClientContextType | null>(null);

export default function GraphqlClienProvider(props: React.PropsWithChildren & { client: GraphqlClient }) {
  return <GraphqlClientContext.Provider value={{ client: props.client }}>{props.children}</GraphqlClientContext.Provider>;
}

export const useClient = () => {
  const context = React.useContext(GraphqlClientContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an GraphqlClienProvider');
  }
  return context;
};

