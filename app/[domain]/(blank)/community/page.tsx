import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import { client } from '$lib/request/client';
import { isObjectId } from '$lib/utils/helpers';
import { GetMeDocument, GetSpaceDocument, Space, User } from '$lib/generated/backend/graphql';
import { Community } from '$lib/components/features/community';

export default async function Page() {
  // TODO: need to get from site config
  const uid = 'new-spaceabc';
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

  return (
    <div className={space._id}>
      <Community space={space} me={me} />
    </div>
  );
}
