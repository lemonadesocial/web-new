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
import {
  Event,
  GetEventDocument,
  GetSpaceDocument,
  PageConfigOwnerType,
  Space,
} from '$lib/graphql/generated/backend/graphql';
import { ThemeValues } from '$lib/components/features/theme-builder/store';
import { useRequireLemonadeAccount } from '$lib/hooks/useRequireLemonadeAccount';
import { hosting } from '$lib/utils/event';
import { isObjectId } from '$lib/utils/helpers';
import { getCommunityThemeData } from '../../community-manage/theme';

import { PageEditorProvider } from '$lib/components/features/page-builder/context';
import { useParams } from 'next/navigation';
import { useQuery } from '$lib/graphql/request';
import { GetPageConfigWithCustomCodeDocument } from '$lib/graphql/custom/page-config';
import { pageThemeToThemeValues, type StoredPageTheme } from '$utils/page-theme-adapter';

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

  const pageConfigShouldFetch = !!state.data?._id && !state.pageConfigId;
  const { data: pageConfigRaw, loading: loadingPageConfig, error: pageConfigError } = useQuery(GetPageConfigWithCustomCodeDocument, {
    variables: {
      ownerType: state.layoutType === 'event' ? PageConfigOwnerType.Event : PageConfigOwnerType.Space,
      ownerId: state.data?._id,
    },
    skip: !pageConfigShouldFetch,
  });

  const pageConfigFields = pageConfigRaw?.getPageConfig;

  React.useEffect(() => {
    if (pageConfigFields?._id) {
      storeManageLayout.setPageConfigId(pageConfigFields._id);
      storeManageLayout.setSavedPageTheme(pageConfigFields.theme || undefined);
      storeManageLayout.setSavedPageCustomCode(pageConfigFields.custom_code || undefined);
      storeManageLayout.setPageCustomCode(pageConfigFields.custom_code || undefined);
    }
  }, [pageConfigFields]);

  // Guard against the brief window where loadingPageConfig is false but the fetch hasn't started
  // yet (useQuery's loading initialises to false), and also guard against query errors so
  // ManageLayoutContent always receives a resolved value (null = no config, object = has config).
  const isLoading = loadingEvent || loadingSpace || loadingPageConfig ||
    (pageConfigShouldFetch && pageConfigRaw === null && !pageConfigError);

  // Resolved value passed to ManageLayoutContent:
  //   undefined → still loading (init effect will wait)
  //   null      → query resolved with no config or errored (init effect builds default layout)
  //   object    → query resolved with a config (init effect deserializes it)
  const resolvedPageConfig = pageConfigShouldFetch && (pageConfigRaw === null || pageConfigError)
    ? null
    : pageConfigRaw?.getPageConfig;

  const savedThemeAsValues = React.useMemo(() => {
    if (state.savedPageTheme) {
      return pageThemeToThemeValues(state.savedPageTheme as StoredPageTheme);
    }
    if (state.layoutType === 'community') {
      return getCommunityThemeData((entity as Space | undefined) || null);
    }
    return (state.data as Event)?.theme_data as ThemeValues | undefined;
  }, [state.savedPageTheme, state.data, state.layoutType, entity]);

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
          key={`${state.layoutType}-${entity?._id || 'manage-theme-default'}`}
          themeData={savedThemeAsValues}
        >
          <ManageLayoutToolbar />
          <ManageLayoutContent pageConfig={resolvedPageConfig}>{children}</ManageLayoutContent>
        </EventThemeProvider>
        <DrawerContainer />
      </PageEditorProvider>
    </div>
  );
}

export default ManageLayout;
