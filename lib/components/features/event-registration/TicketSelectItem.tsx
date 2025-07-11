import { useMemo } from "react";
import { useAtomValue as useJotaiAtomValue } from "jotai";
import { intersection } from "lodash";
import clsx from "clsx";

import { NumberInput } from "$lib/components/core";
import { EventTicketPrice, NewPaymentAccount, PurchasableTicketType } from "$lib/graphql/generated/backend/graphql";
import { chainsMapAtom } from "$lib/jotai";
import { formatPrice, getPaymentAccounts } from "$lib/utils/event";
import { getPaymentNetworks } from "$lib/utils/payment";
import { currenciesAtom, currencyAtom, paymentAccountsAtom, purchaseItemsAtom, selectedPaymentAccountAtom, ticketTypesAtom, useAtom, useAtomValue } from "./store";

export function TicketSelectItem({ ticketType, single, compact }: { ticketType: PurchasableTicketType; single?: boolean; compact?: boolean }) {
  const [purchaseItems, setPurchaseItems] = useAtom(purchaseItemsAtom);
  const [currency, setCurrency] = useAtom(currencyAtom);
  const [paymentAccounts, setPaymentAccounts] = useAtom(paymentAccountsAtom);
  const [currencies, setCurrencies] = useAtom(currenciesAtom);
  const [selectedPaymentAccount, setSelectedPaymentAccount] = useAtom(selectedPaymentAccountAtom);
  const ticketTypes = useAtomValue(ticketTypesAtom);

  const currentPaymentAccounts = getPaymentAccounts(ticketType.prices);
  const currentCurrencies = ticketType.prices.map(price => price.currency);

  const disabled = useMemo(() => {
    if (currencies.length && !intersection(currencies, currentCurrencies).length) return true;
    if (!currentPaymentAccounts?.length) return false;
    if (!paymentAccounts?.length) return false;
    return !intersection(currentPaymentAccounts, paymentAccounts).length;
  }, [paymentAccounts, currentPaymentAccounts, currentCurrencies, currencies]);

  const handleTicketChange = (ticketType: PurchasableTicketType, value: number) => {
    const newPurchaseItems = [...purchaseItems];
    const index = newPurchaseItems.findIndex(item => item.id === ticketType._id);

    if (index < 0) {
      newPurchaseItems.push({ id: ticketType._id, count: value });
    } else {
      newPurchaseItems[index].count = value;
    }

    const filteredPurchaseItems = newPurchaseItems.filter(item => item.count > 0);

    setPurchaseItems(filteredPurchaseItems);

    if (filteredPurchaseItems.length === 0) {
      setCurrency('');
      setPaymentAccounts([]);
      setCurrencies([]);
      setSelectedPaymentAccount(null);
      return;
    }

    const selectedTicketTypes = ticketTypes.filter(ticket => filteredPurchaseItems.some(item => item.id === ticket._id));

    const paymentCurrencies = selectedTicketTypes.map(ticket => ticket.prices.map(price => price.currency));
    const newCurrencies = intersection(...paymentCurrencies);
    setCurrencies(newCurrencies);

    if (!newCurrencies.includes(currency)) {
      setCurrency(newCurrencies[0]);
    }

    if (!currentPaymentAccounts?.length) return;

    const selectedPaymentAccounts = selectedTicketTypes.map(ticket => getPaymentAccounts(ticket.prices.filter(price => newCurrencies.includes(price.currency))));
    const newAccounts = intersection(...selectedPaymentAccounts);
    setPaymentAccounts(newAccounts);

    if (!newAccounts.includes(selectedPaymentAccount?._id)) {
      const price = ticketType.prices.find(price => price.payment_accounts?.includes(newAccounts[0])) || ticketType.prices[0];
      const newPaymentAccount = price.payment_accounts_expanded?.[0] as NewPaymentAccount;
      setSelectedPaymentAccount(newPaymentAccount);
    }
  };

  const count = purchaseItems.find(item => item.id === ticketType._id)?.count || 0;
  const active = count > 0;

  if (compact) return (
    <div className="flex justify-between items-center">
      <p>Tickets</p>
      <NumberInput
        value={count}
        limit={ticketType.limit as number}
        onChange={value => handleTicketChange(ticketType, Number(value))}
        hideMinusAtZero
        disabled={disabled}
      />
    </div>
  );

  if (single) return (
    <div className="flex gap-4 flex-col">
      <div>
        <p className="text-sm text-secondary">Ticket Price</p>
        <TicketPrices prices={ticketType.prices} single={single} groupRegistration={ticketType.limit > 1} />
      </div>
      {
        ticketType.limit > 1 && (
          <div className='pt-4 border-t border-card-border flex justify-between gap-3'>
            <div className="flex justify-center items-center size-[28px] rounded-sm bg-card">
              <i className="icon-tag size-4 text-tertiary" />
            </div>
            <p className="font-medium flex-1">Tickets</p>
            <NumberInput
              value={count}
              limit={ticketType.limit as number}
              onChange={value => handleTicketChange(ticketType, Number(value))}
              hideMinusAtZero
              disabled={disabled}
            />
          </div>
        )
      }
    </div>
  );

  return (
    <div className={clsx('flex p-3 rounded-sm justify-between items-start', active ? 'border border-primary' : 'border border-transparent bg-primary/8')}>
      <div>
        <div className="flex items-center gap-1.5">
          <p className={clsx('font-medium', active ? 'text-accent' : 'text-secondary')}>{ticketType.title}</p>
          {
            ticketType.prices[0].payment_accounts_expanded?.[0]?.type === 'ethereum_stake' && (
              <div className="px-1.5 py-0.5 rounded-full bg-success-500/16">
                <p className="text-xs text-success-500">Check In to Earn</p>
              </div>
            )
          }
        </div>
        <TicketPrices prices={ticketType.prices} groupRegistration={ticketType.limit > 1} active={active} />
        {
          ticketType.description && <p className="text-secondary whitespace-pre">{ticketType.description}</p>
        }
      </div>
      <NumberInput
        value={count}
        limit={ticketType.limit as number}
        onChange={value => handleTicketChange(ticketType, Number(value))}
        disabled={disabled}
        hideMinusAtZero
      />
    </div>
  );
}

