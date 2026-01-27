import { notFound } from 'next/navigation';

import { isObjectId } from '$lib/utils/helpers';
import { Community } from '$lib/components/features/community';
import { getClient } from '$lib/graphql/request';
import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();
  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;
  if (!space) return notFound();

  return <Community initData={{ space }} />;
}
