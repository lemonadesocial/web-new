'use client';
import React from 'react';

import Header from '$lib/components/layouts/header';
import {
  ActiveTabType,
  LayoutType,
  defaultAvailableTabs,
  storeManageLayout,
  useStoreManageLayout,
} from './store';
import ManageLayoutToolbar from './ManageLayoutToolbar';
import ManageLayoutContent from './ManageLayoutContent';
import { DrawerContainer } from '$lib/components/core';
import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { ThemeValues } from '$lib/components/features/theme-builder/store';
import { Event, Space } from '$lib/graphql/generated/backend/graphql';
import { useRequireLemonadeAccount } from '$lib/hooks/useRequireLemonadeAccount';
import { getCommunityThemeData } from '../../community-manage/theme';

import { Editor } from '@craftjs/core';
import { resolver } from './craft/resolver';

interface Props extends React.PropsWithChildren {
  layoutType?: LayoutType;
  availableTabs?: ActiveTabType[];
}

function ManageLayout({
  children,
  layoutType = 'event',
  availableTabs = defaultAvailableTabs,
}: Props) {
  const { isAuthenticated, me } = useRequireLemonadeAccount();
  const state = useStoreManageLayout();
  const entity = state.data as Event | Space | undefined;
  const availableTabsKey = availableTabs.join(',');
  const themeData = React.useMemo(
    () =>
      layoutType === 'community'
        ? getCommunityThemeData((entity as Space | undefined) || null)
        : (entity?.theme_data as ThemeValues | undefined),
    [entity, layoutType],
  );

  React.useEffect(() => {
    storeManageLayout.setLayoutType(layoutType);
    storeManageLayout.setAvailableTabs(availableTabs);
    storeManageLayout.setActiveTab(availableTabs.includes('manage') ? 'manage' : availableTabs[0] || 'manage');

    return () => {
      storeManageLayout.reset();
    };
  }, [availableTabsKey, layoutType]);

  if (!isAuthenticated || !me) return null;

  return (
    <div className="h-dvh flex flex-col bg-overlay-primary">
      <Editor
        resolver={resolver}
        enabled={true}
        indicator={{
          success: 'var(--color-accent-400)',
          error: 'var(--color-danger-400)',
          transition: '0.2s',
          thickness: 3,
          className: 'z-200',
        }}
      >
        <Header showUI={false} />
        <EventThemeProvider
          key={`${layoutType}-${entity?._id || 'manage-theme-default'}`}
          themeData={themeData}
        >
          <ManageLayoutToolbar />
          <ManageLayoutContent>{children}</ManageLayoutContent>
        </EventThemeProvider>
        <DrawerContainer />
      </Editor>
    </div>
  );
}

export default ManageLayout;
