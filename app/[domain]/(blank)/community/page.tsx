import { notFound } from 'next/navigation';

import { getClient } from '$lib/request/client';
import { GetSpaceDocument, Space } from '$lib/generated/backend/graphql';
import { Community } from '$lib/components/features/community';

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);

  const client = getClient();

  const { data } = await client.query({ query: GetSpaceDocument, variables: { hostname: domain } });
  const space = data?.getSpace as Space;

  if (!space) return notFound();

  return (
    <div className={space._id}>
      <Community space={space} />
    </div>
  );
}
