import { atom } from 'jotai';
import { User } from '$lib/graphql/generated/backend/graphql';

export * from './session';
export * from './chains';
export * from './lens';

export const scrollAtBottomAtom = atom(false);
export const dataTheme = atom('dark');
export const hydraClientIdAtom = atom('');
export const userAtom = atom<User | null>(null);
