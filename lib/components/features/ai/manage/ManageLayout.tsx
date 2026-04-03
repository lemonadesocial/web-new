'use client';
import React from 'react';

import Header from '$lib/components/layouts/header';
import { storeManageLayout, useStoreManageLayout } from './store';
import ManageLayoutToolbar from './ManageLayoutToolbar';
import ManageLayoutContent from './ManageLayoutContent';
import { DrawerContainer } from '$lib/components/core';
import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { useRequireLemonadeAccount } from '$lib/hooks/useRequireLemonadeAccount';

import { Editor } from '@craftjs/core';
import { resolver } from './craft/resolver';

function ManageLayout() {
  const { isAuthenticated, me } = useRequireLemonadeAccount();
  const state = useStoreManageLayout();
  const event = state.data as Event | undefined;

  React.useEffect(() => {
    return () => {
      storeManageLayout.reset();
    };
  }, []);

  if (!isAuthenticated || !me) return null;

  return (
    <div className="h-dvh flex flex-col bg-overlay-primary">
      <Editor resolver={resolver}>
        <Header showUI={false} />
        <EventThemeProvider key={event?._id || 'event-theme-default'} themeData={event?.theme_data}>
          <ManageLayoutToolbar />
          <ManageLayoutContent />
        </EventThemeProvider>
        <DrawerContainer />
      </Editor>
    </div>
  );
}

export default ManageLayout;
