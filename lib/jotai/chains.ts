import { Chain } from "$lib/graphql/generated/backend/graphql";
import { atom } from "jotai";

export const listChainsAtom = atom<Chain[]>([]);

type ChainMap = Record<string, Chain>;

export const chainsMapAtom = atom<ChainMap>((get) => {
  const chains = get(listChainsAtom);
  return chains.reduce<ChainMap>((acc, chain) => {
    if (chain.chain_id) {
      acc[chain.chain_id] = chain;
    }
    return acc;
  }, {});
});
