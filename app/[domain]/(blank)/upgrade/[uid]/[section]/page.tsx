import { notFound } from 'next/navigation';

import UpgradeToProPage from '../UpgradeToProPage';

import { getUpgradeToProSectionKey } from '$lib/components/features/upgrade-to-pro/sections';
import { getClient } from '$lib/graphql/request';
import {
  GetSpaceDocument,
  ListSubscriptionFeatureConfigsDocument,
  ListSubscriptionItemsDocument,
  Space,
  SubscriptionItem,
} from '$lib/graphql/generated/backend/graphql';
import { isObjectId } from '$lib/utils/helpers';
import { cookies } from 'next/headers';

export default async function Page({ params }: { params: Promise<{ section: string; uid: string }> }) {
  const client = getClient();
  const cookieStore = await cookies();

  const { uid, section } = await params;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const { data: dataGetSpace } = await client.query({
    query: GetSpaceDocument,
    variables,
    headers: { Cookie: decodeURIComponent(cookieStore?.toString()) },
    fetchPolicy: 'network-only',
  });
  const space = dataGetSpace?.getSpace as Space;
  if (!space) return notFound();

  const activeSection = getUpgradeToProSectionKey(section);

  if (!activeSection) return notFound();

  const [{ data }, featureResult] = await Promise.all([
    client.query({ query: ListSubscriptionItemsDocument }),
    client.query({ query: ListSubscriptionFeatureConfigsDocument }).catch(() => ({ data: null })),
  ]);

  const subscriptionData = (data?.listSubscriptionItems || []) as SubscriptionItem[];
  const featureConfigs = featureResult?.data?.listSubscriptionFeatureConfigs || [];

  return (
    <UpgradeToProPage
      space={space}
      activeSection={activeSection}
      subscriptionData={subscriptionData}
      featureConfigs={featureConfigs}
    />
  );
}
