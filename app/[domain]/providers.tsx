'use client';
import React from 'react';
import { GraphqlClientProvider, GraphqlClient, InMemoryCache } from '$lib/request';
import { GRAPHQL_URL } from '$lib/utils/constants';

import { useOryAuth } from '$lib/hooks/useOryAuth';
import { useListChains } from '$lib/hooks/useListChains';

const client = new GraphqlClient({
  url: GRAPHQL_URL,
  cache: new InMemoryCache(),
  options: {
    credentials: 'include',
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const oryLoading = useOryAuth();
  const chainsLoading = useListChains();

  if (oryLoading || chainsLoading) return null;

  return (
    <GraphqlClientProvider client={client}>
      {children}
    </GraphqlClientProvider>
  );
}
