'use client';
import React from 'react';
import { useSetAtom } from 'jotai';

import { GraphqlClientProvider } from '$lib/graphql/request';
import { initializeAppKit } from '$lib/utils/appkit';
import { useListChains } from '$lib/hooks/useListChains';
import { SpaceHydraKeys } from '$lib/utils/space';
import { hydraClientIdAtom } from '$lib/jotai';
import { defaultClient } from '$lib/graphql/request/instances';
import { useResumeSession as useLensResumeSession } from '$lib/hooks/useLens';
import { useAuth } from "../../lib/hooks/useAuth";

export default function Providers({ children, space }: { children: React.ReactNode; space?: SpaceHydraKeys | null; }) {
  const chainsLoading = useListChains();
  const setHydraClientId = useSetAtom(hydraClientIdAtom);
  const [appKitReady, setAppKitReady] = React.useState(false);
  useLensResumeSession();
  const { loading: loadingAuth } = useAuth(true);

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

  if (chainsLoading || !appKitReady || loadingAuth) return null;

  return (
    <GraphqlClientProvider client={defaultClient}>
      {children}
    </GraphqlClientProvider>
  );
}
