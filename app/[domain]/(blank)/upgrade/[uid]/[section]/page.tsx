import { notFound } from 'next/navigation';

import UpgradeToProPage from '../UpgradeToProPage';

import { getUpgradeToProSectionKey } from '$lib/components/features/upgrade-to-pro/sections';
import { getClient } from '$lib/graphql/request';
import {
  GetSpaceDocument,
  ListSubscriptionItemsDocument,
  Space,
  SubscriptionItem,
} from '$lib/graphql/generated/backend/graphql';
import { isObjectId } from '$lib/utils/helpers';

export default async function Page({ params }: { params: Promise<{ section: string; uid: string }> }) {
  const section = (await params).section;
  const activeSection = getUpgradeToProSectionKey(section);

  if (!activeSection) return notFound();

  const client = getClient();
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  console.log(uid);

  const { data: dataGetSpace } = await client.query({ query: GetSpaceDocument, variables });
  const space = dataGetSpace?.getSpace as Space;
  if (!space) return notFound();

  const { data } = await client.query({ query: ListSubscriptionItemsDocument });
  const subscriptionData = (data?.listSubscriptionItems || []) as SubscriptionItem[];

  return <UpgradeToProPage space={space} activeSection={activeSection} subscriptionData={subscriptionData} />;
}
