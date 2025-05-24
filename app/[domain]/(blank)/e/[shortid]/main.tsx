'use client';
import React from 'react';
import clsx from 'clsx';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';
import Header from '$lib/components/layouts/header';

export function MainEventLayout({ children }: React.PropsWithChildren) {
  const [state] = useEventTheme();

  return (
    <main
      className={clsx(
        'relative flex flex-col h-dvh w-full z-100 overflow-auto',
        state.theme !== 'default' && [state.config.color, state.config.mode],
      )}
    >
      <ThemeGenerator />
      <Header />
      <div className="page mx-auto px-4 xl:px-0">{children}</div>
    </main>
  );
}
