'use client';
import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAccount, useChainId } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';
import * as Sentry from '@sentry/nextjs';

import { GraphqlClientProvider } from '$lib/graphql/request';
import { initializeAppKit } from '$lib/utils/appkit';
import { useListChains } from '$lib/hooks/useListChains';
import { SpaceHydraKeys } from '$lib/utils/space';
import { hydraClientIdAtom, sessionAtom, userAtom } from '$lib/jotai';
import { defaultClient } from '$lib/graphql/request/instances';
import { useResumeSession as useLensResumeSession } from '$lib/hooks/useLens';
import { useAuth } from '../../lib/hooks/useAuth';
import { GetMeDocument, User } from '$lib/graphql/generated/backend/graphql';
import { useUtmTracker } from '$lib/hooks/useUtmTracker';

export default function Providers({ children, space }: { children: React.ReactNode; space?: SpaceHydraKeys | null }) {
  const [miniAppReady, setMiniAppReady] = useState(false);
  const chainsLoading = useListChains();
  const setHydraClientId = useSetAtom(hydraClientIdAtom);
  const [appKitReady, setAppKitReady] = useState(false);
  useLensResumeSession();
  useUtmTracker();

  const { reload, loading: loadingAuth } = useAuth(space?.hydra_client_id);
  const session = useAtomValue(sessionAtom);
  const setUser = useSetAtom(userAtom);

  // P1-3: Web3 context tags for Sentry
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    if (isConnected && address) {
      const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
      Sentry.setTag('walletAddress', truncatedAddress);
      Sentry.setTag('chainId', String(chainId));
    } else {
      Sentry.setTag('walletAddress', null);
      Sentry.setTag('chainId', null);
    }
  }, [address, isConnected, chainId]);

  // P1-3: authProvider tag — derived from session signals
  useEffect(() => {
    if (!session) {
      Sentry.setTag('authProvider', null);
      return;
    }

    let provider = 'kratos';
    if (session.farcaster_fid) provider = 'farcaster';
    else if (session.lens_address) provider = 'lens';
    else if (session.wallet && !session.token) provider = 'wallet';
    else if (session.token) provider = 'hydra';

    Sentry.setTag('authProvider', provider);
  }, [session]);

  useEffect(() => {
    if (!chainsLoading) {
      initializeAppKit();
      setAppKitReady(true);
    }
  }, [chainsLoading]);

  useEffect(() => {
    if (space?.hydra_client_id) {
      setHydraClientId(space.hydra_client_id);
    }
  }, [space]);

  useEffect(() => {
    sdk.actions.ready().then(() => setMiniAppReady(true)).catch(e => Sentry.captureException(e));
  }, []);

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    if (session) {
      defaultClient.query({
        query: GetMeDocument,
        fetchPolicy: 'network-only',
      }).then(({ data }) => {
        if (data?.getMe) {
          setUser(data.getMe as User);
          Sentry.setUser({
            id: data.getMe._id,
            email: data.getMe.email || undefined,
          });
        }
      }).catch((error) => {
        Sentry.captureException(error, { tags: { source: 'providers-get-me' } });
      });
      return;
    }

    setUser(null);
    Sentry.setUser(null);
  }, [session]);

  if (chainsLoading || !appKitReady || !miniAppReady || loadingAuth) return null;

  return (
    <GraphqlClientProvider client={defaultClient}>
      {children}
    </GraphqlClientProvider>
  );
}
