import { atom } from "jotai";
import { SessionClient, Account, Feed } from "@lens-protocol/client";

export const sessionClientAtom = atom<SessionClient | null>(null);
export const accountAtom = atom<Account | null>(null);
export const feedAtom = atom<Feed | null>(null);
