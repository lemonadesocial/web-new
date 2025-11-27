import { notFound } from 'next/navigation';
import type { ResolvingMetadata } from 'next';

// import { getClient } from '$lib/graphql/request/client';
// import {
//   GetSpaceTagsDocument,
//   GetSubSpacesDocument,
//   Space,
//   PublicSpace,
//   SpaceTag,
// } from '$lib/graphql/generated/backend/graphql';

import { Community } from '$lib/components/features/community';
import { generateUrl } from '$lib/utils/cnd';
import { getSpace } from '$lib/utils/getSpace';

type Props = { params: Promise<{ domain: string }> };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);

  const space = await getSpace({ hostname: domain });

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

  const space = await getSpace({ hostname: domain });

  if (!space) return notFound();

  // const { subSpaces, spaceTags } = await prefetchData(space);

  return (
    <div className="page mx-auto px-4 xl:px-0 pt-6">
      <Community initData={{ space }} />
    </div>
  );
}

// const prefetchData = async (space: Space) => {
//   const client = getClient();
//
//   const [subSpaces, spaceTags] = await Promise.all([
//     client.query({ query: GetSubSpacesDocument, variables: { id: space._id } }),
//     client.query({ query: GetSpaceTagsDocument, variables: { space: space._id } }),
//   ]);
//
//   return {
//     subSpaces: (subSpaces.data?.getSubSpaces || []) as PublicSpace[],
//     spaceTags: (spaceTags.data?.listSpaceTags || []) as SpaceTag[],
//   };
// };
