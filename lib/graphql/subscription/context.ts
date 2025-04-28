import { createContext } from 'react';
import { Client } from 'graphql-ws';

export interface GraphQLWSContextValue {
  client: Client | null;
}

export const GraphQLWSContext = createContext<GraphQLWSContextValue>({
  client: null,
});
