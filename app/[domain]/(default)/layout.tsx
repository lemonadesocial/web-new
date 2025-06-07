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
    <>
      <div className="flex flex-col h-dvh w-full divide-y divide-[var(--color-divider)]">
        <div className="fixed top-0 left-0 right-0 backdrop-blur-md bg-page-background-overlay z-10">
          <Header mainMenu={RootMenu} />
        </div>

        <main className="w-full m-auto px-4 overflow-auto h-full pt-[56px] no-scrollbar">
          <Spacer className="h-6 md:h-11" />
          <div className="container mx-auto max-w-[1080px]">{props.children}</div>
        </main>
      </div>
    </>
  );
}
