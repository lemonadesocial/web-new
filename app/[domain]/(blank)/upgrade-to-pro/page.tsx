import { DEFAULT_UPGRADE_TO_PRO_SECTION } from '$lib/components/features/upgrade-to-pro/sections';
import UpgradeToProPage from './UpgradeToProPage';

import UpgradeToProContainer from '$lib/components/features/upgrade-to-pro/UpgradeToProContainer';
import { GetListSubscriptionDocument, SubscriptionItem } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';

export default async function Page() {
  const client = getClient();
  const { data } = await client.query({ query: GetListSubscriptionDocument });
  const subscriptionData = (data?.listSubscriptionItems || []) as SubscriptionItem[];

  return <UpgradeToProPage activeSection={DEFAULT_UPGRADE_TO_PRO_SECTION} />;

  // return <UpgradeToProContainer subscriptionData={subscriptionData} activeSection={DEFAULT_UPGRADE_TO_PRO_SECTION} />;
}
