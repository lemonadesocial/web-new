import { notFound } from 'next/navigation';

import UpgradeToProPage from '../UpgradeToProPage';

import { getUpgradeToProSectionKey } from '$lib/components/features/upgrade-to-pro/sections';
import { getClient } from '$lib/graphql/request';
import { ListSubscriptionItemsDocument, SubscriptionItem } from '$lib/graphql/generated/backend/graphql';

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const section = (await params).section;
  const activeSection = getUpgradeToProSectionKey(section);

  if (!activeSection) return notFound();

  const client = getClient();
  const { data } = await client.query({ query: ListSubscriptionItemsDocument });
  const subscriptionData = (data?.listSubscriptionItems || []) as SubscriptionItem[];

  console.log(subscriptionData)

  return <UpgradeToProPage activeSection={activeSection} subscriptionData={subscriptionData} />;
}
