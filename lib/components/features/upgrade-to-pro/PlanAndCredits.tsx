'use client';
import React from 'react';
import { animate, motion, AnimatePresence } from 'framer-motion';
import { match } from 'ts-pattern';
import Link from 'next/link';
import clsx from 'clsx';

import { Button, Card, Segment, Toggle, toast } from '$lib/components/core';
import { formatCurrency } from '$lib/utils/string';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  GetStandCreditsDocument,
  PurchaseSubscriptionDocument,
  Space,
  SubscriptionItem,
  SubscriptionItemType,
  SubscriptionTierEnum,
} from '$lib/graphql/generated/backend/graphql';

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
const COMPARE_TABLE_MIN_WIDTH = 'min-w-[860px] md:min-w-[980px]';
const COMPARE_LABEL_COL_CLASS = 'w-[240px] md:w-[320px]';
const COMPARE_VALUE_COL_CLASS = 'w-[155px] md:w-[170px]';
const CREDIT_ANIMATION_DURATION = 0.9;

function AnimatedCreditCount({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(0, value, {
      duration: CREDIT_ANIMATION_DURATION,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value]);

  return <>{displayValue.toLocaleString('en-US')}</>;
}

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
  const [upgradingTier, setUpgradingTier] = React.useState<SubscriptionTierEnum | null>(null);
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    ai_agents: true,
    domain_branding: false,
    design_page_builder: false,
    newsletter_email: false,
    integrations: false,
    api_access: false,
  });
  const compareHeaderScrollRef = React.useRef<HTMLDivElement>(null);
  const compareBodyScrollRef = React.useRef<HTMLDivElement>(null);
  const isSyncingCompareScroll = React.useRef(false);
  const [purchaseSubscription, { loading: purchasingPlan }] = useMutation(PurchaseSubscriptionDocument, {
    onComplete: (_client, response) => {
      const checkoutUrl = response?.purchaseSubscription?.checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to start checkout';
      toast.error(message);
    },
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
  const isFreePlan = !space.subscription_tier || space.subscription_tier === SubscriptionItemType.Free;
  const [mobileExpandedPlan, setMobileExpandedPlan] = React.useState<string>(SubscriptionItemType.Pro);

  const { data: dataStandCredits } = useQuery(GetStandCreditsDocument, { variables: { standId: space._id } });
  const credits = dataStandCredits?.getStandCredits;
  const hasCreditsData = Boolean(credits);
  const totalCredits = hasCreditsData
    ? (credits?.subscription_credits ?? 0) + (credits?.purchased_credits ?? 0)
    : (space.subscription_credits ?? 0);
  const remainingCredits = hasCreditsData ? Math.max(0, credits?.credits ?? 0) : totalCredits;
  const usedCredits = hasCreditsData ? Math.max(0, totalCredits - remainingCredits) : 0;
  const usedCreditsPercentRaw = totalCredits > 0 ? Math.min(100, (usedCredits / totalCredits) * 100) : 0;
  const usedCreditsBarPercent = Math.max(3, usedCreditsPercentRaw);

  React.useEffect(() => {
    setData(mergedPlans);
  }, [mergedPlans]);

  const handleUpgrade = async (tier: SubscriptionTierEnum, annual: boolean) => {
    if (purchasingPlan) return;

    setUpgradingTier(tier);
    try {
      await purchaseSubscription({
        variables: {
          input: {
            stand_id: space._id,
            tier,
            annual,
          },
        },
      });
    } finally {
      setUpgradingTier(null);
    }
  };

  const syncCompareScroll = React.useCallback((source: HTMLDivElement | null, target: HTMLDivElement | null) => {
    if (!source || !target || isSyncingCompareScroll.current) return;
    isSyncingCompareScroll.current = true;
    target.scrollLeft = source.scrollLeft;
    window.requestAnimationFrame(() => {
      isSyncingCompareScroll.current = false;
    });
  }, []);

  const handleCompareHeaderScroll = React.useCallback(() => {
    syncCompareScroll(compareHeaderScrollRef.current, compareBodyScrollRef.current);
  }, [syncCompareScroll]);

  const handleCompareBodyScroll = React.useCallback(() => {
    syncCompareScroll(compareBodyScrollRef.current, compareHeaderScrollRef.current);
  }, [syncCompareScroll]);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">Plans & Credits</h3>
          <p className="text-tertiary">Manage your subscription plan and credit balance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card.Root className="md:col-span-2">
            <Card.Content className="flex h-full flex-col justify-between">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-sm bg-(--chip-secondary-bg) flex items-center justify-center">
                  <i className="icon-lemonade-logo text-warning-300 w-5 h-5 aspect-square" />
                </div>
                <div>
                  <p>You’re on {(space.subscription_tier || SubscriptionItemType.Free).toUpperCase()} Plan</p>
                  <p className="text-tertiary text-sm">Upgrade anytime!</p>
                </div>
              </div>

              <div>
                <Link href={`/s/manage/${space.slug || space._id}`}>
                  <Button size="sm" variant="tertiary-alt">
                    Manage
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card.Root>

          {isFreePlan ? (
            <Card.Root className="md:col-span-2 overflow-hidden">
              <Card.Content className="relative">
                <div className="pointer-events-none absolute inset-0" />
                <div className="relative flex h-full flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <p>Unlock Credits</p>
                      <div className="rounded-full px-1.5 py-1 bg-(--btn-tertiary) text-tertiary">
                        <p className="text-xs leading-none">What is this?</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-(--btn-tertiary)">
                      <AnimatePresence mode="wait">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: '3%' }}
                          exit={{ width: 0 }}
                          transition={{ type: 'tween' }}
                          className="rounded-full h-5 p-1 flex justify-end"
                        >
                          <div className="h-3 w-3 border-3 border-tertiary rounded-full"></div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <p className="text-sm text-tertiary">
                      Upgrade your plan to unlock credits and get the most out of LemonAI; build pages, generate
                      content, and automate more of your event workflow.
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card.Root>
          ) : (
            <Card.Root className="md:col-span-2">
              <Card.Content className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-tertiary">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <p className="text-primary">Credits Remaining</p>
                    <div className="bg-(--btn-tertiary) w-fit px-1.5 py-[1px] rounded-full">
                      <p className="text-xs">What is this?</p>
                    </div>
                  </div>

                  <p className="ml-auto text-left md:text-right">
                    <AnimatedCreditCount value={usedCredits} /> of {totalCredits.toLocaleString('en-US')}
                  </p>
                </div>
                <div className="rounded-full bg-alert-400/16 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ width: '3%' }}
                      animate={{ width: `${usedCreditsBarPercent}%` }}
                      exit={{ width: 0 }}
                      transition={{ type: 'tween', duration: CREDIT_ANIMATION_DURATION, ease: 'easeOut' }}
                      className="rounded-full bg-linear-to-r from-alert-700 to-alert-400 h-5 p-1 min-w-5 flex justify-end"
                    >
                      <div className="h-3 w-3 border-3 border-white rounded-full"></div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex flex-col gap-3 text-tertiary">
                  <div className="flex items-center gap-0.5 order-1">
                    <div className="size-4 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-alert-400" />
                    </div>
                    <p>Daily credits will be used first</p>
                  </div>

                  <div className="flex flex-col gap-2 order-2">
                    <div className="flex gap-1.5 items-center">
                      <i className="icon-x w-4 h-4 aspect-square" />
                      <p className="text-sm">No credits will rollover</p>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <i className="icon-done w-4 h-4 aspect-square" />
                      <p className="text-sm">Daily credits reset at midnight UTC</p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card.Root>
          )}

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
                              disabled={space.subscription_tier === item.type || purchasingPlan}
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
                              { value: 'card', iconLeft: 'icon-credit-card' },
                              { value: 'wallet', iconLeft: 'icon-wallet' },
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
                            disabled={space.subscription_tier === SubscriptionItemType.Plus || purchasingPlan}
                            loading={upgradingTier === SubscriptionTierEnum.Plus}
                            onClick={() => handleUpgrade(SubscriptionTierEnum.Plus, Boolean(item.annual))}
                          >
                            Upgrade
                          </Button>
                        ))
                        .with(SubscriptionItemType.Pro, () => (
                          <Button
                            disabled={space.subscription_tier === SubscriptionItemType.Pro || purchasingPlan}
                            loading={upgradingTier === SubscriptionTierEnum.Pro}
                            onClick={() => handleUpgrade(SubscriptionTierEnum.Pro, Boolean(item.annual))}
                          >
                            Upgrade
                          </Button>
                        ))
                        .with(SubscriptionItemType.Max, () => (
                          <Button
                            outlined
                            variant="secondary"
                            disabled={space.subscription_tier === SubscriptionItemType.Max || purchasingPlan}
                            loading={upgradingTier === SubscriptionTierEnum.Max}
                            onClick={() => handleUpgrade(SubscriptionTierEnum.Max, Boolean(item.annual))}
                          >
                            Upgrade
                          </Button>
                        ))
                        .otherwise(() => (
                          <Button variant="secondary" outlined>
                            Book a Demo
                          </Button>
                        ))}
                      <button
                        type="button"
                        className="md:hidden py-2 px-3 rounded-sm bg-(--btn-tertiary) text-tertiary flex items-center justify-center gap-1.5"
                        onClick={() => setMobileExpandedPlan((prev) => (prev === item.type ? '' : item.type))}
                        aria-expanded={mobileExpandedPlan === item.type}
                      >
                        <span>Features</span>
                        <i
                          className={clsx(
                            'icon-arrow-down size-4 aspect-square transition-transform',
                            mobileExpandedPlan === item.type && 'rotate-180',
                          )}
                        />
                      </button>

                      <ul className="hidden md:flex flex-col gap-3">
                        <li className="text-tertiary text-sm">
                          <p>{item.featureTitle}</p>
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

                      <AnimatePresence initial={false}>
                        {mobileExpandedPlan === item.type && (
                          <motion.ul
                            key={`${item.type}-mobile-features`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="md:hidden overflow-hidden flex flex-col gap-3"
                          >
                            <li className="text-tertiary text-sm">
                              <p>{item.featureTitle}</p>
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
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card.Content>
                </Card.Root>
              );
            })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="sticky -top-12 z-30 bg-background/95 backdrop-blur border-b border-divider">
          <div
            ref={compareHeaderScrollRef}
            className="overflow-x-auto md:no-scrollbar"
            onScroll={handleCompareHeaderScroll}
          >
            <div className={clsx(COMPARE_TABLE_MIN_WIDTH, 'py-5')}>
              <table className="w-full table-fixed">
                <colgroup>
                  <col className={COMPARE_LABEL_COL_CLASS} />
                  {COMPARE_COLUMNS.map((column) => (
                    <col key={column.key} className={COMPARE_VALUE_COL_CLASS} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    <th className="px-2 text-left">
                      <p className="text-xl md:text-2xl font-bold">Compare Features</p>
                    </th>
                    {COMPARE_COLUMNS.map((column) => (
                      <th key={column.key} className="px-2">
                        <div className="py-1.5 w-full px-2.5 rounded-sm bg-(--btn-tertiary) flex items-center justify-center">
                          <p className="text-sm">{column.label}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>

        <div ref={compareBodyScrollRef} className="overflow-x-auto md:no-scrollbar" onScroll={handleCompareBodyScroll}>
          <div className={clsx(COMPARE_TABLE_MIN_WIDTH, 'flex flex-col gap-3')}>
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

                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className={COMPARE_LABEL_COL_CLASS} />
                      {COMPARE_COLUMNS.map((column) => (
                        <col key={column.key} className={COMPARE_VALUE_COL_CLASS} />
                      ))}
                    </colgroup>
                    <tbody>
                      {previewSection.rows.slice(0, 6).map((row, rowIndex) => (
                        <tr key={row.label}>
                          <th
                            className={clsx(
                              'px-4 py-3 text-tertiary text-left font-normal',
                              rowIndex !== 0 && 'border-t border-divider',
                            )}
                          >
                            <span>{row.label}</span>
                          </th>
                          {COMPARE_COLUMNS.map((column) => (
                            <td
                              key={column.key}
                              className={clsx('px-3 py-3 text-center', rowIndex !== 0 && 'border-t border-divider')}
                            >
                              <div className="flex items-center justify-center">
                                {renderCompareValue(row.values[column.key])}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="h-24" />
                    </tbody>
                  </table>

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
                              <table className="w-full table-fixed">
                                <colgroup>
                                  <col className={COMPARE_LABEL_COL_CLASS} />
                                  {COMPARE_COLUMNS.map((column) => (
                                    <col key={column.key} className={COMPARE_VALUE_COL_CLASS} />
                                  ))}
                                </colgroup>
                                <tbody>
                                  {section.rows.map((row, rowIndex) => (
                                    <tr key={row.label}>
                                      <th
                                        className={clsx(
                                          'px-4 py-3 text-tertiary text-left font-normal',
                                          rowIndex !== 0 && 'border-t border-divider',
                                        )}
                                      >
                                        <span>{row.label}</span>
                                      </th>
                                      {COMPARE_COLUMNS.map((column) => (
                                        <td
                                          key={column.key}
                                          className={clsx(
                                            'px-3 py-3 text-center',
                                            rowIndex !== 0 && 'border-t border-divider',
                                          )}
                                        >
                                          <div className="flex items-center justify-center">
                                            {renderCompareValue(row.values[column.key])}
                                          </div>
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
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
