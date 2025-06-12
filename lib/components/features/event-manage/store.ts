import { atom, useAtomValue, useSetAtom } from "jotai";

import { Event } from "$lib/graphql/generated/backend/graphql";

export const eventAtom = atom<Event | null>(null);

export const useEvent = () => {
  const event = useAtomValue(eventAtom);
  return event;
};

export const useUpdateEvent = () => {
  const setEvent = useSetAtom(eventAtom);
  
  const updateEvent = (updates: Partial<Event>) => {
    setEvent((currentEvent) => {
      if (!currentEvent) return currentEvent;
      return { ...currentEvent, ...updates };
    });
  };
  
  return updateEvent;
};
