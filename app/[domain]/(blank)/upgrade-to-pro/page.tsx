import { DEFAULT_UPGRADE_TO_PRO_SECTION } from '$lib/components/features/upgrade-to-pro/sections';
import UpgradeToProPage from './UpgradeToProPage';

import { ListSubscriptionItemsDocument, SubscriptionItem } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';

export default async function Page() {
  const client = getClient();
  const { data } = await client.query({ query: ListSubscriptionItemsDocument });
  const subscriptionData = (data?.listSubscriptionItems || []) as SubscriptionItem[];

  return <UpgradeToProPage activeSection={DEFAULT_UPGRADE_TO_PRO_SECTION} subscriptionData={subscriptionData} />;
}
