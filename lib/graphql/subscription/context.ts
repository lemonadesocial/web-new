import { createContext } from 'react';
import { Client } from 'graphql-ws';

export interface GraphQLWSContextValue {
  client: Client | null;
  dispose: () => void;
}

export const GraphQLWSContext = createContext<GraphQLWSContextValue>({
  client: null,
  dispose: () => {},
});
