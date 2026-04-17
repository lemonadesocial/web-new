'use client';
import { useContext } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import * as Sentry from '@sentry/nextjs';

import { ory } from '$lib/utils/ory';
import { hydraClientIdAtom, sessionAtom } from '$lib/jotai';
import { GraphQLWSContext } from '$lib/graphql/subscription/context';
import { useMutation } from '$lib/graphql/request';
import { RevokeCurrentSessionDocument } from '$lib/graphql/generated/backend/graphql';

const REVOKE_TIMEOUT_MS = 2000;

export function useRawLogout() {
  const setSession = useSetAtom(sessionAtom);
  const hydraClientId = useAtomValue(hydraClientIdAtom);
  const { dispose } = useContext(GraphQLWSContext);
  const [revokeCurrentSession] = useMutation(RevokeCurrentSessionDocument);

  return async () => {
    // Notify backend to close any live WS connections for this session. Must run
    // BEFORE Kratos logout so the auth cookie is still valid when the request
    // reaches the backend. Failure is non-blocking — the periodic revalidator
    // catches stale sockets within 5 minutes. A 2s timeout prevents a backend
    // hang from blocking logout UX indefinitely.
    // Promise.race leaks the losing revokeCurrentSession promise on timeout —
    // acceptable since logout is terminal (page navigates); AbortController
    // plumbing through useMutation is out of scope for this fix.
    const revokeWithTimeout = Promise.race([
      revokeCurrentSession({}),
      new Promise<{ error: Error }>((resolve) =>
        setTimeout(
          () =>
            resolve({ error: new Error('revokeCurrentSession timeout') }),
          REVOKE_TIMEOUT_MS,
        ),
      ),
    ]);
    const { error: revokeError } = await revokeWithTimeout;
    if (revokeError) {
      const isTimeout =
        revokeError instanceof Error &&
        revokeError.message === 'revokeCurrentSession timeout';
      Sentry.captureException(revokeError, {
        tags: {
          flow: 'logout',
          ...(isTimeout ? { reason: 'timeout' } : {}),
        },
      });
    }

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
