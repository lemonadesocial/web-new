import { useAtomValue, useSetAtom } from 'jotai';

import { ory } from '$lib/utils/ory';
import { hydraClientIdAtom, sessionAtom } from '$lib/jotai';
import { useOAuth2 } from './useOAuth2';

export function useRawLogout() {
  const setSession = useSetAtom(sessionAtom);
  const hydraClientId = useAtomValue(hydraClientIdAtom);
  const { signOut } = useOAuth2();

  if (hydraClientId) return signOut;

  return async () => {
    const res = await ory?.createBrowserLogoutFlow();
    await ory?.updateLogoutFlow({ token: res?.data.logout_token });

    setSession(null);
    localStorage.clear();
  };
}

export function useLogOut() {
  const rawLogout = useRawLogout();

  return async () => {
    await rawLogout();

    //-- remove the auth cookie from the url and reload
    const url = new URL(window.location.href);
    url.searchParams.delete('authCookie');
    window.location.href = url.toString();
  };
};

