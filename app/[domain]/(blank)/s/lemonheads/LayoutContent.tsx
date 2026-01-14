'use client';

import React from 'react';
import clsx from 'clsx';

import Header from '$lib/components/layouts/header';
import { Footer } from '$lib/components/layouts/community/footer';
import { Space } from '$lib/graphql/generated/backend/graphql';
import Sidebar from './sidebar';
import { ErrorBoundary } from './ErrorBoundary';
import { defaultTheme } from '$lib/components/features/theme-builder/store';
import { ThemeProvider } from '$lib/components/features/theme-builder/provider';

type LayoutContentProps = {
  space: Space;
  children: React.ReactNode;
};

export function LayoutContent({ space, children }: LayoutContentProps) {
  return (
    <ThemeProvider themeData={defaultTheme}>
      <ErrorBoundary componentName="Lemonheads Layout">
        <main
          id={space._id}
          className={clsx(
            'lemonheads relative flex flex-col h-dvh w-full z-100 overflow-auto',
          )}
        >
          <Sidebar space={space} />
          <div>
            <Header hideLogo className="h-[64px]" />
            <div className="lg:pl-[97px]">
              <div className="max-w-[1256px] mx-auto px-4 xl:px-0 pt-6 w-full">{children}</div>
            </div>
          </div>
          <Footer space={space} />
        </main>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
