import { EventTicketPrice, NewPaymentAccount, PurchasableTicketType } from "$lib/generated/backend/graphql";
import { chainsMapAtom } from "$lib/jotai";
import { formatPrice } from "$lib/utils/event";
import { getPaymentNetworks } from "$lib/utils/payment";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export function TicketSelectItem({ ticketType }: { ticketType: PurchasableTicketType; }) {
  console.log(ticketType)
  return (
    <div className="flex gap-4 flex-col">
      <div>
        <p className="text-sm text-tertiary/80">Ticket Price</p>
        <div className="flex gap-2">
          <TicketPrices prices={ticketType.prices} single />
        </div>
      </div>
    </div>
  );
}

function TicketPrices({ prices, single }: { prices: EventTicketPrice[]; single?: boolean }) {
  const [firstPrice, secondPrice] = useMemo(() => {
    if (prices.length > 1 && prices[1]?.payment_accounts_expanded?.[0]?.provider === 'stripe') return [prices[1], prices[0]];

    return [prices[0], prices[1]];
  }, [prices]);

  if (secondPrice) {
    return (
      <div className={clsx('flex items-baseline', single ? 'gap-2' : 'gap-1.5')}>
        <p className={single ? 'text-xl font-semibold' : 'text-medium font-medium'}>{formatPrice(firstPrice)}</p>
        <p className={clsx('text-medium font-medium', single && 'text-tertiary/80')}>or {formatPrice(secondPrice)}</p>
        <PaymentNetworks paymentAccounts={secondPrice.payment_accounts_expanded || []} />
      </div>
    );
  }

  return (
    <div className="flex gap-1.5 items-baseline">
      <p className={single ? 'text-xl font-semibold' : 'text-medium font-medium'}>{formatPrice(firstPrice)}</p>
      <PaymentNetworks paymentAccounts={firstPrice.payment_accounts_expanded || []} />
    </div>
  );
}

export function PaymentNetworks({ paymentAccounts, className }: { paymentAccounts: NewPaymentAccount[]; className?: string; }) {
  const networks = getPaymentNetworks(paymentAccounts);
  const chainsMap = useAtomValue(chainsMapAtom);

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
