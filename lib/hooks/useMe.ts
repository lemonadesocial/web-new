import { useQuery } from '$lib/graphql/request';
import { GetMeDocument, User } from '$lib/graphql/generated/backend/graphql';
import { useSession } from './useSession';

export function useMe(): User | null {
  const session = useSession();

  const { data: dataGetMe } = useQuery(GetMeDocument, {
    skip: !session,
  });

  if (!dataGetMe?.getMe) return null;
  return dataGetMe?.getMe as User;
}
