import React from 'react';
import { Metadata } from 'next';

import { getSiteData } from '$lib/utils/fetchers';
import Header, { RootMenu } from '$lib/components/layouts/header';
import { Spacer } from '$lib/components/core';

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
    <main className="flex flex-col h-dvh w-full divide-y divide-[var(--color-divider)] overflow-y-auto no-scrollbar">
      <div className="sticky z-10 top-0 backdrop-blur-md bg-page-background-overlay">
        <Header mainMenu={RootMenu} />
      </div>

      <div className="w-full h-full px-4">
        <Spacer className="h-6 md:h-11" />
        <div className="mx-auto max-w-[1080px]">{props.children}</div>
      </div>
    </main>
  );
}
