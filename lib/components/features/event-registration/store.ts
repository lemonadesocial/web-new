import { UseFormReturn } from 'react-hook-form';
import {
  Atom,
  atom,
  WritableAtom,
  useAtom as useJotaiAtom,
  useAtomValue as useJotaiAtomValue,
  useSetAtom as useJotaiSetAtom,
} from 'jotai';
import { useContext } from 'react';

import {
  ApplicationProfileField,
  BuyerInfoInput,
  ConnectWalletInput,
  Event,
  EthereumAccount,
  EthereumRelayAccount,
  EthereumStakeAccount,
  NewPaymentAccount,
  PricingInfo,
  PurchasableItem,
  PurchasableTicketType,
  UserInput,
  EventTokenGate,
} from '$lib/graphql/generated/backend/graphql';

import { EventRegistrationStoreContext } from './context';
import { createModal } from '$lib/components/core';

export const useEventRegistrationStore = () => {
  const store = useContext(EventRegistrationStoreContext);
  if (!store) throw new Error('useEventRegistrationStore must be used within EventRegistrationStoreProvider');
  return store;
};

export function useAtom<Value, Update>(
  atom: Atom<Value> | WritableAtom<Value, Update[], void>,
): [Value, (...args: Update[]) => void] {
  const store = useEventRegistrationStore();
  return useJotaiAtom(atom, { store });
}

export function useAtomValue<Value>(atom: Atom<Value>): Value {
  const store = useEventRegistrationStore();
  return useJotaiAtomValue(atom, { store });
}

export function useSetAtom<Value, Update>(atom: WritableAtom<Value, Update[], void>): (...args: Update[]) => void {
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

export const tokenAddressAtom = atom<string | null>((get) => {
  const currency = get(currencyAtom);
  const selectedPaymentAccount = get(selectedPaymentAccountAtom);
  const pricingInfo = get(pricingInfoAtom);
  
  if (!currency || !pricingInfo) return null;
  
  const paymentAccount = selectedPaymentAccount 
    ? pricingInfo.payment_accounts?.find(account => account._id === selectedPaymentAccount._id) 
    : pricingInfo.payment_accounts?.[0];
    
  if (!paymentAccount?.account_info) return null;
  
  const paymentAccountInfo = paymentAccount.account_info as (EthereumAccount | EthereumRelayAccount | EthereumStakeAccount);
  const network = (paymentAccountInfo as EthereumAccount).network;
  
  return paymentAccountInfo.currency_map[currency]?.contracts[network] ?? null;
});

interface FormInstances {
  [key: string]: UseFormReturn<any>;
}

interface SubmitHandlers {
  [key: string]: (data: any) => void;
}

export const formInstancesAtom = atom<FormInstances>({});
export const submitHandlersAtom = atom<SubmitHandlers>({});

export const buyerInfoAtom = atom<BuyerInfoInput | null>(null);
export const userInfoAtom = atom<UserInput | null>(null);

export const nonLoggedInStatusAtom = atom<'success' | 'pending' | null>(null);

export const stripePaymentMethodAtom = atom<string>('');

export const discountCodeAtom = atom<string | null>(null);

export const ethereumWalletInputAtom = atom<ConnectWalletInput | null>(null);

export const eventTokenGatesAtom = atom<EventTokenGate[]>([]);

export const requiresTokenGatingAtom = atom((get) => {
  const purchaseItems = get(purchaseItemsAtom);
  const eventTokenGates = get(eventTokenGatesAtom);

  if (!purchaseItems.length || !eventTokenGates.length) return false;

  const ticketIds = purchaseItems.map((item) => item.id);
  return eventTokenGates.some((gate) =>
    gate.gated_ticket_types?.some((gatedId) => ticketIds.includes(gatedId))
  );
});

export const buyerWalletAtom = atom<string | null>(null);
