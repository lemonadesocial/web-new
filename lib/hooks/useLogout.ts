import { useAtomValue, useSetAtom } from 'jotai';

import { ory } from '$lib/utils/ory';
import { hydraClientIdAtom, sessionAtom } from '$lib/jotai';
import { useOAuth2 } from './useOAuth2';

export function useLogOut() {
  const setSession = useSetAtom(sessionAtom);
  const hydraClientId = useAtomValue(hydraClientIdAtom);
  const { signOut } = useOAuth2();

  if (hydraClientId) return signOut;

  return async () => {
    const res = await ory?.createBrowserLogoutFlow();
    await ory?.updateLogoutFlow({ token: res?.data.logout_token });

    setSession(null);
    localStorage.clear();
    window.location.reload();
  };
};

