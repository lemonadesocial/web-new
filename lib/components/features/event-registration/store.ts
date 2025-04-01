import { UseFormReturn } from "react-hook-form";
import { Atom, atom, WritableAtom, useAtom as useJotaiAtom, useAtomValue as useJotaiAtomValue, useSetAtom as useJotaiSetAtom } from "jotai";
import { useContext } from "react";

import { ApplicationProfileField, Event, NewPaymentAccount, PricingInfo, PurchasableItem, PurchasableTicketType } from '$lib/generated/backend/graphql';

import { EventRegistrationStoreContext } from "./context";
import { createModal } from "$lib/components/core";

export const useEventRegistrationStore = () => {
  const store = useContext(EventRegistrationStoreContext);
  if (!store) throw new Error('useEventRegistrationStore must be used within EventRegistrationStoreProvider');
  return store;
};

export function useAtom<Value, Update>(
  atom: Atom<Value> | WritableAtom<Value, Update[], void>
): [Value, (...args: Update[]) => void] {
  const store = useEventRegistrationStore();
  return useJotaiAtom(atom, { store });
}

export function useAtomValue<Value>(atom: Atom<Value>): Value {
  const store = useEventRegistrationStore();
  return useJotaiAtomValue(atom, { store });
}

export function useSetAtom<Value, Update>(
  atom: WritableAtom<Value, Update[], void>
): (...args: Update[]) => void {
  const store = useEventRegistrationStore();
  return useJotaiSetAtom(atom, { store });
}

export const registrationModal = createModal();

export const eventAtom = atom<Event | null>(null);

export const eventDataAtom: Atom<Event> = atom<Event>((get) => {
  const value = get(eventAtom);
  return value as Event;
});

export const approvalRequiredAtom = atom<boolean>(false);

export const ticketTypesAtom = atom<PurchasableTicketType[]>([]);
export const hasSingleFreeTicketAtom = atom((get) => {
  const ticketTypes = get(ticketTypesAtom);
  return ticketTypes.length === 1 && ticketTypes[0].prices.length === 1 && ticketTypes[0].prices[0].cost === '0';
});

export const ticketLimitAtom = atom<number>(0);

export const purchaseItemsAtom = atom<PurchasableItem[]>([]);
export const currencyAtom = atom<string>('');

export const paymentAccountsAtom = atom<string[]>([]);
export const currenciesAtom = atom<string[]>([]);
export const selectedPaymentAccountAtom = atom<NewPaymentAccount | null>(null);

export const requiredProfileFieldsAtom = atom<ApplicationProfileField[]>([]);

export const pricingInfoAtom = atom<PricingInfo | null>(null);

interface FormInstances {
  [key: string]: UseFormReturn<any>;
}

interface SubmitHandlers {
  [key: string]: (data: any) => void;
}

export const formInstancesAtom = atom<FormInstances>({});
export const submitHandlersAtom = atom<SubmitHandlers>({});
