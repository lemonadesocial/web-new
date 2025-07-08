'use client';
import React from 'react';
import { useSetAtom } from 'jotai';
import { WagmiProvider, createConfig } from 'wagmi';
import { DaimoPayProvider, getDefaultConfig } from '@daimo/pay';

import { GraphqlClientProvider } from '$lib/graphql/request';
import { initializeAppKit } from '$lib/utils/appkit';
import { useAuth } from '$lib/hooks/useAuth';
import { useListChains } from '$lib/hooks/useListChains';
import { SpaceHydraKeys } from '$lib/utils/space';
import { hydraClientIdAtom } from '$lib/jotai';
import { defaultClient } from '$lib/graphql/request/instances';
import { useResumeSession as useLensResumeSession} from '$lib/hooks/useLens';
import TRPCProvider from '$lib/trpc/provider';

const config = createConfig(
  getDefaultConfig({
    appName: 'Lemonade',
  }),
)


export default function Providers({ children, space }: { children: React.ReactNode; space?: SpaceHydraKeys | null; }) {
  const oryLoading = useAuth(space?.hydra_client_id);
  const chainsLoading = useListChains();
  const setHydraClientId = useSetAtom(hydraClientIdAtom);
  const [appKitReady, setAppKitReady] = React.useState(false);
  useLensResumeSession();

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
      <WagmiProvider config={config}>
        <TRPCProvider>
          <DaimoPayProvider debugMode>
            {children}
          </DaimoPayProvider>
        </TRPCProvider>
      </WagmiProvider>
    </GraphqlClientProvider>
  );
}
