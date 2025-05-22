'use client';
import React from 'react';
import { useSetAtom } from 'jotai';

import { GraphqlClientProvider } from '$lib/graphql/request';
import { initializeAppKit, appKit } from '$lib/utils/appkit';
import { useAuth } from '$lib/hooks/useAuth';
import { useListChains } from '$lib/hooks/useListChains';
import { SpaceHydraKeys } from '$lib/utils/space';
import { hydraClientIdAtom } from '$lib/jotai';
import { defaultClient } from '$lib/graphql/request/instances';

export default function Providers({ children, space }: { children: React.ReactNode; space?: SpaceHydraKeys | null; }) {
  const oryLoading = useAuth(space?.hydra_client_id);
  const chainsLoading = useListChains();
  const setHydraClientId = useSetAtom(hydraClientIdAtom);
  const [appKitReady, setAppKitReady] = React.useState(false);

  React.useEffect(() => {
    if (!chainsLoading) {
      initializeAppKit();
      setAppKitReady(true);
    }
  }, [chainsLoading]);

  React.useEffect(() => {
    if (space?.hydra_client_id) {
      setHydraClientId(space.hydra_client_id);
    }
  }, [space]);

  if (oryLoading || chainsLoading || !appKitReady) return null;

  return (
    <GraphqlClientProvider client={defaultClient}>
      {children}
    </GraphqlClientProvider>
  );
}
