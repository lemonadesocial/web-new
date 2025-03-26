import { cookies } from 'next/headers';
import React from 'react';

import { GetMeDocument, User } from '$lib/generated/backend/graphql';
import { getClient } from '$lib/request/client';
import { Main } from './main';

export default async function Layout({ children }: React.PropsWithChildren) {
  const key = 'x-ory-kratos-session';
  const cookieStore = await cookies();
  const session = cookieStore.get('ory_kratos_session_staging');
  const client = getClient();

  const { data } = await client.query({
    query: GetMeDocument,
    headers: { [key]: session?.value as string },
  });
  const me = data?.getMe as User;

  return <Main me={me}>{children}</Main>;
}
