'use client';
import React from 'react';
import { useSetAtom } from 'jotai';

import { GraphqlClientProvider, GraphqlClient, InMemoryCache } from '$lib/request';
import { GRAPHQL_URL } from '$lib/utils/constants';
import { initializeAppKit } from '$lib/utils/appkit';
import { useAuth } from '$lib/hooks/useAuth';
import { useListChains } from '$lib/hooks/useListChains';
import { SpaceHydraKeys } from '$lib/utils/space';
import { hydraClientIdAtom } from '$lib/jotai';

const client = new GraphqlClient({
  url: GRAPHQL_URL,
  cache: new InMemoryCache(),
  options: {
    credentials: 'include',
  },
});

export default function Providers({ children, space }: { children: React.ReactNode; space?: SpaceHydraKeys | null; }) {
  const oryLoading = useAuth(space?.hydra_client_id);
  const chainsLoading = useListChains();
  const setHydraClientId = useSetAtom(hydraClientIdAtom);

  React.useEffect(() => {
    if (!chainsLoading) {
      initializeAppKit();
    }
  }, [chainsLoading]);

  React.useEffect(() => {
    if (space?.hydra_client_id) {
      setHydraClientId(space.hydra_client_id);
    }
  }, [space]);

  if (oryLoading || chainsLoading) return null;

  return (
    <GraphqlClientProvider client={client}>
      {children}
    </GraphqlClientProvider>
  );
}
