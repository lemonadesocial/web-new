'use client';
import React from 'react';
import { GraphqlClientProvider, GraphqlClient, InMemoryCache } from '$lib/request';
import { GRAPHQL_URL } from '$lib/utils/constants';
import { OryAuthProvider } from '$lib/providers/OryAuthProvider';
import { ListChainsProvider } from '$lib/providers/ListChainsProvider';

const client = new GraphqlClient({
  url: GRAPHQL_URL,
  cache: new InMemoryCache(),
  options: {
    credentials: 'include',
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OryAuthProvider>
      <GraphqlClientProvider client={client}>
        <ListChainsProvider>{children}</ListChainsProvider>
      </GraphqlClientProvider>
    </OryAuthProvider>
  );
}
