import { getDefaultStore } from 'jotai';
import { listChainsAtom } from '$lib/jotai';

export function getListChains() {
  return getDefaultStore().get(listChainsAtom);
}
