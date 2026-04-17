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

  return (
    <main
      data-theme-scope="community-preview"
      className={clsx(
        'relative isolate flex min-h-full w-full flex-col',
        themeData.theme,
        themeData.config.name,
        themeData.config.color,
        themeData.config.mode,
      )}
      style={themeData.variables.font as React.CSSProperties}
    >
      <ThemeGenerator data={themeData} scoped scopeSelector="[data-theme-scope='community-preview']" />
      <ThemeProvider key={providerKey} themeData={themeData}>
        <div className="page relative z-10 mx-auto px-4 pt-6 pb-20 xl:px-0">
          <Community initData={{ space }} hideManageControls />
        </div>
      </ThemeProvider>
    </main>
  );
}
