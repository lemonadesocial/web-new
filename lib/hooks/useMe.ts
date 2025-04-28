import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

import { useQuery } from '$lib/graphql/request';
import { GetMeDocument, User } from '$lib/graphql/generated/backend/graphql';
import { sessionAtom } from '$lib/jotai';

const meAtom = atom<User | null>(null);

export function useMe(): User | null {
  const [session] = useAtom(sessionAtom);
  const [me, setMe] = useAtom(meAtom);

  const {
    data: queryData,
    loading,
  } = useQuery(GetMeDocument, {
    skip: !session,
  });

  useEffect(() => {
    if (!session || loading || me || !queryData) return;

    setMe(queryData?.getMe as User);
  }, [session, loading, queryData, me, setMe]);

  return me;
}
