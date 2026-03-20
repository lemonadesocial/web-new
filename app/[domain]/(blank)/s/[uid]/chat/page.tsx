import React from 'react';
import { notFound } from 'next/navigation';

import { getClient } from '$lib/graphql/request';
import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { isObjectId } from '$lib/utils/helpers';
import { Config, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import Content from './Content';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();
  const { data: spaceData } = await client.query({ query: GetSpaceDocument, variables });
  const space = spaceData?.getSpace as Space;

  if (!space) return notFound();

  let configs: Config[] = [];
  if (space._id) {
    const { data: dataConfig } = await aiChatClient.query({
      query: GetListAiConfigDocument,
      variables: { filter: { spaces_in: [space?._id] }, skip: !space?._id },
    });
    configs = (dataConfig?.configs.items as Config[]) || [];
  }

  if (!configs.length) return notFound();

  return <Content space={space} />;
}
