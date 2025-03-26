import React from 'react';

import Header from './header';
import { Main } from './main';

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <main className="relative flex flex-col h-dvh w-full z-100">
        <Header />
        <Main>{children}</Main>
      </main>
    </>
  );
}
