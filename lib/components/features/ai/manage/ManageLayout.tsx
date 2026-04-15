'use client';
import React from 'react';

import Header from '$lib/components/layouts/header';
import { storeManageLayout, useStoreManageLayout } from './store';
import ManageLayoutToolbar from './ManageLayoutToolbar';
import ManageLayoutContent from './ManageLayoutContent';
import { Button, DrawerContainer } from '$lib/components/core';
import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { Event, GetEventDocument, GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useRequireLemonadeAccount } from '$lib/hooks/useRequireLemonadeAccount';
import { hosting } from '$lib/utils/event';

import { Editor } from '@craftjs/core';
import { resolver } from './craft/resolver';
import { useParams } from 'next/navigation';
import { useQuery } from '$lib/graphql/request';

function ManageLayout() {
  const { isAuthenticated, me } = useRequireLemonadeAccount();
  const params = useParams();
  const shortid = params?.shortid as string;
  const uid = params?.uid as string;

  const state = useStoreManageLayout();

  const { loading: loadingEvent } = useQuery(GetEventDocument, {
    variables: { shortid },
    skip: state.layoutType !== 'event' || !!state.data || !shortid,
    onComplete: (data) => {
      if (data?.getEvent) {
        storeManageLayout.setData(data.getEvent as Event);
      }
    },
  });

  const { loading: loadingSpace } = useQuery(GetSpaceDocument, {
    variables: { id: uid },
    skip: state.layoutType !== 'community' || !!state.data || !uid,
    onComplete: (data) => {
      if (data?.getSpace) {
        storeManageLayout.setData(data.getSpace as Space);
      }
    },
  });

  const event = state.data as Event | undefined;
  const isLoading = loadingEvent || loadingSpace;

  const hasPermission = React.useMemo(() => {
    if (!me || !state.data) return false;

    if (state.layoutType === 'event') {
      return hosting(state.data as Event, me._id);
    }

    if (state.layoutType === 'community') {
      const community = state.data as Space;
      return community.creator === me._id || community.admins?.some((admin) => admin?._id === me._id);
    }

    return false;
  }, [me, state.data, state.layoutType]);

  React.useEffect(() => {
    return () => {
      storeManageLayout.reset();
    };
  }, []);

  if (!isAuthenticated || !me) return null;

  if (isLoading || !state.data) {
    return (
      <div className="h-dvh flex flex-col bg-overlay-primary dark text-primary font-default" data-theme="dark">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin size-8 border-2 border-accent-400 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="h-dvh flex flex-col bg-overlay-primary dark text-primary font-default" data-theme="dark">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-20 text-center px-4 md:px-0">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i aria-hidden="true" className="icon-lock size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">No Access</h2>
            <p className="text-tertiary">
              {state.layoutType === 'event'
                ? "You don't have access to manage this event."
                : "You don't have access to manage this community."}
            </p>
          </div>
          <Button
            variant="tertiary"
            iconRight="icon-chevron-right"
            onClick={() => {
              if (state.layoutType === 'event') {
                if (params.shortid) window.location.href = `/e/${params.shortid}`;
              } else {
                if (params.uid) window.location.href = `/${params.uid}`;
              }
            }}
          >
            {state.layoutType === 'event' ? 'Event Page' : 'Community Page'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-overlay-primary dark" data-theme="dark">
      <Editor
        resolver={resolver}
        enabled={state.activeTab !== 'manage'}
        indicator={{
          success: 'var(--color-accent-400)',
          error: 'var(--color-danger-400)',
          transition: '0.2s',
          thickness: 3,
          className: 'z-200',
        }}
      >
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
