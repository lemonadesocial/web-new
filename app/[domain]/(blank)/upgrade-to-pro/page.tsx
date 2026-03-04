import UpgradeToProContainer from '$lib/components/features/upgrade-to-pro/UpgradeToProContainer';
import { GetListSubscriptionDocument, SubscriptionItem } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';

export default async function Page() {
  const client = getClient();
  const { data } = await client.query({ query: GetListSubscriptionDocument });
  const subscriptionData = (data?.listSubscriptionItems || []) as SubscriptionItem[];

  return <UpgradeToProContainer subscriptionData={subscriptionData} />;
}
