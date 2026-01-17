import React from 'react';
import { Metadata } from 'next';

import { getSiteData } from '$lib/utils/fetchers';
import Header from '$lib/components/layouts/header';
import Sidebar from '$lib/components/layouts/sidebar';
import { BottomBar } from '$lib/components/layouts/bottombar';
import { DrawerContainer } from '$lib/components/core/dialog';

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
    <main className="transition-all ease-in-out delay-300 flex w-full">
      <div className="transition-all ease-in-out delay-300 flex flex-col min-h-dvh w-full">
        <Header hideLogo />

        <Sidebar />
        <div className="min-lg:ml-[88px] px-4" style={{ overflowX: 'visible' }}>
          {props.children}
        </div>

        <BottomBar />
      </div>
      <DrawerContainer />
    </main>
  );
}
