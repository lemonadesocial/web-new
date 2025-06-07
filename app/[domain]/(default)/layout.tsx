import React from 'react';
import { Metadata } from 'next';

import { Spacer } from '$lib/components/core';
import { getSiteData } from '$lib/utils/fetchers';
import Header, { RootMenu } from '$lib/components/layouts/header';

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
  return (
    <>
      <div className="flex flex-col h-dvh w-full divide-y divide-[var(--color-divider)]">
        <Header mainMenu={RootMenu} />

        <main className="w-full  m-auto px-4 overflow-auto h-full">
          <div className="container mx-auto max-w-[1080px]">{props.children}</div>
        </main>
      </div>
    </>
  );
}
