import { DEFAULT_UPGRADE_TO_PRO_SECTION } from '$lib/components/features/upgrade-to-pro/sections';
import UpgradeToProPage from './UpgradeToProPage';

import {
  GetSpaceDocument,
  ListSubscriptionItemsDocument,
  Space,
  SubscriptionItem,
} from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { notFound } from 'next/navigation';
import { isObjectId } from '$lib/utils/helpers';
import { cookies } from 'next/headers';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const client = getClient();
  const cookieStore = await cookies();

  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const { data: dataGetSpace } = await client.query({
    query: GetSpaceDocument,
    variables,
    headers: { Cookie: decodeURIComponent(cookieStore?.toString()) },
    fetchPolicy: 'network-only',
  });
  const space = dataGetSpace?.getSpace as Space;
  if (!space) return notFound();

  const { data } = await client.query({ query: ListSubscriptionItemsDocument });
  const subscriptionData = (data?.listSubscriptionItems || []) as SubscriptionItem[];

  return (
    <UpgradeToProPage
      space={space}
      activeSection={DEFAULT_UPGRADE_TO_PRO_SECTION}
      subscriptionData={subscriptionData}
    />
  );
}
