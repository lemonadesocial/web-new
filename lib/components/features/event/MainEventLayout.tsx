'use client';
import React from 'react';
import clsx from 'clsx';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';
import { useStoreManageLayout } from '../ai/manage/store';

export function MainEventLayout({ children }: React.PropsWithChildren) {
  const [state] = useEventTheme();
  const { fullScreen } = useStoreManageLayout();

  return (
    <main
      className={clsx(
        'relative flex flex-col w-full z-100 mt-7 md:mt-11',
        state.theme !== 'default' && [state.config.color, state.config.mode],
      )}
    >
      <ThemeGenerator data={state} />
      {fullScreen ? (
        <div className="w-full">{children}</div>
      ) : (
        <div className="page mx-auto px-4 xl:px-0">{children}</div>
      )}
    </main>
  );
}
