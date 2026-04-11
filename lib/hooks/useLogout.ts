'use client';
import { useContext } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import * as Sentry from '@sentry/nextjs';

import { ory } from '$lib/utils/ory';
import { hydraClientIdAtom, sessionAtom } from '$lib/jotai';
import { GraphQLWSContext } from '$lib/graphql/subscription/context';

export function useRawLogout() {
  const setSession = useSetAtom(sessionAtom);
  const hydraClientId = useAtomValue(hydraClientIdAtom);
  const { dispose } = useContext(GraphQLWSContext);

  return async () => {
    // Dispose WebSocket connection BEFORE clearing local state
    // to prevent close-code handlers from racing with cleanup.
    dispose();

    if (!hydraClientId) {
      const res = await ory?.createBrowserLogoutFlow();
      await ory?.updateLogoutFlow({ token: res?.data.logout_token });
    }

    Sentry.setUser(null);

    setSession(null);
    localStorage.clear();
    sessionStorage.clear();
  };
}

export function useLogOut() {
  const rawLogout = useRawLogout();

  return async (redirectToHome = false) => {
    await rawLogout();

    if (redirectToHome) {
      window.location.href = '/';
      return;
    }

    //-- remove the auth cookie from the url and reload
    const url = new URL(window.location.href);
    url.searchParams.delete('authCookie');
    window.location.href = url.toString();
  };
}
