import { useEffect, useState } from 'react';
import { useSession } from './useSession';
import { defaultClient } from '$lib/graphql/request/instances';
import { GetMeDocument, User } from '$lib/graphql/generated/backend/graphql';

export function useMe(): User | null {
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);

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
  }, [session]);

  return user;
}
