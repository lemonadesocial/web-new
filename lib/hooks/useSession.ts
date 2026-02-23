'use client';
import { useAtomValue } from 'jotai';
import { sessionAtom } from '$lib/jotai';

export function useSession () {
  return useAtomValue(sessionAtom);
}
