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

type ComparePlan = 'pro' | 'plus' | 'max' | 'enterprise';
type CompareValue = string | boolean;

type CompareRow = {
  label: string;
  values: Record<ComparePlan, CompareValue>;
};

type CompareSection = {
  id: string;
  title: string;
  icon: string;
  rows: CompareRow[];
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

const COMPARE_COLUMNS: Array<{ key: ComparePlan; label: string }> = [
  { key: 'pro', label: 'Pro' },
  { key: 'plus', label: 'Plus' },
  { key: 'max', label: 'Max' },
  { key: 'enterprise', label: 'Enterprise' },
];
const COMPARE_GRID_CLASS =
  '[grid-template-columns:220px_minmax(132px,1fr)_repeat(4,minmax(max-content,1fr))] md:[grid-template-columns:300px_minmax(160px,1fr)_repeat(4,minmax(max-content,1fr))]';

function renderCompareValue(value: CompareValue) {
  if (typeof value === 'boolean') {
    return (
      <i
        className={clsx('size-5 aspect-square', value ? 'icon-check text-success-500' : 'icon-cancel text-danger-400')}
        aria-hidden="true"
      />
    );
  }

  return <span className="text-tertiary">{value}</span>;
}

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
  const [isCompareExpanded, setIsCompareExpanded] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    ai_agents: true,
    domain_branding: false,
    design_page_builder: false,
    newsletter_email: false,
    integrations: false,
    api_access: false,
  });

  const compareSections = React.useMemo<CompareSection[]>(() => {
    const planByType = new Map(mergedPlans.map((item) => [item.type, item]));
    const getCredits = (type: PlanCard['type']) =>
      planByType.get(type)?.credits_per_month?.toLocaleString('en-US') ?? 'Custom';

    return [
      {
        id: 'ai_agents',
        title: 'AI & Agents',
        icon: 'icon-robot',
        rows: [
          {
            label: 'AI credits / month',
            values: {
              pro: getCredits(SubscriptionItemType.Pro),
              plus: getCredits(SubscriptionItemType.Plus),
              max: getCredits(SubscriptionItemType.Max),
              enterprise: getCredits('enterprise'),
            },
          },
          {
            label: 'Top-up multiplier bonus',
            values: {
              pro: '1x (no bonus)',
              plus: '1.5x',
              max: '2x',
              enterprise: 'Custom',
            },
          },
          {
            label: 'Advanced AI models (Sonnet, GPT-4o, Gemini Pro)',
            values: { pro: 'Unlimited', plus: 'Unlimited', max: 'Unlimited', enterprise: 'Unlimited' },
          },
          {
            label: 'Premium AI models (Opus)',
            values: { pro: false, plus: true, max: true, enterprise: true },
          },
          {
            label: 'Custom AI agents',
            values: { pro: '1', plus: '3', max: '10', enterprise: 'Unlimited' },
          },
          {
            label: 'AI tool categories',
            values: {
              pro: 'Basic, Standard',
              plus: 'Basic, Standard, Advanced',
              max: 'Basic, Standard, Advanced',
              enterprise: 'All',
            },
          },
          {
            label: 'AI page generations / month',
            values: { pro: '20', plus: 'Unlimited', max: 'Unlimited', enterprise: 'Unlimited' },
          },
        ],
      },
      {
        id: 'domain_branding',
        title: 'Domain & Branding',
        icon: 'icon-globe',
        rows: [
          { label: 'Custom event slug', values: { pro: true, plus: true, max: true, enterprise: true } },
          { label: 'Custom domain', values: { pro: false, plus: true, max: true, enterprise: true } },
          { label: 'Remove Lemonade branding', values: { pro: true, plus: true, max: true, enterprise: true } },
        ],
      },
      {
        id: 'design_page_builder',
        title: 'Design & Page Builder',
        icon: 'icon-palette-outline',
        rows: [
          {
            label: 'Premium themes',
            values: { pro: '10', plus: 'Unlimited', max: 'Unlimited', enterprise: 'Unlimited' },
          },
          {
            label: 'Page builder sections',
            values: {
              pro: 'All sections',
              plus: 'All sections + Containers',
              max: 'All sections + Containers',
              enterprise: 'Full access',
            },
          },
          {
            label: 'Custom code injection',
            values: { pro: 'CSS', plus: 'CSS', max: 'CSS, HTML', enterprise: 'CSS, HTML, JS' },
          },
        ],
      },
      {
        id: 'newsletter_email',
        title: 'Newsletter & Email',
        icon: 'icon-email',
        rows: [
          { label: 'Newsletter access', values: { pro: true, plus: true, max: true, enterprise: true } },
          { label: 'Sends / month', values: { pro: '4', plus: '12', max: '30', enterprise: 'Unlimited' } },
          {
            label: 'Recipients / send',
            values: { pro: '1,000', plus: '5,000', max: '25,000', enterprise: 'Unlimited' },
          },
        ],
      },
      {
        id: 'integrations',
        title: 'Integrations',
        icon: 'icon-connector-line',
        rows: [
          {
            label: 'Connectors',
            values: { pro: 'Google Sheets, Airtable', plus: 'All', max: 'All', enterprise: 'All' },
          },
          { label: 'API access', values: { pro: true, plus: true, max: true, enterprise: true } },
          { label: 'Marketplace seller', values: { pro: true, plus: true, max: true, enterprise: true } },
          { label: 'Referral stablecoin rewards', values: { pro: true, plus: true, max: true, enterprise: true } },
          {
            label: 'Config version history',
            values: { pro: '20', plus: '50', max: 'Unlimited', enterprise: 'Unlimited' },
          },
        ],
      },
      {
        id: 'api_access',
        title: 'API access',
        icon: 'icon-api',
        rows: [
          { label: 'Max API keys', values: { pro: '3', plus: '10', max: '25', enterprise: '999' } },
          { label: 'Rate limit / min', values: { pro: '60', plus: '120', max: '300', enterprise: '1,000' } },
          { label: 'Burst / sec', values: { pro: '3', plus: '5', max: '15', enterprise: '50' } },
          { label: 'Max page size', values: { pro: '50', plus: '100', max: '100', enterprise: '250' } },
          {
            label: 'Monthly quota',
            values: { pro: '10,000', plus: '50,000', max: '200,000', enterprise: '1,000,000' },
          },
          {
            label: 'Overage enabled',
            values: { pro: false, plus: '($2.00 / 1k)', max: '($1.50 / 1k)', enterprise: '($1.00 / 1k)' },
          },
          { label: 'Hard cap', values: { pro: '10,500', plus: '100,000', max: '500,000', enterprise: 'Unlimited' } },
          {
            label: 'Scopes',
            values: {
              pro: 'events: read',
              plus: 'events: read, write subscribers: read, write',
              max: 'events: read, write subscribers: read, write',
              enterprise: 'events: read, write subscribers: read, write',
            },
          },
        ],
      },
    ];
  }, [mergedPlans]);
  const previewSection = compareSections[0];

  React.useEffect(() => {
    setData(mergedPlans);
  }, [mergedPlans]);

  return (
    <div className="flex flex-col gap-7">
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

          {[...data]
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
                                {formatCurrency(
                                  Number(item.pricing.price),
                                  item.pricing.currency,
                                  item.pricing.decimals,
                                )}
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
                        {item.pricing ? (
                          <p className="text-tertiary text-sm">Shared across unlimited users</p>
                        ) : (
                          <p className="text-tertiary text-lg">Custom</p>
                        )}
                      </div>
                    </div>

                    <div className="border border-s-0 border-e-0 px-4 py-3">
                      {item.pricing ? (
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
                              {f.replace(
                                '{{credits_per_month}}',
                                item.credits_per_month?.toLocaleString('en-US') ?? '',
                              )}
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

      <div className="space-y-3">
        <div className="overflow-x-auto md:no-scrollbar">
          <div className="min-w-[860px] md:min-w-[980px] flex flex-col gap-3">
            <div className={clsx('grid gap-2 py-5', COMPARE_GRID_CLASS)}>
              <div className="col-span-2">
                <p className="text-xl md:text-2xl font-bold">Compare Features</p>
              </div>

              {COMPARE_COLUMNS.map((column) => (
                <div
                  key={column.key}
                  className="py-1.5 w-full px-2.5 rounded-sm bg-(--btn-tertiary) flex items-center justify-center"
                >
                  <p className="text-sm">{column.label}</p>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {!isCompareExpanded && previewSection && (
                <motion.div
                  key="compare-preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24, ease: 'easeInOut' }}
                  className="relative border border-divider rounded-sm overflow-hidden bg-overlay-primary"
                >
                  <div className="w-full h-12 px-4 bg-(--btn-tertiary) flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i
                        aria-hidden="true"
                        className={clsx('size-5 aspect-square text-primary', previewSection.icon)}
                      />
                      <p className="font-medium">{previewSection.title}</p>
                    </div>
                    <div className="flex items-center justify-center bg-(--btn-tertiary) rounded-xs size-6 aspect-square">
                      <i className="size-4 aspect-square text-tertiary icon-arrow-down rotate-180" />
                    </div>
                  </div>

                  {previewSection.rows.slice(0, 6).map((row, rowIndex) => (
                    <div
                      key={row.label}
                      className={clsx('grid', COMPARE_GRID_CLASS, rowIndex !== 0 && 'border-t border-divider')}
                    >
                      <div className="px-4 py-3 text-tertiary col-span-2">
                        <p>{row.label}</p>
                      </div>
                      {COMPARE_COLUMNS.map((column) => (
                        <div key={column.key} className="px-3 py-3 text-center flex items-center justify-center">
                          {renderCompareValue(row.values[column.key])}
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background to-transparent" />
                </motion.div>
              )}

              {isCompareExpanded && (
                <motion.div
                  key="compare-expanded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  className="flex flex-col gap-3"
                >
                  {compareSections.map((section) => {
                    const isOpen = openSections[section.id] ?? true;

                    return (
                      <div
                        key={section.id}
                        className="border border-divider rounded-sm overflow-hidden bg-overlay-primary"
                      >
                        <button
                          type="button"
                          className="cursor-pointer w-full h-12 px-4 bg-(--btn-tertiary) flex items-center justify-between"
                          onClick={() => setOpenSections((prev) => ({ ...prev, [section.id]: !isOpen }))}
                          aria-expanded={isOpen}
                        >
                          <div className="flex items-center gap-2">
                            <i aria-hidden="true" className={clsx('size-5 aspect-square text-primary', section.icon)} />
                            <p className="font-medium">{section.title}</p>
                          </div>
                          <div className="flex items-center justify-center bg-(--btn-tertiary) rounded-xs size-6 aspect-square">
                            <i
                              className={clsx(
                                'size-4 aspect-square text-tertiary',
                                isOpen ? 'icon-arrow-down rotate-180' : 'icon-arrow-down',
                              )}
                            />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key={`${section.id}-content`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div>
                                {section.rows.map((row, rowIndex) => (
                                  <div
                                    key={row.label}
                                    className={clsx(
                                      'grid',
                                      COMPARE_GRID_CLASS,
                                      rowIndex !== 0 && 'border-t border-divider',
                                    )}
                                  >
                                    <div className="px-4 py-3 text-tertiary col-span-2">
                                      <p>{row.label}</p>
                                    </div>
                                    {COMPARE_COLUMNS.map((column) => (
                                      <div
                                        key={column.key}
                                        className="px-3 py-3 text-center flex items-center justify-center"
                                      >
                                        {renderCompareValue(row.values[column.key])}
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {!isCompareExpanded && (
          <div className="relative z-10 -mt-20 pb-4 flex justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" variant="tertiary-alt" onClick={() => setIsCompareExpanded(true)}>
                Compare Features
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
