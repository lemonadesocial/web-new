import type { ReactNode } from 'react';

import { SubscriptionItem, type Space } from '$lib/graphql/generated/backend/graphql';

import { CommunityDetail } from './CommunityDetail';
import { Connectors } from './Connectors';
import { CustomDomain } from './CustomDomain';
import { Payouts } from './Payouts';
import { PlanAndCredits } from './PlanAndCredits';
import Team from './Team';
import type { FeatureConfig } from './utils';

export const DEFAULT_UPGRADE_TO_PRO_SECTION = 'plans' as const;

export type UpgradeToProSectionKey = 'overview' | 'team' | 'plans' | 'payouts' | 'custom-domain' | 'connectors';

export type UpgradeToProSection = {
  key: UpgradeToProSectionKey;
  slug: string;
  aliases?: string[];
  label: string;
  icon: string;
  render: (props: { space: Space; subscriptionData?: SubscriptionItem[]; featureConfigs?: FeatureConfig[] }) => ReactNode;
};

export const UPGRADE_TO_PRO_SECTIONS: UpgradeToProSection[] = [
  {
    key: 'overview',
    slug: 'overview',
    aliases: ['community-details'],
    label: 'Community Details',
    icon: 'icon-info',
    render: ({ space }) => <CommunityDetail space={space} />,
  },
  {
    key: 'team',
    slug: 'team',
    aliases: ['people'],
    label: 'Team',
    icon: 'icon-user-group-outline',
    render: ({ space }) => <Team space={space} />,
  },
  {
    key: 'plans',
    slug: 'plans',
    label: 'Plans & Credits',
    icon: 'icon-credit-card',
    render: ({ space, subscriptionData = [], featureConfigs = [] }) => <PlanAndCredits space={space} data={subscriptionData} featureConfigs={featureConfigs} />,
  },
  {
    key: 'payouts',
    slug: 'payouts',
    label: 'Payouts',
    icon: 'icon-send-money',
    render: ({ space }) => <Payouts space={space} />,
  },
  {
    key: 'custom-domain',
    slug: 'custom-domain',
    aliases: ['domain'],
    label: 'Custom Domain',
    icon: 'icon-globe',
    render: ({ space }) => <CustomDomain space={space} />,
  },
  {
    key: 'connectors',
    slug: 'connectors',
    aliases: ['connectors'],
    label: 'Connectors',
    icon: 'icon-connector-line',
    render: ({ space }) => <Connectors space={space} />,
  },
];

const sectionByKey = UPGRADE_TO_PRO_SECTIONS.reduce<Record<UpgradeToProSectionKey, UpgradeToProSection>>(
  (acc, section) => {
    acc[section.key] = section;
    return acc;
  },
  {} as Record<UpgradeToProSectionKey, UpgradeToProSection>,
);

const slugToSectionKey = UPGRADE_TO_PRO_SECTIONS.reduce<Record<string, UpgradeToProSectionKey>>((acc, section) => {
  acc[section.slug] = section.key;
  section.aliases?.forEach((alias) => {
    acc[alias] = section.key;
  });
  return acc;
}, {});

export function getUpgradeToProSection(sectionKey: UpgradeToProSectionKey) {
  return sectionByKey[sectionKey];
}

export function getUpgradeToProSectionKey(sectionSlug?: string | null): UpgradeToProSectionKey | null {
  if (!sectionSlug) return DEFAULT_UPGRADE_TO_PRO_SECTION;
  return slugToSectionKey[sectionSlug] ?? null;
}

export function getUpgradeToProSectionHref(sectionKey: UpgradeToProSectionKey) {
  const section = getUpgradeToProSection(sectionKey);
  if (section.key === DEFAULT_UPGRADE_TO_PRO_SECTION) return '/upgrade-to-pro';
  return `/upgrade-to-pro/${section.slug}`;
}
