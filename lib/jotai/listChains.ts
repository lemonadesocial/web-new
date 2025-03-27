import { Chain } from "$lib/generated/backend/graphql";
import { atom } from "jotai";

export const listChainsAtom = atom<Chain[]>([]);
