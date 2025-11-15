import { notFound } from 'next/navigation';

// import { getClient } from '$lib/graphql/request/client';
import { isObjectId } from '$lib/utils/helpers';
// import {
//   GetSpaceTagsDocument,
//   GetSubSpacesDocument,
//   Space,
//   PublicSpace,
//   SpaceTag,
// } from '$lib/graphql/generated/backend/graphql';
import { Community } from '$lib/components/features/community';
import { getSpace } from '$lib/utils/getSpace';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const space = await getSpace(variables);

  if (!space) return notFound();

  // const { subSpaces, spaceTags } = await prefetchData(space);

  return <Community initData={{ space }} />;
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
