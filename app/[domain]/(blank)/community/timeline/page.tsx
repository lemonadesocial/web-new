import { ResolvingMetadata } from 'next';
import dynamic from 'next/dynamic';

import { getClient } from '$lib/graphql/request/client';
import { isObjectId } from '$lib/utils/helpers';
import {
  GetSpaceDocument, Space
} from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { LensAccountCard } from '$lib/components/features/lens-account/LensAccountCard';

type Props = { params: Promise<{ domain: string, uid: string }> };

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

export default function Page() {
  return (
    <div>
      <LensAccountCard />
    </div>
  );
}
