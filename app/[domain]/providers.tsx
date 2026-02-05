'use client';
import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { sdk } from '@farcaster/miniapp-sdk';
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
    sdk.actions.ready().then(() => setMiniAppReady(true)).catch(e => console.error(e));
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
        }
      });
      return;
    }

    setUser(null);
  }, [session]);

  if (chainsLoading || !appKitReady || !miniAppReady || loadingAuth) return null;

  return (
    <GraphqlClientProvider client={defaultClient}>
      {children}
    </GraphqlClientProvider>
  );
}
