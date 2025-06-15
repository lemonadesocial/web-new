'use client';
import React from 'react';
import clsx from 'clsx';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';
import Header, { RootMenu } from '$lib/components/layouts/header';

export function MainEventLayout({ children }: React.PropsWithChildren) {
  const [state] = useEventTheme();

  return (
    <main
      className={clsx(
        'relative flex flex-col h-dvh w-full z-100 overflow-auto',
        state.theme !== 'default' && [state.config.color, state.config.mode],
      )}
    >
      <ThemeGenerator data={state} />
      <Header mainMenu={RootMenu} />
      <div className="w-full h-full mx-auto max-w-[984px] px-4 xl:px-0">{children}</div>
    </main>
  );
}