interface TicketPricesProps {
  prices: EventTicketPrice[];
  single?: boolean;
  groupRegistration?: boolean;
  active?: boolean;
}

function TicketPrices({ prices, single, groupRegistration, active }: TicketPricesProps) {
  const [firstPrice, secondPrice] = useMemo(() => {
    if (prices.length > 1 && prices[1]?.payment_accounts_expanded?.[0]?.provider === 'stripe') return [prices[1], prices[0]];

    return [prices[0], prices[1]];
  }, [prices]);

  if (secondPrice) {
    return (
      <div className={clsx('flex items-baseline', single ? 'gap-2' : 'gap-1.5')}>
        <p className={clsx(single ? 'text-xl font-semibold' : 'text-medium font-medium', active || single ? 'text-accent' : 'text-secondary')}>
          {formatPrice(firstPrice)}
        </p>
        <p className={clsx('font-medium', single ? 'text-sm text-secondary' : 'text-medium', active || single ? 'text-accent' : 'text-secondary')}>
          or {formatPrice(secondPrice)}
          {(groupRegistration && single) && ' per ticket'}
        </p>
        <PaymentNetworks paymentAccounts={secondPrice.payment_accounts_expanded || []} />
      </div>
    );
  }

  return (
    <div className="flex gap-1.5 items-baseline">
      <p className={clsx(single ? 'text-xl font-semibold' : 'text-medium font-medium', active || single ? 'text-accent' : 'text-secondary')}>
        {formatPrice(firstPrice)}
      </p>
      {(groupRegistration && single) && <p className="text-sm font-medium text-secondary">per ticket</p>}
      <PaymentNetworks paymentAccounts={firstPrice.payment_accounts_expanded || []} />
    </div>
  );
}

export function PaymentNetworks({ paymentAccounts, className }: { paymentAccounts: NewPaymentAccount[]; className?: string; }) {
  const networks = getPaymentNetworks(paymentAccounts);
  const chainsMap = useJotaiAtomValue(chainsMapAtom);

  if (!networks?.length) return <></>;

  return (
    <div className={clsx('flex gap-1.5', className)}>
      {networks.map(network => (
        <img
          key={network}
          src={chainsMap[network].logo_url!}
          alt={network}
          className='size-3.5'
        />
      ))}
    </div>
  );
}
