import { useMemo, useState } from "react";
import Decimal from 'decimal.js';

import { useMutation, useQuery } from "$lib/graphql/request";
import { useStripeSetup } from "$lib/hooks/useStripeSetup";
import { Button, Input, modal, ModalContent, Select, Skeleton, toast } from "$lib/components/core";
import { CreateNewPaymentAccountDocument, DigitalAccount, EventTicketPrice, ListNewPaymentAccountsDocument, NewPaymentProvider, PaymentAccountType, UpdateEventPaymentAccountsDocument, type Event } from "$lib/graphql/generated/backend/graphql";

import { useEvent, useUpdateEvent } from "../store";
import { useMe } from "$lib/hooks/useMe";

export function UpdateFiatPriceModal({ price, onChange }: { price?: EventTicketPrice; onChange: (price: EventTicketPrice) => void }) {
  const event = useEvent();
  const updateEvent = useUpdateEvent();
  const me = useMe();

  const handleStripeSetup = useStripeSetup();
  const stripeAccount = event?.payment_accounts_expanded?.find(account => account?.provider === 'stripe');

  const currencies = useMemo(() => [...stripeAccount?.account_info.currencies || []].sort(), [stripeAccount]);
  const initialCurrency = price?.currency && currencies.includes(price.currency) ? price.currency : 'USD';
  const decimals = (stripeAccount?.account_info as DigitalAccount)?.currency_map[initialCurrency].decimals;

  const [currency, setCurrency] = useState<string>(price?.currency && currencies.includes(price.currency) ? price.currency : 'USD');
  const [cost, setCost] = useState<string | undefined>(price?.cost && currencies.includes(price.currency) ? new Decimal(price.cost).div(10 ** decimals).toString() : undefined);

  const [updatePaymentAccount, { loading: loadingUpdatePaymentAccount }] = useMutation(UpdateEventPaymentAccountsDocument, {
    onComplete(_, data) {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent as Event);
      }
    },
  });

  const [createPaymentAccount, { loading: loadingCreatePaymentAccount }] = useMutation(CreateNewPaymentAccountDocument, {
    onComplete(_, res) {
      if (res?.createNewPaymentAccount._id) {
        updatePaymentAccount({
          variables: {
            id: event?._id,
            payment_accounts_new: [...(event?.payment_accounts_new || []), res.createNewPaymentAccount._id]
          }
        });
      }
    }
  });

  const { loading: loadingAccounts } = useQuery(ListNewPaymentAccountsDocument, {
    variables: {
      provider: NewPaymentProvider.Stripe
    },
    fetchPolicy: 'network-only',
    skip: !!stripeAccount,
    onComplete: (data) => {
      const userAccount = data?.listNewPaymentAccounts[0];

      if (userAccount) {
        updatePaymentAccount({
          variables: {
            id: event?._id,
            payment_accounts_new: [...(event?.payment_accounts_new || []), userAccount._id]
          }
        });
        
        return;
      }

      if (me?.stripe_connected_account?.connected) {
        createPaymentAccount({
          variables: {
            type: PaymentAccountType.Digital,
            provider: NewPaymentProvider.Stripe,
          }
        });
      }
    }
  });

  const handleUpdatePrice = () => {
    if (!stripeAccount) {
      toast.error('Unable to find Stripe account. Please contact support.');
      return;
    }

    onChange({ cost: (Number(cost) * Math.pow(10, decimals)).toString(), currency, payment_accounts: [stripeAccount._id], payment_accounts_expanded: [stripeAccount] });
    modal.close();
  };


  if (loadingAccounts || loadingUpdatePaymentAccount || loadingCreatePaymentAccount) return (
    <ModalContent icon="icon-stripe">
      <div className="space-y-4">
        <Skeleton animate className="w-full min-h-[60px]" />
        <Skeleton animate className="w-full min-h-[40px]" />
      </div>
    </ModalContent>
  );

  if (!stripeAccount) return (
    <ModalContent icon="icon-stripe">
      <p className="text-lg">Accept Card Payments</p>
      <p className="mt-2 text-sm text-secondary">
        We use <a className="text-accent-500" target="_blank" href="https://stripe.com/">Stripe</a> to process payments. Connect or set up a Stripe account to start accepting payments. It usually takes less than 5 minutes.
      </p>
      <Button variant="secondary" className="mt-4 w-full" onClick={handleStripeSetup}>
        Connect Stripe
      </Button>
    </ModalContent>
  );

  return (
    <ModalContent icon="icon-stripe">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-lg">Accept Card Payments</p>
          <p className="text-sm text-secondary">Charged when payment is made via card.</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Payout Account</p>
          <div className="flex items-center gap-2 py-2 px-3.5 rounded-sm bg-primary/8">
            <i className="icon-stripe-alt size-5" />
            <p>{(stripeAccount.account_info as DigitalAccount).account_id}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Ticket Price</p>

          <div className="grid grid-cols-2">
            <Input
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="Enter a price"
              variant="outlined"
              className="rounded-r-none"
            />
            <Select
              value={currency}
              onChange={value => setCurrency(value as string)}
              options={currencies}
              placeholder="Select a currency"
              className="rounded-l-none"
              removeable={false}
            />
          </div>
        </div>

        <Button variant="secondary" className="w-full" onClick={handleUpdatePrice}>
          Update Price
        </Button>
      </div>
    </ModalContent>
  )
}
