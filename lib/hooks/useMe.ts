import { GetMeDocument, User } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { useEffect } from "react";

import { useSession } from './useSession';

export function useMe(): User | null {
  const session = useSession();

  const { data: dataGetMe, refetch } = useQuery(GetMeDocument, {
    skip: !session,
  });

  useEffect(() => {
    if (session?._id) {
      refetch();
    }
  }, [session?._id]);

  if (!dataGetMe?.getMe) return null;

  return dataGetMe?.getMe as User;
}
