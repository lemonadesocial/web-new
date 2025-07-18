import React from 'react';

import Header from '$lib/components/layouts/header';

export default function LensProfileLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="relative flex flex-col h-dvh w-full z-100 overflow-auto">
        <div className="fixed top-0 left-0 w-screen h-[64px] z-[9] border-b backdrop-blur-md">
          <Header />
        </div>
        <div>
          <div className="lg:pl-[97px] pt-[64px]">
            <div className="page mx-auto px-4 xl:px-0 pt-6">{children}</div>
          </div>
        </div>
    </main>
  );
}
