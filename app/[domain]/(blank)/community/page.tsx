import { notFound } from 'next/navigation';
import type { ResolvingMetadata } from 'next';

import { getClient, GraphqlClient } from '$lib/request/client';
import {
  GetSpaceDocument,
  GetSpaceTagsDocument,
  GetSubSpacesDocument,
  Space,
  PublicSpace,
  SpaceTagBase,
} from '$lib/generated/backend/graphql';

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

  const { subSpaces, spaceTags } = await prefetchData(client, space);

  return (
    <div id={space._id} className={space.theme_data?.config?.mode || 'dark'}>
      <Community initData={{ space, subSpaces, spaceTags }} />
    </div>
  );
}

const prefetchData = async (client: GraphqlClient, space: Space) => {
  const [subSpaces, spaceTags] = await Promise.all([
    client.query({ query: GetSubSpacesDocument, variables: { id: space._id } }),
    client.query({ query: GetSpaceTagsDocument, variables: { space: space._id } }),
  ]);

  return {
    subSpaces: (subSpaces.data?.getSubSpaces || []) as PublicSpace[],
    spaceTags: (spaceTags.data?.listSpaceTags || []) as SpaceTagBase[],
  };
};
