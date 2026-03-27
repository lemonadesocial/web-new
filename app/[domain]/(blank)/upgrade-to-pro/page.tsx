import { DEFAULT_UPGRADE_TO_PRO_SECTION } from '$lib/components/features/upgrade-to-pro/sections';
import UpgradeToProPage from './UpgradeToProPage';

import {
  ListSubscriptionItemsDocument,
  ListSubscriptionFeatureConfigsDocument,
  SubscriptionItem,
} from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import type { FeatureConfig } from '$lib/components/features/upgrade-to-pro/utils';

export default async function Page() {
  const client = getClient();
  const [{ data }, featureResult] = await Promise.all([
    client.query({ query: ListSubscriptionItemsDocument }),
    client.query({ query: ListSubscriptionFeatureConfigsDocument }).catch(() => ({ data: null })),
  ]);
  const subscriptionData = (data?.listSubscriptionItems || []) as SubscriptionItem[];
  const featureConfigs = featureResult?.data?.listSubscriptionFeatureConfigs || [];

  return (
    <UpgradeToProPage
      activeSection={DEFAULT_UPGRADE_TO_PRO_SECTION}
      subscriptionData={subscriptionData}
      featureConfigs={featureConfigs}
    />
  );
}
