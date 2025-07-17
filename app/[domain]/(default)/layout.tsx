import React from 'react';
import { Metadata } from 'next';

import { getSiteData } from '$lib/utils/fetchers';
import Header from '$lib/components/layouts/header';
import Sidebar from '$lib/components/layouts/sidebar';
import { BottomBar } from '$lib/components/layouts/bottombar';

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
    <main className="flex flex-col min-h-dvh w-full">
      <Header hideLogo />

      <Sidebar />
      <div className="md:ml-[88px] px-4">
        <div className="max-w-[1080px] mx-auto">{props.children}</div>
      </div>
      <BottomBar />
    </main>
  );
}
