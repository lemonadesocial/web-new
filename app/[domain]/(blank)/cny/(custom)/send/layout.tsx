import React from 'react';

import { RedEnvelopesHeader } from '$lib/components/features/cny/Header';

export default async function CustomLayout(props: { params: Promise<{ domain: string }>; children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-dvh w-full">
      <div className="fixed top-0 left-0 w-screen h-[80px] z-[9]">
        <RedEnvelopesHeader showHomeLogo />
      </div>
      <div className="pt-[80px] pb-20 w-full px-0">
        {props.children}
      </div>
    </main>
  );
}
