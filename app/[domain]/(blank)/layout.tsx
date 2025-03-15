import { cookies } from 'next/headers';
import React from 'react';

import { GetMeDocument, User } from '$lib/generated/backend/graphql';
import { client } from '$lib/request/client';
import Header from './header';
import { Main } from './main';

export default async function Layout({ children }: React.PropsWithChildren) {
  const key = 'x-ory-kratos-session';
  const cookieStore = await cookies();
  const session = cookieStore.get('ory_kratos_session_staging');

  const { data } = await client.query({
    query: GetMeDocument,
    headers: { [key]: session?.value as string },
  });
  const me = data?.getMe as User;

  return (
    <>
      <main className="relative flex flex-col h-dvh w-full z-100">
        <Header me={me} />
        <Main>{children}</Main>
      </main>
    </>
  );
}
