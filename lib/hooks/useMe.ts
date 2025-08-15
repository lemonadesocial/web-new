import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useSession } from './useSession';
import { defaultClient } from '$lib/graphql/request/instances';
import { GetMeDocument, User } from '$lib/graphql/generated/backend/graphql';
import { userAtom } from '$lib/jotai';

export function useMe(): User | null {
  const session = useSession();
  const [user] = useAtom(userAtom);
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    if (session) {
      defaultClient.query({
        query: GetMeDocument,
      }).then(({ data }) => {
        if (data?.getMe) {
          setUser(data.getMe as User);
        }
      });
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  return user;
}
