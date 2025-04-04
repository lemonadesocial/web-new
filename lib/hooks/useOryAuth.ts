import { useAtom } from 'jotai';
import React from 'react';

import { ory } from '$lib/utils/ory';
import { sessionAtom } from '$lib/jotai';
import { useLogOut } from '$lib/hooks/useLogout';

export function useOryAuth() {
  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = React.useState(true);
  const logOut = useLogOut();

  React.useEffect(() => {
    if (!ory) {
      throw new Error('Ory is not initialized');
    }

    ory
      .toSession()
      .then(({ data }) => {
        const id = data.identity?.id;
        const user = data.identity?.metadata_public as { user: string } | null;

        if (id && user?.user) setSession({ id, user: user.user });
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          if (session) logOut();
          return;
        }

        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading;
}
