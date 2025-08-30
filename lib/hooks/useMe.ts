import { useAtomValue } from 'jotai';

import { userAtom } from '$lib/jotai';

export function useMe() {
  const user = useAtomValue(userAtom);

  return user;
}
