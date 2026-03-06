'use client';

import React from 'react';
import { Button, Card, Divider, Badge, toast, modal, Toggle } from '$lib/components/core';
import {
  GetStandCreditsDocument,
  ListSubscriptionItemsDocument,
  PurchaseSubscriptionDocument,
  PurchaseCreditsDocument,
  CancelCreditSubscriptionDocument,
  Space,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { formatCurrency } from '$lib/utils/string';

const CREDIT_PACKAGES = [
  { amount: '5', label: '$5', credits: 500 },
  { amount: '10', label: '$10', credits: 1_100 },
  { amount: '25', label: '$25', credits: 3_000 },
  { amount: '50', label: '$50', credits: 6_500 },
  { amount: '100', label: '$100', credits: 14_000 },
] as const;

const TIER_ORDER = ['pro', 'plus', 'max', 'enterprise'] as const;

function tierColor(tier?: string | null) {
  switch (tier) {
    case 'pro':
      return 'text-success-400';
    case 'plus':
      return 'text-brand-400';
    case 'max':
      return 'text-warning-400';
    case 'enterprise':
      return 'text-danger-400';
    default:
      return 'text-tertiary';
  }
}

function statusBadgeColor(status?: string | null): string {
  switch (status) {
    case 'active':
      return '#4ade80'; // green
    case 'past_due':
      return '#facc15'; // yellow
    case 'canceled':
    case 'cancelled':
      return '#f87171'; // red
    default:
      return '#a1a1aa'; // gray
  }
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function SettingsCommunitySubscription(props: { space: Space }) {
  const spaceId = props.space._id;

  const [annual, setAnnual] = React.useState(false);

  // Fetch current credits & subscription status
  const { data: creditsData, loading: creditsLoading } = useQuery(GetStandCreditsDocument, {
    variables: { standId: spaceId },
    skip: !spaceId,
  });
  const credits = creditsData?.getStandCredits;

  // Fetch available subscription plans
  const { data: plansData } = useQuery(ListSubscriptionItemsDocument, {});
  const allPlans = plansData?.listSubscriptionItems ?? [];

  // Sort plans by tier order
  const plans = [...allPlans].sort((a, b) => {
    const aIdx = TIER_ORDER.indexOf(a.type?.toLowerCase() as (typeof TIER_ORDER)[number]);
    const bIdx = TIER_ORDER.indexOf(b.type?.toLowerCase() as (typeof TIER_ORDER)[number]);
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });

  // Mutations
  const [purchaseSubscription, { loading: purchasingPlan }] = useMutation(PurchaseSubscriptionDocument, {
    onComplete: (_client, data) => {
      const url = data?.purchaseSubscription?.checkout_url;
      if (url) {
        window.location.href = url;
      }
    },
    onError: (err) => {
      toast.error(err?.message ?? 'Failed to start checkout');
    },
  });

  const [purchaseCredits] = useMutation(PurchaseCreditsDocument, {
    onComplete: (_client, data) => {
      const url = data?.purchaseCredits?.checkout_url;
      if (url) {
        window.location.href = url;
      }
    },
    onError: (err) => {
      toast.error(err?.message ?? 'Failed to start checkout');
    },
  });

  const [cancelSubscription] = useMutation(CancelCreditSubscriptionDocument, {
    onComplete: () => {
      toast.success('Subscription cancelled. It will remain active until the end of the current billing period.');
    },
    onError: (err) => {
      toast.error(err?.message ?? 'Failed to cancel subscription');
    },
  });

  const [buyingPackage, setBuyingPackage] = React.useState<string | null>(null);

  const handleUpgrade = (tier: string) => {
    purchaseSubscription({
      variables: {
        input: {
          stand_id: spaceId,
          tier,
          annual,
        },
      },
    });
  };

  const handleBuyCredits = async (pkg: string) => {
    setBuyingPackage(pkg);
    await purchaseCredits({
      variables: {
        input: {
          stand_id: spaceId,
          package: pkg,
        },
      },
    });
    setBuyingPackage(null);
  };

  const handleCancel = () => {
    modal.open(ConfirmModal, {
      props: {
        title: 'Cancel Subscription?',
        subtitle:
          'Your subscription will remain active until the end of the current billing period. After that, your plan will revert to Free and monthly credits will no longer be added.',
        icon: 'icon-close',
        buttonText: 'Cancel Subscription',
        onConfirm: async () => {
          await cancelSubscription({
            variables: {
              input: {
                stand_id: spaceId,
              },
            },
          });
        },
      },
    });
  };

  const currentTier = credits?.subscription_tier?.toLowerCase() ?? 'free';
  const isSubscribed = credits?.subscription_status === 'active';

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      {/* Current Plan & Credits */}
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold flex-1">Current Plan & Credits</h3>
          <p className="text-secondary">Your subscription status and credit balance.</p>
        </div>

        <Card.Root>
          <Card.Content className="p-0 divide-y divide-(--color-divider)">
            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p className="text-sm text-tertiary">Current Plan</p>
                <p className={`text-lg font-semibold capitalize ${tierColor(credits?.subscription_tier)}`}>
                  {credits?.subscription_tier || 'Free'}
                </p>
              </div>
              {credits?.subscription_status && (
                <Badge color={statusBadgeColor(credits.subscription_status)}>
                  <span className="capitalize">{credits.subscription_status}</span>
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p className="text-sm text-tertiary">Total Credits</p>
                <p className="text-lg font-semibold">{credits?.credits?.toLocaleString() ?? '0'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-tertiary">
                  Subscription: {credits?.subscription_credits?.toLocaleString() ?? '0'}
                </p>
                <p className="text-sm text-tertiary">
                  Purchased: {credits?.purchased_credits?.toLocaleString() ?? '0'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p className="text-sm text-tertiary">Renewal Date</p>
                <p>{formatDate(credits?.subscription_renewal_date)}</p>
              </div>
              {credits?.estimated_depletion_date && (
                <div className="text-right">
                  <p className="text-sm text-tertiary">Est. Depletion</p>
                  <p>{formatDate(credits.estimated_depletion_date)}</p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <Divider />

      {/* Subscription Plans */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold flex-1">Subscription Plans</h3>
            <p className="text-secondary">Upgrade your plan to unlock more credits and features.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${!annual ? 'text-primary font-medium' : 'text-tertiary'}`}>Monthly</span>
            <Toggle id="annual-toggle" checked={annual} onChange={(val) => setAnnual(val)} />
            <span className={`text-sm ${annual ? 'text-primary font-medium' : 'text-tertiary'}`}>Annual</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const tierKey = plan.type?.toLowerCase() ?? '';
            const isCurrentTier = tierKey === currentTier;
            const price = plan.pricing?.price ? Number(plan.pricing.price) : 0;
            const displayPrice = annual ? Math.round(price * 10) : price; // annual = 12 months, ~17% discount displayed as x10
            const currency = plan.pricing?.currency ?? 'USD';
            const decimals = plan.pricing?.decimals ?? 2;

            return (
              <Card.Root key={plan.type} className={isCurrentTier ? 'ring-2 ring-primary' : ''}>
                <Card.Content className="flex flex-col gap-4 p-4">
                  <div>
                    <h4 className={`text-lg font-semibold capitalize ${tierColor(tierKey)}`}>{plan.title}</h4>
                    {plan.credits_per_month != null && (
                      <p className="text-sm text-tertiary">
                        {plan.credits_per_month.toLocaleString()} credits/mo
                      </p>
                    )}
                    {plan.weekly_email_limit != null && (
                      <p className="text-sm text-tertiary">
                        {plan.weekly_email_limit.toLocaleString()} emails/week
                      </p>
                    )}
                  </div>

                  <div>
                    {tierKey === 'enterprise' ? (
                      <p className="text-2xl font-bold">Custom</p>
                    ) : (
                      <>
                        <p className="text-2xl font-bold">
                          {formatCurrency(displayPrice, currency, decimals)}
                          <span className="text-sm font-normal text-tertiary">
                            /{annual ? 'year' : 'month'}
                          </span>
                        </p>
                        {annual && price > 0 && (
                          <p className="text-xs text-success-400">Save ~17% with annual billing</p>
                        )}
                      </>
                    )}
                  </div>

                  {isCurrentTier ? (
                    <Button variant="tertiary" disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : tierKey === 'enterprise' ? (
                    <Button variant="secondary" className="w-full" onClick={() => toast.success('Contact us at support@lemonade.social')}>
                      Contact Sales
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="w-full"
                      loading={purchasingPlan}
                      onClick={() => handleUpgrade(tierKey)}
                    >
                      Upgrade
                    </Button>
                  )}
                </Card.Content>
              </Card.Root>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* Credit Top-ups */}
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold flex-1">Credit Top-ups</h3>
          <p className="text-secondary">Purchase additional credits on top of your subscription.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card.Root key={pkg.amount}>
              <Card.Content className="flex flex-col items-center gap-3 p-4">
                <p className="text-2xl font-bold">{pkg.label}</p>
                <p className="text-sm text-tertiary">{pkg.credits.toLocaleString()} credits</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  loading={buyingPackage === pkg.amount}
                  onClick={() => handleBuyCredits(pkg.amount)}
                >
                  Buy
                </Button>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      </div>

      {/* Cancel Subscription */}
      {isSubscribed && (
        <>
          <Divider />

          <div>
            <Button
              iconLeft="icon-close"
              variant="flat"
              className="text-danger-400!"
              size="sm"
              onClick={handleCancel}
            >
              Cancel Subscription
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
