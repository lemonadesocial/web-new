'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { match } from 'ts-pattern';

import { Button, Card, Segment, Toggle } from '$lib/components/core';
import { formatCurrency } from '$lib/utils/string';
import { Space, SubscriptionItem, SubscriptionItemType } from '$lib/graphql/generated/backend/graphql';
import clsx from 'clsx';

type PlanCard = {
  type: SubscriptionItemType | 'enterprise';
  title?: string;
  description?: string;
  price?: number | null;
  annual: boolean | null;
  featureTitle: string;
  method?: 'card' | 'wallet';
  features: string[];
  pricing?: SubscriptionItem['pricing'];
  credits_per_month?: number | null;
};

const pricingPlans: PlanCard[] = [
  {
    type: SubscriptionItemType.Plus,
    description: 'More AI, more reach — for organizers who are scaling up.',
    annual: false,
    featureTitle: 'All features in Free, and:',
    method: 'card',
    features: [
      '{{credits_per_month}} AI credits per month (with 1.5x top-up bonus)',
      'Premium AI models (Opus)',
      '3 custom AI agents',
      'Basic, Standard & Advanced AI tool categories',
      'Unlimited AI page generations',
      'Custom domain',
      'Unlimited premium themes',
      'All page builder sections + layout containers',
      'All integrations & connectors',
      '12 newsletter sends/month, up to 5,000 recipients',
      '50 version history saves',
      'API overage enabled ($2.00/1k)',
      'Google Sheets & Airtable connectors',
      'Full read/write API scopes (events + subscribers)',
    ],
  },
  {
    type: SubscriptionItemType.Pro,
    description: 'For creators and organizers ready to build, sell, and grow.',
    annual: false,
    method: 'card',
    featureTitle: 'All features in Pro, and:',
    features: [
      '{{credits_per_month}} monthly AI credits',
      'Premium AI models (Opus)',
      '3 custom AI agents',
      'Basic & Standard AI tool categories',
      '20 AI page generations per month',
      'Custom event slug',
      'Remove Lemonade branding',
      '10 premium themes',
      'All page builder sections',
      'CSS code injection',
      'Newsletter access (4 sends/month, up to 1,000 recipients)',
      'Google Sheets & Airtable connectors',
      'API access (3 keys, 60 req/min, 10k monthly quota, events:read scope)',
      'Marketplace seller access',
      'Referral stablecoin rewards',
      '20 version history saves',
    ],
  },
  {
    type: SubscriptionItemType.Max,
    description: 'High-volume tools for serious event businesses. No compromises.',
    annual: false,
    method: 'card',
    featureTitle: 'All features in Plus, and:',
    features: [
      '{{credits_per_month}} AI credits per month (with 2x top-up bonus)',
      '10 custom AI agents',
      '30 newsletter sends/month, up to 25,000 recipients',
      'CSS & HTML code injection',
      'Unlimited version history',
      'Opt out of data training',
      'Higher API limits (25 keys, 300 req/min, 200k monthly quota, 500k hard cap)',
    ],
  },
  {
    type: 'enterprise',
    title: 'Enterprise',
    description: 'Custom everything, for organizations that need it their way.',
    price: null,
    annual: null,
    featureTitle: 'All features in Max, and:',
    features: [
      'Custom AI credits & top-up terms',
      'Dedicated support',
      'All AI tool categories',
      'Unlimited newsletter sends & recipients',
      'Full custom code injection (CSS, HTML, JS)',
      'Custom domain & full white-label',
      'Up to 999 API keys, 1,000 req/min, 1M monthly quota, unlimited hard cap',
      'Overage at lowest rate ($1.00/1k)',
      'Larger max page size (250)',
      'Custom pricing & SLA',
    ],
  },
];

function buildPlans(subscriptionItems: SubscriptionItem[]): PlanCard[] {
  const subscriptionByType = new Map(subscriptionItems.map((item) => [item.type, item]));

  return pricingPlans.map((plan) => {
    if (plan.type === 'enterprise') return { ...plan };

    const subscription = subscriptionByType.get(plan.type);
    return subscription ? { ...plan, ...subscription } : { ...plan };
  });
}

