import React from 'react';
import { Metadata } from 'next';

import { getSiteData } from '$lib/utils/fetchers';
import Sidebar from '$lib/components/layouts/sidebar';
import { BottomBar } from '$lib/components/layouts/bottombar';
import { DrawerContainer } from '$lib/components/core/dialog';
import { AIChatContainer } from '$lib/components/features/ai/AIChatContainer';
import { AIChatProvider } from '$lib/components/features/ai/provider';
import Header from '$lib/components/layouts/header';

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
    <AIChatProvider>
      <main className="flex w-full">
        <Header />
        <div className="flex h-dvh w-full overflow-hidden">
          <Sidebar />
          <AIChatContainer />
          <div className="flex-1 overflow-auto no-scrollbar px-4">{props.children}</div>

          <BottomBar />
        </div>
        <DrawerContainer />
      </main>
    </AIChatProvider>
  );
}
