import { atom } from 'jotai';

export * from './session';
export * from './chains';
export * from './lens';

export const scrollAtBottomAtom = atom(false);
export const dataTheme = atom('dark');
export const hydraClientIdAtom = atom('');
