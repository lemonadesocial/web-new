'use client';

import React from 'react';
import { isEqual } from 'lodash';

import { toast } from '$lib/components/core';
import { storeManageLayout } from '$lib/components/features/ai/manage/store';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';
import { ThemeValues } from '$lib/components/features/theme-builder/store';
import { Space, UpdateSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { getCommunityThemeData } from './theme';

function CommunityThemeAutoSave({ space }: { space: Space }) {
  const [themeState] = useEventTheme();
  const [updateSpace] = useMutation(UpdateSpaceDocument, {
    onError: (error) => {
      toast.error(error.message || 'Failed to save theme');
    },
  });
  const latestSpaceRef = React.useRef(space);
  const latestThemeRef = React.useRef(themeState);
  const persistedThemeRef = React.useRef(getCommunityThemeData(space));
  const hasMountedRef = React.useRef(false);

  latestSpaceRef.current = space;
  latestThemeRef.current = themeState;

  React.useEffect(() => {
    persistedThemeRef.current = getCommunityThemeData(space);
  }, [space]);

  React.useEffect(() => {
    if (!space._id) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (isEqual(latestThemeRef.current, persistedThemeRef.current)) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      const nextTheme = latestThemeRef.current as ThemeValues;
      const nextSpace = latestSpaceRef.current;

      await updateSpace({
        variables: {
          id: nextSpace._id,
          input: {
            theme_data: nextTheme,
          },
        },
        onComplete: (client) => {
          persistedThemeRef.current = nextTheme;
          client.writeFragment<Space>({
            id: `Space:${nextSpace._id}`,
            data: {
              theme_data: nextTheme,
            },
          });
          storeManageLayout.setData({
            ...nextSpace,
            theme_data: nextTheme,
          });
        },
      });
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [space, themeState, updateSpace]);

  return null;
}

export default function CommunityManageDesignPane({ space }: { space: Space }) {
  return (
    <div className="h-full overflow-auto p-5">
      <CommunityThemeAutoSave space={space} />
      <EventThemeBuilder
        autoSave={false}
        inline
        menuInPortal={false}
        inlinePanelClassName="bg-transparent p-0 pt-0 backdrop-blur-none rounded-none"
      />
    </div>
  );
}
