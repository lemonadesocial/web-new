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
import { Button, DrawerContainer } from '$lib/components/core';
import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { ThemeValues } from '$lib/components/features/theme-builder/store';
import { Event, GetEventDocument, GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useRequireLemonadeAccount } from '$lib/hooks/useRequireLemonadeAccount';
import { hosting } from '$lib/utils/event';
import { isObjectId } from '$lib/utils/helpers';
import { getCommunityThemeData } from '../../community-manage/theme';

import { PageEditorProvider } from '$lib/components/features/page-builder/context';
import { useParams } from 'next/navigation';
import { useQuery } from '$lib/graphql/request';

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
  const params = useParams();
  const shortid = params?.shortid as string;
  const uid = params?.uid as string;

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

  const { loading: loadingEvent } = useQuery(GetEventDocument, {
    variables: { shortid },
    skip: state.layoutType !== 'event' || !!state.data || !shortid,
    onComplete: (data) => {
      if (data?.getEvent) {
        storeManageLayout.setData(data.getEvent as Event);
      }
    },
  });

  const spaceVariables = React.useMemo(() => {
    if (!uid) return undefined;
    return isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  }, [uid]);

  const { loading: loadingSpace } = useQuery(GetSpaceDocument, {
    variables: spaceVariables,
    skip: state.layoutType !== 'community' || !!state.data || !spaceVariables,
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
    storeManageLayout.setLayoutType(layoutType);
    storeManageLayout.setAvailableTabs(availableTabs);
    storeManageLayout.setActiveTab(availableTabs.includes('manage') ? 'manage' : availableTabs[0] || 'manage');

    return () => {
      storeManageLayout.reset();
    };
  }, [availableTabsKey, layoutType]);

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
                if (params.uid) window.location.href = `/s/${params.uid}`;
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
      <PageEditorProvider enabled={state.activeTab !== 'manage'}>
        <Header showUI={false} />
        <EventThemeProvider
          key={`${layoutType}-${entity?._id || 'manage-theme-default'}`}
          themeData={themeData}
        >
          <ManageLayoutToolbar />
          <ManageLayoutContent>{children}</ManageLayoutContent>
        </EventThemeProvider>
        <DrawerContainer />
      </PageEditorProvider>
    </div>
  );
}

export default ManageLayout;
