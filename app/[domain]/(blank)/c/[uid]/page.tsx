import React from 'react';
import { notFound } from 'next/navigation';

import { client } from '$lib/request/client';
import { isObjectId } from '$lib/utils/helpers';
import { GetSpaceDocument, Space } from '$lib/generated/backend/graphql';
import Container from './container';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;

  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;

  if (!space) return notFound();

  return <Container space={space} />;
}
