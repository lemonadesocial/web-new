import { useSetAtom } from 'jotai';

import { ory } from '$lib/utils/ory';
import { sessionAtom } from '$lib/jotai';

export function useLogOut() {
  const setSession = useSetAtom(sessionAtom);

  return async () => {
    const res = await ory?.createBrowserLogoutFlow();
    await ory?.updateLogoutFlow({ token: res?.data.logout_token });

    setSession(null);
    localStorage.clear();
    window.location.reload();
  };
};
