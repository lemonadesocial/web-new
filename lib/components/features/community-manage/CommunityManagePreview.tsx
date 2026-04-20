'use client';

import React from 'react';
import clsx from 'clsx';

import { Community } from '$lib/components/features/community';
import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { ThemeProvider } from '$lib/components/features/theme-builder/provider';
import { ThemeValues } from '$lib/components/features/theme-builder/store';
import { Space } from '$lib/graphql/generated/backend/graphql';

export default function CommunityManagePreview({
  space,
  themeData,
}: {
  space: Space;
  themeData: ThemeValues;
}) {
  const providerKey = React.useMemo(() => `${space._id}:${JSON.stringify(themeData)}`, [space._id, themeData]);
  const mode = themeData.config.mode;

  return (
    <main
      data-theme-scope="community-preview"
      data-theme={mode === 'auto' ? undefined : mode}
      className={clsx(
        'relative isolate flex w-full min-h-full flex-col overflow-hidden bg-background rounded-none md:rounded-md',
        themeData.theme,
        themeData.config.name,
        themeData.config.color,
        mode === 'light' && 'light',
        mode === 'dark' && 'dark',
      )}
      style={{ ...themeData.variables.font, position: 'relative' } as React.CSSProperties}
    >
      <ThemeGenerator data={themeData} scoped scopeSelector="[data-theme-scope='community-preview']" />
      <ThemeProvider key={providerKey} themeData={themeData}>
        <div className="relative z-10 flex w-full flex-1">
          <div className="page mx-auto w-full px-4 pt-6 pb-20 xl:px-0">
            <Community initData={{ space }} hideManageControls />
          </div>
        </div>
      </ThemeProvider>
    </main>
  );
}
