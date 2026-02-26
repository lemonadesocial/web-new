'use client';
import React from 'react';

import Header from '$lib/components/layouts/header';
import { storeManageLayout } from './store';
import ManageLayoutToolbar from './ManageLayoutToolbar';
import ManageLayoutContent from './ManageLayoutContent';
import { AIChatProvider } from '../provider';
import { useMe } from '$lib/hooks/useMe';
import { DrawerContainer } from '$lib/components/core';

function ManageLayout() {
  const me = useMe();

  React.useEffect(() => {
    return () => {
      storeManageLayout.unsubscribe();
    };
  }, []);

  if (!me) return null;

  return (
    <>
      <Header showUI={false} />
      <AIChatProvider>
        <div className="h-dvh flex flex-col bg-overlay-primary">
          <ManageLayoutToolbar />
          <ManageLayoutContent />
        </div>
      </AIChatProvider>
      <DrawerContainer />
    </>
  );
}

export default ManageLayout;
