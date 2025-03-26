import { useAtom } from 'jotai';

import { useQuery } from '$lib/request';
import { GetMeDocument, User } from '$lib/generated/backend/graphql';
import { sessionAtom } from '$lib/jotai';

export function useMe(): User | null {
  const [session] = useAtom(sessionAtom);

  const { data: dataGetMe } = useQuery(GetMeDocument, {
    skip: !session,
  });

  if (!dataGetMe?.getMe) return null;
  return dataGetMe?.getMe as User;
}
