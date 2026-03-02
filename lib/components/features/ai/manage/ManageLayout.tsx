'use client';
import React from 'react';

import Header from '$lib/components/layouts/header';
import { storeManageLayout, useStoreManageLayout } from './store';
import ManageLayoutToolbar from './ManageLayoutToolbar';
import ManageLayoutContent from './ManageLayoutContent';
import { AIChatProvider } from '../provider';
import { useMe } from '$lib/hooks/useMe';
import { DrawerContainer } from '$lib/components/core';
import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { Event } from '$lib/graphql/generated/backend/graphql';

function ManageLayout() {
  const me = useMe();
  const state = useStoreManageLayout();
  const event = state.data as Event | undefined;

  React.useEffect(() => {
    return () => {
      storeManageLayout.reset();
    };
  }, []);

  if (!me) return null;

  return (
    <>
      <Header showUI={false} />
      <AIChatProvider>
        <EventThemeProvider key={event?._id || 'event-theme-default'} themeData={event?.theme_data}>
          <div className="h-dvh flex flex-col bg-overlay-primary">
            <ManageLayoutToolbar />
            <ManageLayoutContent />
          </div>
        </EventThemeProvider>
      </AIChatProvider>
      <DrawerContainer />
    </>
  );
}

export default ManageLayout;
