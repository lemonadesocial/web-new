'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';
import GraphqlClient from '../lib/request/client';
import { InMemoryCache } from '../lib/request/cache';
import GraphqlClienProvider from '../lib/request/provider';

const client = new GraphqlClient({ url: process.env.NEXT_PUBLIC_GRAPHQL_URL as string, cache: new InMemoryCache() });

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <GraphqlClienProvider client={client}>
      <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
    </GraphqlClienProvider>
  );
}
