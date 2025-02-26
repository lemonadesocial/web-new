import { SpaceHeader } from '$lib/components/ui/space/space-header';
import { GetSpaceDocument, Space } from '$lib/generated/graphql';
import { client } from '$lib/request/client';
import { isObjectId } from '$lib/utils/helpers';
import React from 'react';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data.getSpace as Space;

  return (
    <>
      <SpaceHeader space={space} />
    </>
  );
}
