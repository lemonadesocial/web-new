'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { match } from 'ts-pattern';
import { isEqual, merge } from 'lodash';

import { Button, Menu, MenuItem, modal, sheet, toast } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  CreatePageConfigDocument,
  CreateTemplateDocument,
  Event,
  GetUpcomingEventsDocument,
  PageConfigFragmentFragmentDoc,
  PageConfigOwnerType,
  PublishEventDocument,
  Space,
  SubscriptionItemType,
  Template,
  TemplateCategory,
  TemplateTarget,
  TemplateVisibility,
  UpdatePageConfigDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';
import { themeValuesToPageTheme, pageThemeToThemeValues, type StoredPageTheme } from '$utils/page-theme-adapter';
import { nodesToSections } from '$utils/page-sections-mapper';
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
import { usePageEditor } from '$lib/components/features/page-builder/context';

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
  const params = useParams();
  const state = useStoreManageLayout();
  const [themeState, themeDispatch] = useEventTheme();
  const event = state.data as Event | undefined;
  const space = state.data as Space | undefined;
  const visibleTabs = state.availableTabs.map((key) => [key, tabMappings[key]] as const);
  const hasMultipleTabs = state.availableTabs.length > 1;
  const showWorkspaceSwitcher = state.layoutType === 'event';
  const isEventBuilderView = state.layoutType === 'event' && ['design', 'preview'].includes(state.activeTab);
  const isEventSectionEditing =
    state.layoutType === 'event' && state.activeTab === 'design' && state.builderTab === 'sections';
  const upgradeTarget = state.layoutType === 'event' ? event?.space : space?._id;

  const { actions, query, canUndo, canRedo } = usePageEditor();
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

  const [updatePageConfigTheme, { loading: savingTheme }] = useMutation(UpdatePageConfigDocument, {
    onComplete: (_, data) => {
      const pageConfig = useFragment(PageConfigFragmentFragmentDoc, data?.updatePageConfig);
      if (pageConfig?._id) {
        toast.success('Theme saved successfully!');
        store.setPageConfigId(pageConfig._id);
        store.setSavedPageTheme(themeValuesToPageTheme(themeState) as Record<string, unknown>);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save theme');
    },
  });

  const [updatePageConfig, { loading: updatingPageConfig }] = useMutation(UpdatePageConfigDocument, {
    onComplete: (_, data) => {
      const pageConfig = useFragment(PageConfigFragmentFragmentDoc, data?.updatePageConfig);
      if (pageConfig?._id) {
        toast.success('Layout saved successfully!');
        store.setPageConfigId(pageConfig._id);
        store.setSavedPageTheme(pageConfig.theme as Record<string, unknown>);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save layout');
    },
  });

  const [createTemplate, { loading: creatingTemplate }] = useMutation(CreateTemplateDocument);
  const [createPageConfig, { loading: creatingPageConfig }] = useMutation(CreatePageConfigDocument, {
    onComplete: (_, data) => {
      const pageConfig = useFragment(PageConfigFragmentFragmentDoc, data?.createPageConfig);
      if (pageConfig?._id) {
        toast.success('Layout saved successfully!');
        store.setPageConfigId(pageConfig._id);
        store.setSavedPageTheme(pageConfig.theme as Record<string, unknown>);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save layout');
    },
  });

  const normalizeTheme = (theme: unknown) => merge({}, defaultTheme, theme || {});
  const savedThemeAsValues = state.savedPageTheme
    ? pageThemeToThemeValues(state.savedPageTheme as StoredPageTheme)
    : (event?.theme_data || defaultTheme);
  const isThemeDirty = !isEqual(normalizeTheme(themeState), normalizeTheme(savedThemeAsValues));

  const canSaveTheme =
    state.layoutType === 'event' && state.activeTab === 'design' && !!event?._id && !!state.pageConfigId && isThemeDirty;
  const brandTitle = state.layoutType === 'community' ? space?.title || 'Community Manager' : event?.title || 'Event Manager';
  const brandSubtitle = state.layoutType === 'event' ? event?.space_expanded?.title || '' : '';
  const isMobileSubPane = state.mobilePane !== 'main';

  const handlePublish = () => {
    if (state.layoutType !== 'event' || !state.data?._id) return;

    publishEvent({
      variables: {
        event: state.data._id,
      },
    });
  };

  const handleSaveTheme = () => {
    if (!state.pageConfigId) return;

    updatePageConfigTheme({
      variables: {
        id: state.pageConfigId,
        input: { theme: themeValuesToPageTheme(themeState) as any },
      },
    });
  };

  const handleSaveLayout = async () => {
    if (state.layoutType !== 'event' || !event?._id) return;

    try {
      const serialized = query.serialize();
      const sections = nodesToSections(serialized);

      let templateId: string | undefined;

      if (state.isCreatingTemplate) {
        try {
          const templateResult = await createTemplate({
            variables: {
              input: {
                name: state.templateName || 'New Template',
                slug: (state.templateName || 'new-template').toLowerCase().replace(/\s+/g, '-'),
                category: TemplateCategory.Custom,
                description: 'Custom template created from builder',
                thumbnail_url: '',
                tags: [],
                structure_data: JSON.parse(serialized),
                target: TemplateTarget.Event,
                config: {},
                subscription_tier_min: SubscriptionItemType.Free,
                visibility: TemplateVisibility.Private,
              },
            },
          });
          const newTemplate = templateResult.data?.createTemplate as Template;
          if (!newTemplate?._id) throw new Error('Failed to create template');
          templateId = newTemplate._id;
          store.setIsCreatingTemplate(false);
        } catch (error: any) {
          toast.error(error.message || 'Failed to create template');
          return;
        }
      }

      if (state.pageConfigId) {
        await updatePageConfig({
          variables: {
            id: state.pageConfigId,
            input: {
              sections: sections as any,
              theme: themeValuesToPageTheme(themeState) as any,
            },
          },
        });
<<<<<<< HEAD
      } else {
        // Create new page config
        await createPageConfig({
          variables: {
            input: {
              name: event.title || 'Page Config',
              owner_id: event._id,
              owner_type: state.layoutType === 'event' ? PageConfigOwnerType.Event : PageConfigOwnerType.Space,
              template_id,
              sections: sections as any,
              theme: themeValuesToPageTheme(themeState) as any,
            },
          },
        });
=======
        return;
>>>>>>> origin/master
      }

      await createPageConfig({
        variables: {
          input: {
            name: event.title || 'Page Config',
            owner_id: event._id,
            owner_type: PageConfigOwnerType.Event,
            template_id: templateId,
            sections: sections as any,
          },
        },
      });
    } catch {
      toast.error('Failed to save layout');
    }
  };

  React.useEffect(() => {
    const handleSave = () => {
      handleSaveLayout();
    };

    window.addEventListener('craft-save', handleSave);
    return () => window.removeEventListener('craft-save', handleSave);
  }, [handleSaveLayout]);

  const handleResetTheme = () => {
    themeDispatch({
      type: ThemeBuilderActionKind.reset,
      payload: savedThemeAsValues,
    });
  };

  const handleOpenPublicPage = () => {
    match(state.layoutType)
      .with('event', () => {
        const shortid = (state.data as Event)?.shortid || (params?.shortid as string);
        if (shortid) {
          window.open(`/e/${shortid}`, '_blank');
        } else {
          toast.error('Could not find event shortid');
        }
      })
      .with('community', () => {
        const slugOrId = (state.data as Space)?.slug || (state.data as Space)?._id;
        if (slugOrId) window.open(`/s/${slugOrId}`, '_blank');
      })
      .otherwise(() => {});
  };

  const handleOpenMobileChat = () => {
    store.setMobilePane('chat');
  };

  const openDesignPane = () => {
    if (state.layoutType === 'community') {
      store.setMobilePane('config');
      return;
    }

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
          animate={{ width: state.showSidebarLeft ? 420 : 'auto' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex items-center gap-3 overflow-hidden"
        >
          <button type="button" aria-label="Go to home" className="cursor-pointer" onClick={() => router.push('/')}>
            <i className="icon-lemonade-logo size-5" />
          </button>
          <div className="flex-1">
            {showWorkspaceSwitcher ? (
              <Menu.Root strategy="fixed" placement="bottom-start">
                <Menu.Trigger>
                  {({ toggle }) => (
                    <button
                      type="button"
                      className="flex items-center gap-3 cursor-pointer text-left"
                      onClick={() => toggle()}
                    >
                      <div className="whitespace-nowrap">
                        <div className="flex justify-between items-center gap-1">
                          <p className="text-sm font-medium">{brandTitle}</p>
                          <i className="icon-arrow-down size-4 text-tertiary" />
                        </div>
                        {!!brandSubtitle && <p className="text-tertiary text-xs">{brandSubtitle}</p>}
                      </div>
                    </button>
                  )}
                </Menu.Trigger>
                <Menu.Content className="p-0 w-xs">
                  <DropdownComponent shortid={event?.shortid} />
                </Menu.Content>
              </Menu.Root>
            ) : (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{brandTitle}</p>
                {!!brandSubtitle && <p className="text-tertiary text-xs truncate">{brandSubtitle}</p>}
              </div>
            )}
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
              {visibleTabs.map(([key, item]) => (
                <Button
                  key={key}
                  iconLeft={item.icon}
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    if (key === 'design' && state.layoutType === 'community' && !state.showSidebarLeft) {
                      store.toggleSidebarLeft();
                    }
                    store.setActiveTab(key as ActiveTabType);
                  }}
                  className={clsx(state.activeTab !== key ? 'bg-transparent!' : 'text-primary!')}
                >
                  {state.activeTab === key && item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="bg-(--btn-tertiary) backdrop-blur-md rounded-sm">
              {Object.entries(devices).map(([key, item]) => (
                <Button
                  key={key}
                  icon={item.icon}
                  variant="tertiary"
                  size="sm"
                  onClick={() => store.setPreviewMode(key as any)}
                  className={clsx(state.device !== key ? 'bg-transparent!' : 'text-primary!')}
                />
              ))}
            </div>

            <Button variant="tertiary-alt" icon="icon-arrow-outward" size="sm" onClick={handleOpenPublicPage} />
          </div>

          <div className="flex gap-2">
            {state.activeTab === 'manage' && (
              <Button
                size="sm"
                outlined
                iconLeft="icon-arrow-shape-up-stack-outline"
                onClick={() => {
                  if (upgradeTarget) {
                    router.push(`/upgrade/${upgradeTarget}`);
                  }
                }}
              >
                Upgrade
              </Button>
            )}

            {isEventBuilderView && (
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
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  onClick={() => {
                    handleResetTheme();
                    store.setActiveTab('manage');
                  }}
                >
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

            {state.layoutType === 'event' && state.activeTab === 'manage' && (
              <Button size="sm" onClick={handlePublish} loading={publishingEvent}>
                {(state.data as Event)?.published ? 'Published' : 'Publish'}
              </Button>
            )}

            {isEventSectionEditing && (
              <div className="flex gap-2 ml-2 pl-4 border-l border-(--color-divider)">
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  icon="icon-arrow-back-sharp"
                  disabled={!canUndo}
                  onClick={() => actions.history.undo()}
                />
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  icon="icon-arrow-back-sharp rotate-180"
                  disabled={!canRedo}
                  onClick={() => actions.history.redo()}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  loading={updatingPageConfig || creatingTemplate || creatingPageConfig}
                  onClick={handleSaveLayout}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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
            {showWorkspaceSwitcher ? (
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
            ) : (
              <p className="text-lg font-medium truncate">{brandTitle}</p>
            )}
          </div>

          {isMobileSubPane ? (
            <Button variant="flat" icon="icon-arrow-back-sharp" onClick={() => store.setMobilePane('main')} />
          ) : (
            <Button variant="flat" icon="icon-arrow-outward" onClick={handleOpenPublicPage} />
          )}
        </div>
      </div>

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
            {state.layoutType === 'event' && state.activeTab === 'manage' && state.mobilePane === 'main' && (
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
                if (upgradeTarget) {
                  router.push(`/upgrade/${upgradeTarget}`);
                }
              }}
            >
              Upgrade
            </Button>
            {isEventSectionEditing && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  className="rounded-full aspect-square"
                  icon="icon-arrow-back-sharp"
                  disabled={!canUndo}
                  onClick={() => actions.history.undo()}
                />
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  className="rounded-full aspect-square"
                  icon="icon-arrow-back-sharp rotate-180"
                  disabled={!canRedo}
                  onClick={() => actions.history.redo()}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full px-4"
                  loading={updatingPageConfig || creatingTemplate || creatingPageConfig}
                  onClick={handleSaveLayout}
                >
                  Save Changes
                </Button>
              </div>
            )}
            {isEventBuilderView && (
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

            {hasMultipleTabs && (
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
                      availableTabs: state.availableTabs,
                      onSelect: (action) => {
                        store.setActiveTab(action);
                        store.setMobilePane('main');
                        if (action === 'design') {
                          sheet.close();
                          setTimeout(() => {
                            openDesignPane();
                          }, 180);
                        } else {
                          sheet.close();
                        }
                      },
                    },
                  })
                }
              />
            )}
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
          <button
            type="button"
            key={item.key}
            className={clsx(
              'text-sm py-1 cursor-pointer hover:text-primary hover:border-b hover:border-primary',
              item.key === active ? 'text-primary border-b border-primary' : 'text-tertiary',
            )}
            onClick={() => setActive(item.key)}
          >
            <p>{item.label}</p>
          </button>
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
  availableTabs,
  onSelect,
}: {
  active: ActiveTabType;
  availableTabs: ActiveTabType[];
  onSelect: (action: ActiveTabType) => void;
}) {
  return (
    <div className="p-4 flex flex-col gap-3">
      {availableTabs.includes('manage') && (
        <Button
          variant="tertiary-alt"
          className={clsx(active === 'manage' && 'border-secondary!')}
          onClick={() => onSelect('manage')}
        >
          Manage
        </Button>
      )}
      {availableTabs.includes('design') && (
        <Button
          variant="tertiary-alt"
          className={clsx(active === 'design' && 'border-secondary!')}
          onClick={() => onSelect('design')}
        >
          Design
        </Button>
      )}
      {availableTabs.includes('preview') && (
        <Button
          variant="tertiary-alt"
          className={clsx(active === 'preview' && 'border-secondary!')}
          onClick={() => onSelect('preview')}
        >
          Preview
        </Button>
      )}
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
