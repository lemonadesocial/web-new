import { cookies } from 'next/headers';
import React from 'react';

import { GetMeDocument, User } from '$lib/generated/graphql';
import { client } from '$lib/request/client';
import Header from './header';

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
      <div className="flex flex-col h-dvh w-full">
        <Header me={me} />

        <main className="w-full p-4 overflow-auto flex-1">
          <div className="page mx-auto">{children}</div>
        </main>
      </div>
    </>
  );
}
