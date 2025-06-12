import { atom, useAtomValue } from "jotai";

import { Event } from "$lib/graphql/generated/backend/graphql";

export const eventAtom = atom<Event | null>(null);

export const useEvent = () => {
  const event = useAtomValue(eventAtom);
  return event;
};
