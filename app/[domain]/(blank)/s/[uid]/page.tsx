import { notFound, redirect } from 'next/navigation';

import { isObjectId } from '$lib/utils/helpers';
import { Community } from '$lib/components/features/community';
import { getClient } from '$lib/graphql/request';
import { GetSpaceDocument, GetPublishedConfigDocument, Space } from '$lib/graphql/generated/backend/graphql';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();
  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;
  if (!space) return notFound();

  // If a published page builder config exists, serve the custom page instead
  let hasPublishedConfig = false;
  try {
    const { data: configData } = await client.query({
      query: GetPublishedConfigDocument,
      variables: { owner_type: 'space', owner_id: space._id },
    });
    hasPublishedConfig = !!configData?.getPublishedConfig;
  } catch (err) {
    console.error('[page-builder] Failed to check published config for space', space._id, err);
  }

  if (hasPublishedConfig) {
    redirect(`/s/${uid}/custom`);
  }

  return <Community initData={{ space }} />;
}
