'use client';
import React from 'react';
import { GraphqlClienProvider, GraphqlClient, InMemoryCache } from '$lib/request';

const client = new GraphqlClient({ url: process.env.NEXT_PUBLIC_GRAPHQL_URL as string, cache: new InMemoryCache() });

export default function Providers({ children }: { children: React.ReactNode }) {
  return <GraphqlClienProvider client={client}>{children}</GraphqlClienProvider>;
}
