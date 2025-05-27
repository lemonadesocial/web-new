'use client';
import React from 'react';
import clsx from 'clsx';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useCommunityTheme } from '$lib/components/features/theme-builder/provider';
import { Space } from '$lib/graphql/generated/backend/graphql';
import Header from '../header';
import LoadMoreWrapper from './loadMoreWrapper';
import Sidebar from './sidebar';

export function CommunityContainer({ space, children }: React.PropsWithChildren & { space: Space }) {
  const [state] = useCommunityTheme();
  return (
    <main
      id={space._id}
      className={clsx(
        'relative flex flex-col h-dvh w-full z-100 overflow-auto',
        state.theme !== 'default' && [state.config.color, state.config.mode],
      )}
    >
      <ThemeGenerator data={state} />
      <LoadMoreWrapper>
        <div className="fixed top-0 left-0 w-screen h-[64px] z-[9] border-b backdrop-blur-md">
          <Header title={space?.title} />
        </div>
        <Sidebar space={space} />
        <div>
          <div className="lg:pl-[97px] pt-[64px]">
            <div className="page mx-auto px-4 xl:px-0 pt-6">{children}</div>
          </div>
        </div>
      </LoadMoreWrapper>
    </main>
  );
}
