'use client';
import React from 'react';
import clsx from 'clsx';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';

export function EventThemeLayout({ children }: React.PropsWithChildren) {
  const [state] = useEventTheme();

  return (
    <main
      className={clsx(
        'relative h-full w-full z-100 overflow-auto p-6',
        state.theme !== 'default' && [state.config.color, state.config.mode],
      )}
    >
      <ThemeGenerator data={state} style={{ position: 'absolute' }} />
      {children}
    </main>
  );
}
