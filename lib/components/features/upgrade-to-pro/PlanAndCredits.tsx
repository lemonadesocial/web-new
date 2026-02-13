'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button, Card, Toggle } from '$lib/components/core';
import { formatCurrency } from '$lib/utils/string';
import React from 'react';
import { match } from 'ts-pattern';

const pricingPlans = [
  {
    id: 'pro',
    title: 'Pro',
    description: 'Designed for fast-moving teams building together in real time.',
    price: 2500,
    priceSuffix: 'per month',
    isSaving: false,
    savings: 5000,
    featureTitle: 'All features in Free, plus:',
    features: [
      '100 monthly AI credits',
      '5 daily credits (up to 150/month)',
      'Usage-based Cloud + AI',
      'Credit rollovers',
      'On-demand credit top-ups',
      'Unlimited lemonade.social domains',
      'Custom domains',
      'Remove the Lovable badge',
      'User roles & permissions',
    ],
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Advanced controls and power features for growing departments.',
    price: 5000,
    priceSuffix: 'per month',
    savings: 20000,
    isSaving: false,
    featureTitle: 'All features in Pro, plus:',
    features: [
      '500 monthly AI credits',
      'Internal publish',
      'SSO',
      'Personal Projects',
      'Opt out of data training',
      'Design templates',
    ],
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'Built for large orgs needing flexibility, scale, and governance.',
    price: 0,
    priceSuffix: '',
    savings: 0,
    isSaving: null,
    featureTitle: 'All features in Business, plus:',
    features: [
      'Dedicated support',
      'Onboarding services',
      'Custom connections',
      'Group-based access control',
      'SCIM',
      'Custom design systems',
    ],
  },
];

export function PlanAndCredits() {
  const [data, setData] = React.useState(pricingPlans);

  return (
    <div className="p-4 md:p-12 flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">Plans & Credits</h3>
        <p className="text-tertiary">Manage your subscription plan and credit balance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card.Root className="h-[148px]">
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

        {data.map((item) => {
          const isSaving = data.find((i) => i.id === item.id)?.isSaving;
          return (
            <Card.Root key={item.id}>
              <Card.Content className="p-0">
                <div className="p-4 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold">{item.title}</p>
                    <p className="text-secondary text-sm">{item.description}</p>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex justify-between items-center flex-1 min-h-[40px]">
                      {item.price > 0 && (
                        <div className="flex gap-2 items-end">
                          <p className="text-2xl">
                            {formatCurrency(isSaving ? (item.price * 12 - item.savings) / 12 : item.price)}
                          </p>
                          <p className="text-tertiary">{item.priceSuffix}</p>
                        </div>
                      )}
                      {isSaving && (
                        <Badge color="var(--color-success-400)" className="rounded-full px-2.5 py-1.5">
                          Save {formatCurrency(item.savings)}
                        </Badge>
                      )}
                    </div>
                    {item.price > 0 ? (
                      <p className="text-tertiary text-sm">Shared across unlimited users</p>
                    ) : (
                      <p className="text-tertiary text-lg">Custom</p>
                    )}
                  </div>
                </div>

                <div className="border border-s-0 border-e-0 px-4 py-3">
                  {item.price > 0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Toggle
                          id={item.id}
                          checked={!!data.find((i) => i.id === item.id)?.isSaving}
                          onChange={(value) => {
                            setData((prev) =>
                              prev.map((i) => {
                                if (i.id === item.id) {
                                  return { ...i, isSaving: value };
                                } else {
                                  return i;
                                }
                              }),
                            );
                          }}
                        />
                        <p className="text-tertiary">Annual</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-tertiary">Flexible Plans</p>
                  )}
                </div>

                <div className="flex flex-col gap-6 p-4">
                  {match(item.id)
                    .with('pro', () => <Button>Upgrade</Button>)
                    .with('business', () => (
                      <Button outlined variant="secondary">
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
                    {item.features.map((f, idx) => (
                      <li key={idx} className="flex gap-2">
                        <i className="icon-done size-5 aspect-square" />
                        <p>{f}</p>
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
