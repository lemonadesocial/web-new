import { useAtomValue } from 'jotai';

import { useSession } from './useSession';
import { User } from '$lib/graphql/generated/backend/graphql';
import { userAtom } from '$lib/jotai';

export function useMe() {
  const user = useAtomValue(userAtom);

  return user;
}
