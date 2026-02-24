'use client';

import React from 'react';
import { Button, Card, Skeleton, toast } from '$lib/components/core';
import {
  DigitalAccount,
  NewPaymentAccount,
  NewPaymentProvider,
  PaymentAccountType,
} from '$lib/graphql/generated/backend/graphql';
import {
  AttachSpacePaymentAccountDocument,
  CreateNewPaymentAccountDocument,
  ListNewPaymentAccountsDocument,
  ListSpacePaymentAccountsDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useStripeSetup } from '$lib/hooks/useStripeSetup';
import { useMe } from '$lib/hooks/useMe';
import { Space } from '$lib/graphql/generated/backend/graphql';

export type CommunityStripeSectionProps = {
  space: Space;
};

export function CommunityStripeSection({ space }: CommunityStripeSectionProps) {
  const handleStripeSetup = useStripeSetup();
  const me = useMe();

  const { data, loading: loadingSpaceAccounts, refetch } = useQuery(ListSpacePaymentAccountsDocument, {
    variables: { space: space._id },
    skip: !space._id,
  });

  const items = (data?.listSpacePaymentAccounts?.items ?? []) as NewPaymentAccount[];
  const stripeAttachedToSpace = items.some((i) => i.provider === NewPaymentProvider.Stripe);
  const stripeAccountOnSpace = items.find((i) => i.provider === NewPaymentProvider.Stripe);

  const [attachStripeToSpace, { loading: loadingAttachStripe }] = useMutation(
    AttachSpacePaymentAccountDocument,
    {
      onComplete: () => {
        toast.success('Stripe added to community');
        refetch();
      },
      onError: (e) => toast.error(e.message),
    }
  );

  const [createStripeAccount, { loading: loadingCreateStripe }] = useMutation(
    CreateNewPaymentAccountDocument,
    {
      onComplete: (_, res) => {
        if (res?.createNewPaymentAccount._id && space._id) {
          attachStripeToSpace({
            variables: { space: space._id, paymentAccount: res.createNewPaymentAccount._id },
          });
        }
      },
      onError: (e) => toast.error(e.message),
    }
  );

  const { loading: loadingStripeAccounts } = useQuery(ListNewPaymentAccountsDocument, {
    variables: { provider: NewPaymentProvider.Stripe },
    fetchPolicy: 'network-only',
    skip: stripeAttachedToSpace || !space._id,
    onComplete: (accountData) => {
      const userStripeAccount = accountData?.listNewPaymentAccounts?.[0];
      if (userStripeAccount && space._id) {
        attachStripeToSpace({
          variables: { space: space._id, paymentAccount: userStripeAccount._id },
        });
        return;
      }
      if (me?.stripe_connected_account?.connected) {
        createStripeAccount({
          variables: { type: PaymentAccountType.Digital, provider: NewPaymentProvider.Stripe },
        });
      }
    },
  });

  const loading =
    loadingSpaceAccounts ||
    loadingStripeAccounts ||
    loadingAttachStripe ||
    loadingCreateStripe;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold">Stripe</h2>
        {stripeAttachedToSpace ? null : (
          <Button
            variant="secondary"
            size="sm"
            iconLeft="icon-plus"
            onClick={handleStripeSetup}
            loading={loading}
          >
            Connect Stripe
          </Button>
        )}
      </div>
      <Card.Root className="w-full">
        {loading && !stripeAttachedToSpace ? (
          <div className="p-4 space-y-4">
            <Skeleton animate className="w-full min-h-[60px]" />
            <Skeleton animate className="w-full min-h-[40px]" />
          </div>
        ) : !stripeAttachedToSpace ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <i aria-hidden="true" className="icon-stripe-alt size-16 text-quaternary mb-4" />
            <p className="text-lg font-medium text-secondary">Accept Card Payments</p>
            <p className="mt-2 text-sm text-secondary">
              We use{' '}
              <a
                className="text-accent-500"
                target="_blank"
                rel="noreferrer"
                href="https://stripe.com/"
              >
                Stripe
              </a>{' '}
              to process payments. Connect or set up a Stripe account to start accepting
              payments. It usually takes less than 5 minutes.
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={handleStripeSetup}
            >
              Connect Stripe
            </Button>
          </div>
        ) : stripeAccountOnSpace ? (
          <div className="rounded-md bg-card border-card-border">
            <div className="flex items-center gap-4 py-3 px-4">
              <i aria-hidden="true" className="icon-stripe-alt size-10 text-[#635BFF]" />
              <div>
                <p>
                  Stripe Account
                </p>
                <p className="flex items-center gap-2 text-sm text-success-500 mt-1 leading-tight">
                  <span className="size-2 rounded-full bg-success-500 shrink-0" />
                  Active
                </p>
              </div>
            </div>
            <hr className="border-(--color-divider)" />
            <div className="space-y-4 py-3 px-4">
              <div className="space-y-2">
                <p className="text-sm text-secondary">Your Stripe account is active and accepting payments.</p>
                <p className="text-sm text-secondary">
                  Connected account: {(stripeAccountOnSpace.account_info as DigitalAccount).account_id}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="tertiary"
                  className="flex-1"
                  iconRight="icon-arrow-outward"
                  onClick={() => window.open('https://dashboard.stripe.com', '_blank', 'noopener,noreferrer')}
                >
                  Open Stripe
                </Button>
                <Button
                  variant="tertiary"
                  icon="icon-more-vert"
                />
              </div>
            </div>
          </div>
        ) : null}
      </Card.Root>
    </div>
  );
}
