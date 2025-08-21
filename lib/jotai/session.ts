import { atom } from 'jotai';

export interface Session {
  _id: string;
  user?: string;
  token?: string;
  oidcUser?: string;
  returnTo?: string;
  /** @description it's using for detect user profile with lens account */
  lens_address?: string;

  email?: string;
  wallet?: string;
  unicorn_wallet?: string;
  expires_at?: string;
}

export const sessionAtom = atom<Session | null>(null);
export const sessionLoadingAtom = atom<boolean>(true);
