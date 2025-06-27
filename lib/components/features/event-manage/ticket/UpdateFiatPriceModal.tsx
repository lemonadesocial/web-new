import { useMutation, useQuery } from "$lib/graphql/request";
import { useStripeSetup } from "$lib/hooks/useStripeSetup";

import { DigitalAccount, ListNewPaymentAccountsDocument, NewPaymentProvider, UpdateEventPaymentAccountsDocument, type Event } from "$lib/graphql/generated/backend/graphql";
import { Button, ModalContent, Skeleton } from "$lib/components/core";
import { useEvent, useUpdateEvent } from "../store";

export function UpdateFiatPriceModal() {
  const event = useEvent();
  const updateEvent = useUpdateEvent();

  const handleStripeSetup = useStripeSetup();
  const stripeAccount = event?.payment_accounts_expanded?.find(account => account?.provider === 'stripe');

  const [updatePaymentAccount, { loading: loadingUpdatePaymentAccount }] = useMutation(UpdateEventPaymentAccountsDocument, {
    onComplete(_, data) {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent as Event);
      }
    },
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
            id: event!._id,
            payment_accounts_new: [...(event!.payment_accounts_new || []), userAccount._id]
          }
        });
      }
    }
  });

  if (loadingAccounts || loadingUpdatePaymentAccount) return (
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

        <Button variant="secondary" className="w-full" onClick={handleStripeSetup}>
          Connect Stripe
        </Button>
      </div>
    </ModalContent>
  )
}
