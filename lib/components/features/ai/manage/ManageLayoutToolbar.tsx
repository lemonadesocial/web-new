'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { match } from 'ts-pattern';
import { isEqual, merge } from 'lodash';

import { Button, Menu, MenuItem, toast } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  Event,
  GetUpcomingEventsDocument,
  PublishEventDocument,
  UpdateEventThemeDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';
import { ThemeBuilderActionKind, useEventTheme } from '$lib/components/features/theme-builder/provider';
import { defaultTheme } from '$lib/components/features/theme-builder/store';

import { useUpdateEvent } from '../../event-manage/store';
import { tabMappings } from './helpers';
import { ActiveTabType, storeManageLayout as store, useStoreManageLayout } from './store';

const devices = {
  desktop: {
    icon: 'icon-computer',
  },
  mobile: {
    icon: 'icon-smartphone',
  },
};

function ManageLayoutToolbar() {
  const router = useRouter();
  const state = useStoreManageLayout();
  const [themeState, themeDispatch] = useEventTheme();
  const event = state.data as Event | undefined;

  // NOTE: its bc using different store
  const updateEvent = useUpdateEvent();

  const [publishEvent, { loading: publishingEvent }] = useMutation(PublishEventDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent?.published) {
        toast.success('Event published successfully!');
        updateEvent({ published: true });
        store.setData({ ...state.data, published: true } as Event);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to publish event');
    },
  });
  const [updateEventTheme, { loading: savingTheme }] = useMutation(UpdateEventThemeDocument, {
    onComplete: (_, data) => {
      const updatedEvent = data?.updateEvent;
      if (updatedEvent?._id) {
        toast.success('Theme saved successfully!');
        store.setData({ ...state.data, theme_data: themeState } as Event);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save theme');
    },
  });

  const normalizeTheme = (theme: any) => merge({}, defaultTheme, theme || {});
  const isThemeDirty = !isEqual(normalizeTheme(themeState), normalizeTheme(event?.theme_data));

  const canSaveTheme =
    state.layoutType === 'event' &&
    state.activeTab === 'design' &&
    !!event?._id &&
    isThemeDirty;

  const handlePublish = () => {
    match(state.layoutType)
      .with('event', () => {
        if (state.data?._id) {
          publishEvent({
            variables: {
              event: state.data._id,
            },
          });
        }
      })
      .otherwise(() => {});
  };

  const handleSaveTheme = () => {
    if (!event?._id) return;
    updateEventTheme({
      variables: {
        id: event._id,
        input: { theme_data: themeState },
      },
    });
  };

  const handleResetTheme = () => {
    themeDispatch({
      type: ThemeBuilderActionKind.reset,
      payload: event?.theme_data || defaultTheme,
    });
  };

  return (
    <div className="h-14 flex items-center px-4 gap-4">
      <motion.div
        initial={false}
        animate={{ width: state.showSidebarLeft ? 424 : 'auto' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center gap-3 overflow-hidden"
      >
        <i className="icon-lemonade-logo size-5" onClick={() => router.push('/')} />
        <div className="flex-1">
          <Menu.Root strategy="fixed" placement="bottom-start">
            <Menu.Trigger>
              {({ toggle }) => (
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggle()}>
                  <div className="whitespace-nowrap">
                    <p className="text-sm font-medium">Culture Fest</p>
                    <p className="text-tertiary text-xs">Arts & Culture</p>
                  </div>
                </div>
              )}
            </Menu.Trigger>
            <Menu.Content className="p-0 w-xs">
              <DropdownComponent />
            </Menu.Content>
          </Menu.Root>
        </div>

        <Button
          icon="icon-left-panel-close-outline"
          size="sm"
          variant="tertiary-alt"
          onClick={() => store.toggleSidebarLeft()}
          className="shrink-0"
        />
      </motion.div>

      <div className="flex flex-1 justify-between items-center gap-2">
        <div className="flex gap-2">
          <div className="bg-(--btn-tertiary) backdrop-blur-md rounded-sm">
            {Object.entries(tabMappings).map(([key, item]) => (
              <Button
                key={key}
                iconLeft={item.icon}
                variant="tertiary"
                size="sm"
                onClick={() => store.setActiveTab(key as ActiveTabType)}
                className={clsx(state.activeTab !== key ? 'bg-transparent!' : 'text-primary!')}
              >
                {state.activeTab === key && item.label}
              </Button>
            ))}
          </div>

          <div className="bg-(--btn-tertiary) backdrop-blur-md rounded-sm">
            {Object.entries(devices).map(([key, item]) => (
              <Button
                key={key}
                icon={item.icon}
                variant="tertiary"
                size="sm"
                onClick={() => store.setPreviewMode(key as any)}
                className={clsx(state.device !== key ? 'bg-transparent!' : 'text-primary!')}
              ></Button>
            ))}
          </div>

          <Button
            variant="tertiary-alt"
            icon="icon-arrow-outward"
            size="sm"
            onClick={() => {
              match(state.layoutType)
                .with('event', () => {
                  const shortid = (state.data as Event)?.shortid;
                  if (shortid) window.open(`/e/${shortid}`);
                })
                .otherwise(() => {});
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            iconLeft="icon-arrow-shape-up-stack-outline"
            onClick={() => {
              toast.success('Coming Soon.');
              // router.push('/upgrade-to-pro');
            }}
          >
            Upgrade
          </Button>
          {canSaveTheme && (
            <Button size="sm" variant="tertiary-alt" onClick={handleResetTheme}>
              Reset
            </Button>
          )}
          {canSaveTheme && (
            <Button size="sm" variant="secondary" loading={savingTheme} onClick={handleSaveTheme}>
              Save
            </Button>
          )}
          {state.activeTab === 'manage' && (
            <Button size="sm" onClick={handlePublish} loading={publishingEvent}>
              {(state.data as Event)?.published ? 'Published' : 'Publish'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const tabs = [
  { key: 'events', label: 'Events' },
  { key: 'communites', label: 'Communities' },
  { key: 'coins', label: 'Coins' },
];
function DropdownComponent() {
  const router = useRouter();
  const [active, setActive] = React.useState('events');

  const me = useMe();

  const { data: dataGetEvent } = useQuery(GetUpcomingEventsDocument, {
    variables: { user: me?._id, sort: { start: 1 } },
    skip: !me?._id,
  });
  const events = dataGetEvent?.events || [];

  return (
    <div className="space-y-1">
      <div className="flex px-4 gap-4 border-b pt-1">
        {tabs.map((item) => (
          <div
            key={item.key}
            className={clsx(
              'text-sm py-1 cursor-pointer hover:text-primary hover:border-b hover:border-primary',
              item.key === active ? 'text-primary border-b border-primary' : 'text-tertiary',
            )}
            onClick={() => setActive(item.key)}
          >
            <p>{item.label}</p>
          </div>
        ))}
      </div>
      <div className="px-2 pb-1">
        {match(active)
          .with('events', () => (
            <div className="flex flex-col gap-0.5">
              {events.map((item) => (
                <MenuItem
                  key={item._id}
                  iconLeft={
                    item.new_new_photos_expanded?.[0] ? (
                      <img src={generateUrl(item.new_new_photos_expanded?.[0])} />
                    ) : (
                      <></>
                    )
                  }
                  title={item.title}
                  onClick={() => router.push(`/e/manage/${item.shortid}`)}
                />
              ))}
              <MenuItem iconLeft="icon-plus" title="New Event" onClick={() => window.open('/create/event')} />
            </div>
          ))
          .with('communites', () => (
            <div className="flex items-center justify-center p-7">
              <p>Coming Soon.</p>
            </div>
          ))
          .with('coins', () => (
            <div className="flex items-center justify-center p-7">
              <p>Coming Soon.</p>
            </div>
          ))
          .otherwise(() => null)}
      </div>
    </div>
  );
}

export default ManageLayoutToolbar;
