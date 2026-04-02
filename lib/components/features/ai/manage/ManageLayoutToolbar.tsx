'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { match } from 'ts-pattern';
import { isEqual, merge } from 'lodash';

import { Button, Menu, MenuItem, modal, sheet, toast } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  Event,
  GetUpcomingEventsDocument,
  PublishEventDocument,
  UpdateEventThemeDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';
import {
  EventThemeProvider,
  ThemeBuilderActionKind,
  useEventTheme,
} from '$lib/components/features/theme-builder/provider';
import { defaultTheme, ThemeValues } from '$lib/components/features/theme-builder/store';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';

import { useUpdateEvent } from '../../event-manage/store';
import { tabMappings } from './helpers';
import { ActiveTabType, storeManageLayout as store, useStoreManageLayout } from './store';
import { PreviewLinkPopup } from './PreviewLinkPopup';

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
        updateEvent({ theme_data: updatedEvent.theme_data });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save theme');
    },
  });

  const normalizeTheme = (theme: any) => merge({}, defaultTheme, theme || {});
  const isThemeDirty = !isEqual(normalizeTheme(themeState), normalizeTheme(event?.theme_data));

  const canSaveTheme = state.layoutType === 'event' && state.activeTab === 'design' && !!event?._id && isThemeDirty;
  const brandTitle = event?.title || 'Event Manager';
  const brandSubtitle = event?.space_expanded?.title || '';
  const isMobileSubPane = state.mobilePane !== 'main';

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

  const handleOpenPublicPage = () => {
    match(state.layoutType)
      .with('event', () => {
        const shortid = (state.data as Event)?.shortid;
        if (shortid) window.open(`/e/${shortid}`);
      })
      .otherwise(() => {});
  };

  const handleOpenMobileChat = () => {
    store.setMobilePane('chat');
  };

  const openDesignSheet = () => {
    sheet.open(SheetMobileDesignAction, {
      detent: 'content',
      containerClass: 'overflow-visible',
      contentClass: 'overflow-visible',
      props: {
        eventId: event?._id,
        themeData: merge({}, themeState),
        onThemeChange: (nextTheme: ThemeValues) =>
          themeDispatch({
            type: ThemeBuilderActionKind.reset,
            payload: merge({}, nextTheme),
          }),
      },
    });
  };

  return (
    <>
      <div className="hidden md:flex h-14 items-center px-4 gap-4">
        <motion.div
          initial={false}
          animate={{ width: state.showSidebarLeft ? 432 : 'auto' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex items-center gap-3 overflow-hidden"
        >
          <button type="button" aria-label="Go to home" className="cursor-pointer" onClick={() => router.push('/')}>
            <i className="icon-lemonade-logo size-5" />
          </button>
          <div className="flex-1">
            <Menu.Root strategy="fixed" placement="bottom-start">
              <Menu.Trigger>
                {({ toggle }) => (
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggle()}>
                    <div className="whitespace-nowrap">
                      <div className="flex justify-between items-center gap-1">
                        <p className="text-sm font-medium">{brandTitle}</p>
                        <i className="icon-arrow-down size-4 text-tertiary" />
                      </div>
                      {!!brandSubtitle && <p className="text-tertiary text-xs">{brandSubtitle}</p>}
                    </div>
                  </div>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-0 w-xs">
                <DropdownComponent shortid={event?.shortid} />
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
                  onClick={() => {
                    store.setActiveTab(key as ActiveTabType);
                    if (!['design', 'preview'].includes(key)) {
                      store.setPreviewMode('desktop');
                    }
                  }}
                  className={clsx(state.activeTab !== key ? 'bg-transparent!' : 'text-primary!')}
                >
                  {state.activeTab === key && item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2">
            {['design', 'preview'].includes(state.activeTab) && (
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
            )}

            <Button variant="tertiary-alt" icon="icon-arrow-outward" size="sm" onClick={handleOpenPublicPage} />
          </div>

          <div className="flex gap-2">
            {state.activeTab === 'manage' && (
              <Button
                size="sm"
                outlined
                iconLeft="icon-arrow-shape-up-stack-outline"
                onClick={() => {
                  router.push(`/upgrade/${event?.space}`);
                }}
              >
                Upgrade
              </Button>
            )}

            {['design', 'preview'].includes(state.activeTab) && (
              <>
                <Menu.Root placement="bottom-end" dismissable={false} className="z-100">
                  <Menu.Trigger>
                    {({ toggle }) => (
                      <Button size="sm" variant="secondary" iconLeft="icon-share" onClick={toggle}>
                        Share Preview
                      </Button>
                    )}
                  </Menu.Trigger>
                  <Menu.Content className="p-0 w-120 rounded-md border-none">
                    <PreviewLinkPopup />
                  </Menu.Content>
                </Menu.Root>
                <Button size="sm" variant="tertiary-alt" onClick={() => store.setActiveTab('manage')}>
                  Close
                </Button>
              </>
            )}

            {canSaveTheme && (
              <>
                <Button size="sm" variant="tertiary-alt" onClick={handleResetTheme}>
                  Reset
                </Button>
                <Button size="sm" variant="secondary" loading={savingTheme} onClick={handleSaveTheme}>
                  Save
                </Button>
              </>
            )}

            {state.activeTab === 'manage' && (
              <Button size="sm" onClick={handlePublish} loading={publishingEvent}>
                {(state.data as Event)?.published ? 'Published' : 'Publish'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header Menu */}
      <div className="md:hidden sticky top-0 z-20 bg-overlay-primary px-3 py-2 flex flex-col gap-2 border-b border-overlay-primary">
        <div className="h-10 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Go to home"
            className="cursor-pointer shrink-0 w-10.5 h-10.5 aspect-square"
            onClick={() => router.push('/')}
          >
            <i className="icon-lemonade-logo size-5" />
          </button>
          <div className="flex-1 flex justify-center">
            <Menu.Root strategy="fixed" placement="bottom">
              <Menu.Trigger>
                {({ toggle }) => (
                  <button
                    type="button"
                    className="flex items-center gap-2 cursor-pointer min-w-0 text-left"
                    onClick={() => toggle()}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-lg font-medium truncate">{brandTitle}</p>
                        <i className="icon-arrow-down size-5 text-tertiary shrink-0" />
                      </div>
                    </div>
                  </button>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-0 w-2xs">
                <DropdownComponent shortid={event?.shortid} />
              </Menu.Content>
            </Menu.Root>
          </div>

          {state.mobilePane === 'chat' ? (
            <Button variant="flat" icon="icon-settings" onClick={() => store.setMobilePane('main')} />
          ) : (
            <Button variant="flat" icon="icon-arrow-outward" onClick={handleOpenPublicPage} />
          )}
        </div>
      </div>

      {/* Mobile Bottom Menu */}
      <div
        className={clsx(
          'md:hidden fixed inset-x-0 bottom-0 z-30 border-t bg-overlay-primary pb-[calc(env(safe-area-inset-bottom)+0.5rem)]',
          isMobileSubPane && 'hidden',
        )}
      >
        <div className="overflow-x-auto flex justify-between items-center p-3">
          <Button
            iconLeft="icon-chat"
            size="sm"
            className="rounded-full"
            variant="tertiary-alt"
            onClick={handleOpenMobileChat}
          >
            Chat
          </Button>
          <div className="flex gap-2 w-max">
            {state.activeTab === 'manage' && state.mobilePane === 'main' && (
              <Button size="sm" className="rounded-full" onClick={handlePublish} loading={publishingEvent}>
                {(state.data as Event)?.published ? 'Published' : 'Publish'}
              </Button>
            )}
            <Button
              size="sm"
              variant="tertiary-alt"
              icon="icon-arrow-shape-up-stack-outline"
              className="rounded-full aspect-square"
              onClick={() => {
                router.push(`/upgrade/${event?.space}`);
              }}
            >
              Upgrade
            </Button>
            {['preview', 'design'].includes(state.activeTab) && (
              <Button
                size="sm"
                variant="secondary"
                icon="icon-share"
                className="rounded-full"
                onClick={() => modal.open(PreviewLinkPopup)}
              >
                Share Preview
              </Button>
            )}

            {canSaveTheme && (
              <>
                <Button size="sm" variant="tertiary-alt" className="rounded-full" onClick={handleResetTheme}>
                  Reset
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                  loading={savingTheme}
                  onClick={handleSaveTheme}
                >
                  Save
                </Button>
              </>
            )}

            <Button
              icon="icon-more-horiz"
              variant="tertiary-alt"
              className="rounded-full aspect-square"
              size="sm"
              onClick={() =>
                sheet.open(SheetMobileMenuAction, {
                  detent: 'content',
                  containerClass: 'overflow-visible',
                  contentClass: 'overflow-visible',
                  props: {
                    active: state.activeTab,
                    onSelect: (action) => {
                      store.setActiveTab(action);
                      store.setMobilePane('main');
                      if (action === 'design') {
                        sheet.close();
                        setTimeout(() => {
                          openDesignSheet();
                        }, 180);
                      } else {
                        sheet.close();
                      }
                    },
                  },
                })
              }
            ></Button>
          </div>
        </div>
      </div>
    </>
  );
}

const tabs = [
  { key: 'events', label: 'Events' },
  { key: 'communities', label: 'Communities' },
  { key: 'coins', label: 'Coins' },
];
function DropdownComponent({ shortid }: { shortid?: string }) {
  const router = useRouter();
  const [active, setActive] = React.useState('events');

  const me = useMe();

  const { data: dataGetEvent } = useQuery(GetUpcomingEventsDocument, {
    variables: {
      skip: 0,
      limit: 10,
      user: me?._id,
      host: true,
      sort: { start: -1 },
    },
    skip: !me?._id || active !== 'events',
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
                  iconRight={item.shortid === shortid ? <i className="icon-done size-4" /> : undefined}
                  iconLeft={
                    item.new_new_photos_expanded?.[0] ? (
                      <Image
                        src={generateUrl(item.new_new_photos_expanded?.[0])}
                        width={16}
                        height={16}
                        className="rounded-xs aspect-square"
                        alt={item.title}
                      />
                    ) : (
                      <div className="w-4 h-4 aspect-square rounded-xs border" />
                    )
                  }
                  title={item.title}
                  onClick={() => router.push(`/e/manage/${item.shortid}`)}
                />
              ))}
              <MenuItem iconLeft="icon-plus" title="New Event" onClick={() => window.open('/create/event')} />
            </div>
          ))
          .with('communities', () => (
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

function SheetMobileMenuAction({
  active,
  onSelect,
}: {
  active: ActiveTabType;
  onSelect: (action: ActiveTabType) => void;
}) {
  return (
    <div className="p-4 flex flex-col gap-3">
      <Button
        variant="tertiary-alt"
        className={clsx(active === 'manage' && 'border-secondary!')}
        onClick={() => onSelect('manage')}
      >
        Manage
      </Button>
      <Button
        variant="tertiary-alt"
        className={clsx(active === 'design' && 'border-secondary!')}
        onClick={() => onSelect('design')}
      >
        Design
      </Button>
      <Button
        variant="tertiary-alt"
        className={clsx(active === 'preview' && 'border-secondary!')}
        onClick={() => onSelect('preview')}
      >
        Preview
      </Button>
    </div>
  );
}

function SheetMobileDesignAction({
  eventId,
  themeData,
  onThemeChange,
}: {
  eventId?: string;
  themeData?: Event['theme_data'];
  onThemeChange?: (theme: ThemeValues) => void;
}) {
  return (
    <EventThemeProvider key={eventId || 'mobile-theme-default'} themeData={themeData}>
      <DesignThemeBridge onThemeChange={onThemeChange} />
      <div className="p-2">
        <EventThemeBuilder autoSave={false} inline menuInPortal={false} />
      </div>
    </EventThemeProvider>
  );
}

function DesignThemeBridge({ onThemeChange }: { onThemeChange?: (theme: ThemeValues) => void }) {
  const [localTheme] = useEventTheme();
  const latestThemeRef = React.useRef(localTheme);

  latestThemeRef.current = localTheme;

  React.useEffect(() => {
    onThemeChange?.(localTheme);
  }, [localTheme, onThemeChange]);

  React.useEffect(() => {
    return () => {
      onThemeChange?.(latestThemeRef.current);
    };
  }, [onThemeChange]);

  return null;
}

export default ManageLayoutToolbar;
