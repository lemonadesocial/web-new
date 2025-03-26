import { notFound } from 'next/navigation';

import { getClient } from '$lib/request/client';
import { isObjectId } from '$lib/utils/helpers';
import { GetSpaceDocument, Space } from '$lib/generated/backend/graphql';
import { Community } from '$lib/components/features/community';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();

  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;

  if (!space) return notFound();

  return (
    <div className={space._id}>
      <Community space={space} />
    </div>
  );
}
