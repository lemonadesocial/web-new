'use client';

import { useAtom, useAtomValue } from 'jotai';
import React from 'react';

import { ory } from '$lib/utils/ory';
import { hydraClientIdAtom, Session, sessionAtom, sessionLoadingAtom } from '$lib/jotai';
import { useLogOut } from '$lib/hooks/useLogout';
import { toast } from '$lib/components/core';
import { IDENTITY_TOKEN_KEY } from '$lib/utils/constants';
import { useAccount } from './useLens';
import { identityApi } from '$lib/services/identity';

export function useAuth(spaceHydraClientId?: string) {
  const hydraClientAtomId = useAtomValue(hydraClientIdAtom);
  const hydraClientId = spaceHydraClientId || hydraClientAtomId;

  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useAtom(sessionLoadingAtom);
  const logOut = useLogOut();
  const { account } = useAccount();

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
    } catch (error: any) {
      toast.error(error.message);
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
