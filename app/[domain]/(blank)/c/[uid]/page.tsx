import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import { client } from '$lib/request/client';
import { isObjectId } from '$lib/utils/helpers';
import { GetMeDocument, GetSpaceDocument, Space, User } from '$lib/generated/backend/graphql';
import Container from './container';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;

  const key = 'x-ory-kratos-session';
  const cookieStore = await cookies();
  const session = cookieStore.get('ory_kratos_session_staging');

  const { data: dataGetMe } = await client.query({
    query: GetMeDocument,
    headers: { [key]: session?.value as string },
  });
  const me = dataGetMe?.getMe as User;

  if (!space) return notFound();

  return <Container space={space} me={me} />;
}
