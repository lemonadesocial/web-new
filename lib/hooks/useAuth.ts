import { useAtom } from 'jotai';
import React from 'react';

import { ory } from '$lib/utils/ory';
import { Session, sessionAtom } from '$lib/jotai';
import { useLogOut } from '$lib/hooks/useLogout';
import { oidc } from '$lib/utils/oidc';
import { toast } from '$lib/components/core';
import { HYDRA_PUBLIC_URL } from '$lib/utils/constants';
import { useAccount } from './useLens';

export function useAuth(hydraClientId?: string) {
  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = React.useState(true);
  const logOut = useLogOut();
  const { account } = useAccount();

  const handleOryAuth = async () => {
    if (!ory) {
      throw new Error('Ory is not initialized');
    }

    ory
      .toSession()
      .then(({ data }) => {
        const id = data.identity?.id;

        if (id) setSession({
          _id: id,
          email: data.identity?.traits?.email,
          wallet: data.identity?.traits?.wallet,
        });
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          if (session) logOut();
          return;
        }

        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getSessionStorageKey = (clientId: string) => {
    return `oidc.user:${HYDRA_PUBLIC_URL}:${clientId}`;
  };

  const setupTokenRefresh = (userManager: any) => {
    userManager.events.addAccessTokenExpiring(async () => {
      const newSession = await userManager.signinSilent();
      setSession({
        ...session,
        oidcUser: newSession?.toStorageString(),
      } as Session);
    });
  };

  const handleHydraAuth = async () => {
    try {
      if (!hydraClientId) throw new Error('Hydra client ID is required');

      const userManager = oidc.setUserManager(hydraClientId);
      setupTokenRefresh(userManager);

      const storageKey = getSessionStorageKey(hydraClientId);
      const storedSession = sessionStorage.getItem(storageKey);

      if (!storedSession) {
        setLoading(false);
        return;
      }

      const user = await oidc.restoreUser(storedSession);
      if (!user) throw new Error('Cannot restore oidc user.');

      setSession({
        _id: user.profile.sid,
        user: user.profile.user,
        token: user.access_token,
        oidcUser: user.toStorageString(),
      } as Session);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (hydraClientId) {
      handleHydraAuth();
      return;
    }

    handleOryAuth();
  }, []);

  React.useEffect(() => {
    if (account && session) {
      setSession({ ...session, lens_address: account.address });
    }
  }, [account]);

  return loading;
}