export function PlanAndCredits({ space, data: subscriptionItems = [] }: { space: Space; data?: SubscriptionItem[] }) {
  const mergedPlans = React.useMemo(() => buildPlans(subscriptionItems), [subscriptionItems]);
  const [data, setData] = React.useState<PlanCard[]>(mergedPlans);

  React.useEffect(() => {
    setData(mergedPlans);
  }, [mergedPlans]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">Plans & Credits</h3>
        <p className="text-tertiary">Manage your subscription plan and credit balance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card.Root className="h-[148px] md:col-span-2">
          <Card.Content className="flex h-full flex-col justify-between">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-sm bg-(--chip-secondary-bg) flex items-center justify-center">
                <i className="icon-lemonade-logo text-warning-300 w-5 h-5 aspect-square" />
              </div>
              <div>
                <p>You’re on Free Plan</p>
                <p className="text-tertiary text-sm">Upgrade anytime!</p>
              </div>
            </div>

            <div>
              <Button size="sm" variant="tertiary-alt">
                Manage
              </Button>
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root className="md:col-span-2">
          <Card.Content className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-tertiary">
              <div className="flex items-center gap-1.5">
                <p className="text-primary">Credits Remaining</p>
                <div className="bg-(--btn-tertiary) w-fit px-1.5 py-[1px] rounded-full">
                  <p className="text-xs">What is this?</p>
                </div>
              </div>

              <p>3 of 5</p>
            </div>
            <div className="rounded-full bg-alert-400/16">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '10%' }}
                  exit={{ width: 0 }}
                  transition={{ type: 'tween' }}
                  className="rounded-full bg-linear-to-r from-alert-700 to-alert-400 h-5 p-1 flex justify-end"
                >
                  <div className="h-3 w-3 border-3 border-white rounded-full"></div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-start justify-between text-tertiary">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1.5 items-center">
                  <i className="icon-x w-4 h-4 aspect-square" />
                  <p className="text-sm">No credits will rollover</p>
                </div>
                <div className="flex gap-1.5 items-center">
                  <i className="icon-done w-4 h-4 aspect-square" />
                  <p className="text-sm">Daily credits reset at midnight UTC</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <div className="size-4 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-alert-400" />
                </div>
                <p>Daily credits will be used first</p>
              </div>
            </div>
          </Card.Content>
        </Card.Root>

        {data
          .sort((a, b) => Number(a.pricing?.price) - Number(b.pricing?.price))
          .map((item) => {
            return (
              <Card.Root key={item.type}>
                <Card.Content className="p-0">
                  <div className="p-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="text-secondary text-sm">{item.description}</p>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center flex-1 min-h-[32px]">
                        {!!item.pricing && (
                          <div className="flex gap-2 items-end">
                            <p className="text-2xl">
                              {formatCurrency(Number(item.pricing.price), item.pricing.currency, item.pricing.decimals)}
                            </p>
                            <p className="text-tertiary">per month</p>
                          </div>
                        )}
                        {/* {isSaving && ( */}
                        {/*   <Badge color="var(--color-success-400)" className="rounded-full px-2.5 py-1.5"> */}
                        {/*     Save {formatCurrency(item.savings)} */}
                        {/*   </Badge> */}
                        {/* )} */}
                      </div>
                      {!!item.pricing ? (
                        <p className="text-tertiary text-sm">Shared across unlimited users</p>
                      ) : (
                        <p className="text-tertiary text-lg">Custom</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-s-0 border-e-0 px-4 py-3">
                    {!!item.pricing ? (
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Toggle
                            id={item.type}
                            checked={!!data.find((i) => i.type === item.type)?.annual}
                            onChange={(value) => {
                              setData((prev) =>
                                prev.map((i) => {
                                  if (i.type === item.type) {
                                    return { ...i, annual: value };
                                  } else {
                                    return i;
                                  }
                                }),
                              );
                            }}
                          />
                          <p className="text-tertiary">Annual</p>
                        </div>

                        <Segment
                          items={[
                            { value: 'card', iconLeft: 'icon-credit-card', label: 'Card' },
                            { value: 'wallet', iconLeft: 'icon-wallet', label: 'Wallet' },
                          ]}
                          selected={item.method}
                          size="sm"
                          className={clsx(item.annual ? 'visible' : 'invisible')}
                        />
                      </div>
                    ) : (
                      <p className="text-tertiary py-1">Flexible Plans</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-6 p-4">
                    {match(item.type)
                      .with(SubscriptionItemType.Plus, () => (
                        <Button
                          outlined
                          variant="secondary"
                          disabled={space.subscription_tier === SubscriptionItemType.Plus}
                        >
                          Upgrade
                        </Button>
                      ))
                      .with(SubscriptionItemType.Pro, () => (
                        <Button disabled={space.subscription_tier === SubscriptionItemType.Pro}>Upgrade</Button>
                      ))
                      .with(SubscriptionItemType.Max, () => (
                        <Button
                          outlined
                          variant="secondary"
                          disabled={space.subscription_tier === SubscriptionItemType.Plus}
                        >
                          Upgrade
                        </Button>
                      ))
                      .otherwise(() => (
                        <Button variant="secondary" outlined>
                          Book a Demo
                        </Button>
                      ))}
                    <ul className="flex flex-col gap-3">
                      <li className="text-tertiary text-sm">
                        <p>All features in Free, plus:</p>
                      </li>
                      {item.features?.map((f) => (
                        <li key={f} className="flex gap-2">
                          <i className="icon-done size-5 aspect-square" />
                          <p>
                            {f.replace('{{credits_per_month}}', item.credits_per_month?.toLocaleString('en-US') ?? '')}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card.Content>
              </Card.Root>
            );
          })}
      </div>
    </div>
  );
}
