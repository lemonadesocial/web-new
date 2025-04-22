import { notFound } from 'next/navigation';
import { ResolvingMetadata } from 'next';

import { getClient } from '$lib/request/client';
import { isObjectId } from '$lib/utils/helpers';
import { GetSpaceDocument, Space } from '$lib/generated/backend/graphql';
import { Community } from '$lib/components/features/community';
import { generateUrl } from '$lib/utils/cnd';

type Props = { params: Promise<{ domain: string }> };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);

  const client = getClient();

  const { data } = await client.query({ query: GetSpaceDocument, variables: { hostname: domain } });
  const space = data?.getSpace as Space;

  const previousImages = (await parent).openGraph?.images || [];
  let images = [...previousImages];

  if (space?.image_cover_expanded) {
    images = [generateUrl(space?.image_cover_expanded), ...images];
  }

  return {
    title: space?.title,
    description: space?.description,
    openGraph: {
      images,
    },
  };
}

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
