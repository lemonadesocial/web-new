import React from 'react';
import Header, { RootMenu } from '$lib/components/layouts/header';

export default async function EventLayout(props: { params: Promise<{ domain: string }>; children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-dvh w-full overflow-y-auto no-scrollbar">
      <div className="z-10000">
        <Header mainMenu={RootMenu} />
      </div>

      {props.children}
    </main>
  );
}
