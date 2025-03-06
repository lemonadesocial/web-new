'use client';
import React from 'react';
import { GraphqlClienProvider, GraphqlClient, InMemoryCache } from '$lib/request';
import { GRAPHQL_URL } from '$lib/utils/constants';

const client = new GraphqlClient({
  url: GRAPHQL_URL,
  cache: new InMemoryCache(),
  options: {
    credentials: 'include',
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return <GraphqlClienProvider client={client}>{children}</GraphqlClienProvider>;
}
