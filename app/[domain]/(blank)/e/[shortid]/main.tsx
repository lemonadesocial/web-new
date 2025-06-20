'use client';
import React from 'react';
import clsx from 'clsx';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';
import Header from '$lib/components/layouts/header';
import { useResumeSession } from '$lib/hooks/useLens';

export function MainEventLayout({ children }: React.PropsWithChildren) {
  const [state] = useEventTheme();
  useResumeSession();

  return (
    <main
      className={clsx(
        'relative flex flex-col h-dvh w-full z-100 overflow-auto',
        state.theme !== 'default' && [state.config.color, state.config.mode],
      )}
    >
      <ThemeGenerator data={state} />
      <Header />
      <div className="page mx-auto px-4 xl:px-0">{children}</div>
    </main>
  );
}
