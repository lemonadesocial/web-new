import React from 'react';
import { Metadata } from 'next';

import { getSiteData } from '$lib/utils/fetchers';
import Sidebar from '$lib/components/layouts/sidebar';
import { BottomBar } from '$lib/components/layouts/bottombar';
import { DrawerContainer } from '$lib/components/core/dialog';
import { WindowPanesContainer } from '$lib/components/core/dialog/window-panes';
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
        <div className="flex min-h-dvh w-full">
          <Sidebar />
          <AIChatContainer />
          <div className="flex-1 px-4" style={{ overflowX: 'visible' }}>
            {props.children}
          </div>

          <BottomBar />
        </div>
        <DrawerContainer />
      </main>
    </AIChatProvider>
  );
}
