import { notFound } from 'next/navigation';
import type { ResolvingMetadata } from 'next';

import { getClient } from '$lib/request/client';
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

export default async function Page({ params }: Props) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);

  const client = getClient();

  const { data } = await client.query({ query: GetSpaceDocument, variables: { hostname: domain } });
  const space = data?.getSpace as Space;

  if (!space) return notFound();

  return (
    <div id={space._id} className={space.theme_data?.config?.mode || 'dark'}>
      <Community space={space} />
    </div>
  );
}
