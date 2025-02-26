import React from 'react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { Spacer } from '$core/spacer';
import { Sidebar } from '$ui/sidebar';
import { getSiteData } from '$utils/fetchers';
import { client } from '$lib/request/client';
import { GetMeDocument } from '$lib/generated/graphql';

export async function generateMetadata(props: { params: { domain: string } }): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) return null;

  return {
    title: data.title,
  };
}

export default async function SiteLayout(props: { params: { domain: string }; children: React.ReactNode }) {
  const key = 'x-ory-kratos-session';
  const cookieStore = await cookies();
  const session = cookieStore.get(key);

  const { data } = await client.query({
    query: GetMeDocument,
    headers: { [key]: session?.value as string },
  });
  const me = data?.getMe;

  return (
    <>
      <div className="flex h-dvh w-full">
        {me && <Sidebar />}
        <main className="w-full p-4 overflow-auto">
          <div className="container mx-auto">
            <Spacer className="h-14" />
            {props.children}
          </div>
        </main>
      </div>
    </>
  );
}
