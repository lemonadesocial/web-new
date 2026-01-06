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

  return <Community initData={{ space }} showEvents />;
}
