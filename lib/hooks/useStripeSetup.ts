'use client';

import { useEvent, useUpdateEvent } from "$lib/components/features/event-manage/store";
import { GenerateStripeAccountLinkDocument, UpdateEventPaymentAccountsDocument, Event, CreateNewPaymentAccountDocument, ListNewPaymentAccountsDocument, NewPaymentProvider, PaymentAccountType } from "$lib/graphql/generated/backend/graphql";
import { useMutation, useQuery } from "$lib/graphql/request";
import { useMe } from "./useMe";

export function useStripeSetup() {
  const [generateAccountLink] = useMutation(GenerateStripeAccountLinkDocument, {
    onComplete: (_, res) => {
      location.href = res.generateStripeAccountLink.url;
    }
  });

  return () => {
    const url = window.location.href;

    generateAccountLink({
      variables: {
        refreshUrl: url,
        returnUrl: url,
      }
    });
  };
}

export function useAttachStripeAccount({ skip }: { skip: boolean; }) {
  const updateEvent = useUpdateEvent();
  const event = useEvent();
  const me = useMe();
  
  const [updatePaymentAccount, { loading: loadingUpdatePaymentAccount }] = useMutation(UpdateEventPaymentAccountsDocument, {
    onComplete(_, data) {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent as Event);
      }
    },
  });

  const [createPaymentAccount, { loading: loadingCreatePaymentAccount }] = useMutation(CreateNewPaymentAccountDocument, {
    onComplete(_, res) {
      if (res?.createNewPaymentAccount._id && event?._id) {
        updatePaymentAccount({
          variables: {
            id: event._id,
            payment_accounts_new: [...(event.payment_accounts_new || []), res.createNewPaymentAccount._id]
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
    skip: skip || !event?._id,
    onComplete: (data) => {
      if (!event?._id) return;

      const userAccount = data?.listNewPaymentAccounts[0];

      if (userAccount) {
        updatePaymentAccount({
          variables: {
            id: event._id,
            payment_accounts_new: [...(event.payment_accounts_new || []), userAccount._id]
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

  return { loading: loadingAccounts || loadingUpdatePaymentAccount || loadingCreatePaymentAccount };
}
