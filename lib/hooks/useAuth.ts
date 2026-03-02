'use client';

import { useAtom, useAtomValue } from 'jotai';
import React from 'react';

import { ory } from '$lib/utils/ory';
import { hydraClientIdAtom, Session, sessionAtom, sessionLoadingAtom } from '$lib/jotai';
import { useLogOut } from '$lib/hooks/useLogout';
import { toast } from '$lib/components/core';
import { HYDRA_PUBLIC_URL, IDENTITY_TOKEN_KEY } from '$lib/utils/constants';
import { useAccount } from './useLens';
import { identityApi } from '$lib/services/identity';
import { getErrorMessage } from '$lib/utils/error';
import { oidc } from '$lib/utils/oidc';

export function useAuth(spaceHydraClientId?: string) {
  const hydraClientAtomId = useAtomValue(hydraClientIdAtom);
  const hydraClientId = spaceHydraClientId || hydraClientAtomId;

  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useAtom(sessionLoadingAtom);
  const logOut = useLogOut();
  const { account } = useAccount();

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

  const handleOryAuth = async () => {
    if (!ory) {
      throw new Error('Ory is not initialized');
    }
    
    await ory
      .toSession()
      .then(({ data }) => {
        const id = data.identity?.id;

        if (id) setSession({
          _id: id,
          email: data.identity?.traits?.email,
          wallet: data.identity?.traits?.wallet,
          unicorn_wallet: data.identity?.traits?.unicorn_wallet,
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

  const handleHydraAuth = async () => {
    try {
      if (!hydraClientId) throw new Error('Hydra client ID is required');

      const storageKey = getSessionStorageKey(hydraClientId);
      const storedSession = sessionStorage.getItem(storageKey);

      if (storedSession) {
        const userManager = oidc.setUserManager(hydraClientId);
        setupTokenRefresh(userManager);

        const user = await oidc.restoreUser(storedSession);

        if (!user) throw new Error('Cannot restore oidc user.');

        setSession({
          _id: user.profile.sid,
          user: user.profile.user,
          token: user.access_token,
          oidcUser: user.toStorageString(),
        } as Session);
        
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(IDENTITY_TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const refreshResult = await identityApi.refreshSession(token);
        setSession({ 
          token: refreshResult.session.token,
          expires_at: refreshResult.session.expires_at 
        } as Session);
      } catch (refreshError) {
        localStorage.removeItem(IDENTITY_TOKEN_KEY);
        setLoading(false);
        return;
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const reload = async () => {
    if (hydraClientId) {
      await handleHydraAuth();
      return;
    }

    await handleOryAuth();
  }

  React.useEffect(() => {
    if (account && session) {
      setSession({ ...session, lens_address: account.address });
    }
  }, [account]);

  return { loading, session, reload };
}
