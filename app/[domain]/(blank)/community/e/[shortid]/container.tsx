'use client';
import React from 'react';
import clsx from 'clsx';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';

export function EventContainer({ children }: React.PropsWithChildren) {
  const [state] = useEventTheme();

  return (
    <main className={clsx(state.theme !== 'default' && [state.config.color, state.config.mode])}>
      <ThemeGenerator />
      <div className="page mx-auto px-4 xl:px-0">{children}</div>
    </main>
  );
}
