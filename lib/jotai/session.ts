import { atom } from "jotai";

export interface Session {
  _id: string,
  user?: string;
  token?: string;
  oidcUser?: string;
  returnTo?: string;
}

export const sessionAtom = atom<Session | null>(null);
