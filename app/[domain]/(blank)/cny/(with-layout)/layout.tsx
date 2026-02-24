import React from 'react';

import { RedEnvelopesHeader } from '$lib/components/features/cny/Header';
import { RedEnvelopesSidebar } from '$lib/components/features/cny/Sidebar';
import { RedEnvelopesBottomBar } from '$lib/components/features/cny/RedEnvelopesBottomBar';

export default async function RedEnvelopesWithLayout(props: {
  params: Promise<{ domain: string }>;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-dvh w-full !bg-[#450A0A]">
      <div className="fixed top-0 left-0 w-screen h-[64px] z-[9]">
        <RedEnvelopesHeader className="bg-[#450A0A]" />
      </div>
      <RedEnvelopesSidebar />
      <div className="pt-[64px] pb-[96px] lg:pb-0">
        <div className="px-4" style={{ overflowX: 'visible' }}>
          {props.children}
        </div>
      </div>
      <RedEnvelopesBottomBar />
    </main>
  );
}
