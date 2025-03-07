import React from 'react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { Spacer } from '$lib/components/core';
import { getSiteData } from '$lib/utils/fetchers';
import { GetMeDocument } from '$lib/generated/backend/graphql';

import { client } from '$lib/request';

import Sidebar from './sidebar';

export async function generateMetadata(props: { params: Promise<{ domain: string }> }): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) return null;

  return {
    title: data.title,
  };
}

export default async function SiteLayout(props: { params: Promise<{ domain: string }>; children: React.ReactNode }) {
  const key = 'x-ory-kratos-session';
  const cookieStore = await cookies();
  const session = cookieStore.get('ory_kratos_session_staging');

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
