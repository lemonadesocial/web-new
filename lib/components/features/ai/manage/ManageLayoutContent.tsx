'use client';
import React from 'react';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { match } from 'ts-pattern';

import { useQuery } from '$lib/graphql/request';
import { AiConfigFieldsFragment, Config, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { AIChatActionKind, useAIChat } from '../provider';
import { aiChatClient } from '$lib/graphql/request/instances';
import {
  Event,
  GetEventDocument,
  GetPageConfigDocument,
  PageConfigFragmentFragmentDoc,
  PageConfigOwnerType,
  Space,
} from '$lib/graphql/generated/backend/graphql';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';
import { EventGuestSide } from '$lib/components/features/event/EventGuestSide';
import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { ThemeBuilderActionKind, useEventTheme } from '$lib/components/features/theme-builder/provider';

import { mockWelcomeEvent } from '../InputChat';
import { AIChat } from '../AIChat';
import { DesignTool } from './DesignTool';
import ManageEventLayout from '../../event-manage/ManageEventLayout';
import ManageCommunityLayout from '../../community-manage/ManageCommunityLayout';
import CommunityManageDesignPane from '../../community-manage/CommunityManageDesignPane';
import CommunityManagePreview from '../../community-manage/CommunityManagePreview';

import { storeManageLayout as store, useStoreManageLayout } from './store';
import { usePageEditor } from '$lib/components/features/page-builder/context';
import { setAIPageEditTriggers } from '$lib/components/features/page-builder/hooks/ai-page-edit-bridge';
import { sectionsToNodes, nodesToSections, sectionToNodePatch, type PageSection } from '$utils/page-sections-mapper';
import { pageThemeToThemeValues, type StoredPageTheme } from '$utils/page-theme-adapter';
import { SettingsPanel } from './SettingsPanel';

const communityPreviewTabs = new Set(['design', 'preview']);

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

function ManageLayoutContent({ children }: React.PropsWithChildren) {
  const params = useParams();
  const shortid = params?.shortid as string | undefined;

  const [ready, setReady] = React.useState(false);
  const isMobile = useIsMobile();

  const state = useStoreManageLayout();
  const [themeState, themeDispatch] = useEventTheme();
  const [_, aiChatDispatch] = useAIChat();
  const initializedConfigEventRef = React.useRef<string | null>(null);

  const { selectedId, actions, query } = usePageEditor();
  const isSelected = selectedId !== null;

  const cachedEvent = state.data as Event | undefined;
  const community = state.layoutType === 'community' ? (state.data as Space | undefined) : undefined;
  const shouldFetchEvent = state.layoutType === 'event' && !!shortid && cachedEvent?.shortid !== shortid;

  const { data: dataGetEvent } = useQuery(GetEventDocument, {
    variables: { shortid },
    skip: !shouldFetchEvent,
  });
  const event =
    (dataGetEvent?.getEvent as Event | undefined) || (cachedEvent?.shortid === shortid ? cachedEvent : undefined);
  const eventId = event?._id;

  const { data: pageConfigData } = useQuery(GetPageConfigDocument, {
    variables: { ownerType: PageConfigOwnerType.Event, ownerId: eventId },
    skip: !eventId,
  });
  const pageConfig = pageConfigData?.getPageConfig;
  const pageConfigData_ = useFragment(PageConfigFragmentFragmentDoc, pageConfig);

  React.useEffect(() => {
    store.setPageConfigId((pageConfig as any)?._id ?? undefined);
    store.setSavedPageTheme((pageConfigData_ as any)?.theme ?? undefined);
    if (pageConfig) {
      aiChatDispatch({
        type: AIChatActionKind.set_page_config,
        payload: { pageConfig },
      });
    }
  }, [pageConfig, pageConfigData_, aiChatDispatch]);

  const hasInitializedRef = React.useRef(false);
  React.useEffect(() => {
    // Fire once the page config query has resolved (pageConfigData !== undefined),
    // even when sections is empty — sectionsToNodes([]) builds a default layout.
    if (pageConfigData === undefined || hasInitializedRef.current) return;
    try {
      const sections = ((pageConfigData_?.sections ?? []) as unknown as PageSection[]);
      const nodes = sectionsToNodes(sections);
      actions.deserialize(JSON.stringify(nodes));
      actions.history.clear();

      // Init theme: prefer PageConfig.theme, fall back to Event.theme_data
      const storedTheme = (pageConfigData_ as any)?.theme as StoredPageTheme | undefined;
      if (storedTheme) {
        themeDispatch({ type: ThemeBuilderActionKind.reset, payload: pageThemeToThemeValues(storedTheme) });
      } else if (event?.theme_data) {
        themeDispatch({ type: ThemeBuilderActionKind.reset, payload: event.theme_data });
      }

      hasInitializedRef.current = true;
    } catch (e) {
      console.error('Failed to deserialize pageConfig sections', e);
    }
  }, [pageConfigData, pageConfigData_, actions]);

  useQuery(
    GetListAiConfigDocument,
    {
      variables: { filter: { events_eq: eventId } },
      onComplete: (data) => {
        if (eventId) {
          initializedConfigEventRef.current = eventId;
        }
        if (data?.configs?.items?.length) {
          const config = data.configs.items[0] as AiConfigFieldsFragment;
          aiChatDispatch({
            type: AIChatActionKind.set_config,
            payload: {
              config: config._id,
              configs: data.configs.items as Config[],
              messages: event ? mockWelcomeEvent(event) : undefined,
            },
          });
        }
      },
      skip: !eventId || initializedConfigEventRef.current === eventId,
    },
    aiChatClient,
  );

  React.useEffect(() => {
    if (
      state.layoutType === 'event' &&
      event?._id &&
      event.shortid === shortid &&
      initializedConfigEventRef.current !== event._id
    ) {
      store.setData(event);

      aiChatDispatch({
        type: AIChatActionKind.reset,
        payload: {
          data: { event_id: event._id, space_id: event.space },
          standId: event.space,
          messages: mockWelcomeEvent(event),
        },
      });

      initializedConfigEventRef.current = event._id;

      if (!ready) setReady(true);
    }
  }, [state.layoutType, event, ready, shortid, aiChatDispatch]);

  React.useEffect(() => {
    if (state.layoutType === 'community' && !ready) {
      setReady(true);
    }
  }, [ready, state.layoutType]);

  const communityChatProps =
    state.layoutType === 'community' && community?._id
      ? ({
          hideSpaceSelector: true,
          fixedSpaceId: community._id,
        } as const)
      : undefined;

  const sidebarContent = match([state.layoutType, state.activeTab] as const)
    .with(['event', 'manage'], () => (
      <div className="h-full px-4">
        <AIChat compact />
      </div>
    ))
    .with(['community', 'manage'], () => (
      <div className="h-full px-4">
        <AIChat compact {...communityChatProps} />
      </div>
    ))
    .with(['event', 'design'], () => (
      <div className="h-full">
        <DesignTool />
      </div>
    ))
    .with(['community', 'design'], () => (community ? <CommunityManageDesignPane space={community} /> : null))
    .with(['event', 'preview'], () => (
      <div className="h-full px-4">
        <AIChat compact />
      </div>
    ))
    .with(['community', 'preview'], () => (
      <div className="h-full px-4">
        <AIChat compact {...communityChatProps} />
      </div>
    ))
    .otherwise(() => null);

  const editorRef = React.useRef({ actions, query, state });
  editorRef.current = { actions, query, state };

  const themeDispatchRef = React.useRef(themeDispatch);
  themeDispatchRef.current = themeDispatch;

  React.useEffect(() => {
    setAIPageEditTriggers({
      applyStructureData: (data: string) => {
        editorRef.current.actions.deserialize(data);
      },
      applySections: (sections: PageSection[]) => {
        const nodes = sectionsToNodes(sections);
        editorRef.current.actions.deserialize(JSON.stringify(nodes));
      },
      applySectionUpdate: (section: PageSection) => {
        const { actions, query } = editorRef.current;
        const { nodeId, props } = sectionToNodePatch(section);
        try {
          query.node(nodeId).get();
          actions.setProp(nodeId, (p: Record<string, unknown>) => Object.assign(p, props));
        } catch {
          // Node doesn't exist — inject at end of main-col
          const nodes = sectionsToNodes([section]);
          const newNode = nodes[nodeId];
          if (newNode && query.node('main-col').get()) {
            actions.addNode('main-col', newNode.type.resolvedName, newNode.displayName, newNode.props);
          }
        }
      },
      applyTheme: (theme: Record<string, unknown>) => {
        const themeValues = pageThemeToThemeValues(theme as StoredPageTheme);
        themeDispatchRef.current({ type: ThemeBuilderActionKind.reset, payload: themeValues });
      },
      getSections: () => {
        try {
          return nodesToSections(editorRef.current.query.serialize());
        } catch {
          return [];
        }
      },
      getStructureData: () => {
        try {
          return editorRef.current.query.serialize();
        } catch {
          return null;
        }
      },
      resetToDefault: () => {
        const { state, actions } = editorRef.current;
        if (state.layoutType === 'event') {
          const _event = state.data as Event;
          const defaultSections: PageSection[] = [
            { id: 'event-hero', type: 'event_hero', order: 0, hidden: false, layout: { width: 'contained', padding: 'md' }, props: {}, craft_node_id: 'event-hero' },
            { id: 'datetime-block', type: 'event_datetime', order: 1, hidden: false, layout: { width: 'contained', padding: 'md' }, props: {}, craft_node_id: 'datetime-block' },
            { id: 'location-block', type: 'event_location_block', order: 2, hidden: false, layout: { width: 'contained', padding: 'md' }, props: {}, craft_node_id: 'location-block' },
            { id: 'about', type: 'event_about', order: 3, hidden: false, layout: { width: 'contained', padding: 'md' }, props: {}, craft_node_id: 'about' },
            { id: 'registration', type: 'event_registration', order: 4, hidden: false, layout: { width: 'contained', padding: 'md' }, props: {}, craft_node_id: 'registration' },
          ];
          const nodes = sectionsToNodes(defaultSections);
          console.log(JSON.stringify(nodes));
          actions.deserialize(JSON.stringify(nodes));
          // Satisfy exhaustive-deps — _event intentionally unused in default reset
        }
      },
    });
    return () => setAIPageEditTriggers(null);
  }, []);

  const isReady = state.layoutType === 'community' || ready;

  if (!isReady) return null;

  const mobilePaneContent = match(state.mobilePane)
    .with('chat', () =>
      state.layoutType === 'community' ? <AIChat compact {...communityChatProps} /> : <AIChat compact />,
    )
    .with('config', () => sidebarContent)
    .otherwise(() => null);
  const isChatPane = state.mobilePane === 'chat';
  const isConfigPane = state.mobilePane === 'config';
  const needsMobileBottomInset = state.activeTab === 'manage';
  const shouldPadMobileConfigPane = isConfigPane && state.activeTab !== 'design';
  const showsCommunityPreview = state.layoutType === 'community' && communityPreviewTabs.has(state.activeTab);

  const previewContent = match(state.layoutType)
    .with('event', () =>
      event ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- clicking empty canvas background to deselect nodes is a mouse-only affordance; keyboard users deselect via Escape handled elsewhere
        <main
          data-theme-scope="event-preview"
          data-theme={themeState.config.mode === 'auto' ? undefined : themeState.config.mode}
          className={clsx(
            'relative isolate flex flex-col w-full min-h-full bg-background rounded-none md:rounded-md overflow-hidden',
            themeState.theme,
            themeState.config.name,
            themeState.config.color,
            themeState.config.mode === 'light' && 'light',
            themeState.config.mode === 'dark' && 'dark',
          )}
          style={{ ...themeState.variables.font, position: 'relative' } as React.CSSProperties}
          onClick={(e) => {
            if (e.target === e.currentTarget) actions.selectNode(null);
          }}
        >
          <ThemeGenerator data={themeState} scoped scopeSelector="[data-theme-scope='event-preview']" />
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- background click to deselect node; non-interactive container */}
          <div
            className="relative z-10 w-full pt-1 flex flex-1"
            onClick={(e) => {
              if (e.target === e.currentTarget) actions.selectNode(null);
            }}
          >
            <EventGuestSide event={event} autoSave={false} isEditable={true} pageConfig={pageConfig} />
          </div>
        </main>
      ) : null,
    )
    .with('community', () =>
      community ? (
        <CommunityManagePreview space={community} themeData={themeState} />
      ) : null,
    )
    .otherwise(() => null);

  return (
    <>
      <AnimatePresence>
        {isSelected && state.activeTab !== 'manage' && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-2 left-2 w-[432px] z-[100] bg-overlay-primary shadow-2xl hidden md:block"
          >
            <SettingsPanel />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:flex px-0 flex-1 overflow-hidden pb-10">
        <AnimatePresence initial={false}>
          {state.showSidebarLeft && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 448, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden shrink-0 hidden md:block h-full"
            >
              <div data-mode={state.device} className={clsx('min-w-110 w-full h-full relative isolate pt-3')}>
                {sidebarContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={clsx(
            'bg-(--btn-tertiary) transition-all ease-in-out duration-500 w-full h-full rounded-none m-0 md:rounded-md md:m-1',
            state.device === 'mobile' && 'md:py-4',
          )}
        >
          <div
            data-mode={state.device}
            className={clsx(
              'w-full bg-background h-full rounded-none md:rounded-md overflow-auto transition-all ease-in-out mx-auto duration-500',
              state.device === 'mobile' && 'md:w-sm',
            )}
          >
            {state.layoutType === 'community'
              ? showsCommunityPreview
                ? !isMobile && previewContent
                : <ManageCommunityLayout>{children}</ManageCommunityLayout>
              : state.activeTab === 'manage'
                ? <ManageEventLayout shortid={shortid || ''} />
                : !isMobile && previewContent}
          </div>
        </div>
      </div>

      <div className="md:hidden flex-1 overflow-hidden relative isolate">
        <div
          className={clsx(
            'absolute inset-0 overflow-auto bg-background z-0',
            needsMobileBottomInset && 'pb-[calc(env(safe-area-inset-bottom)+5.5rem)]',
            state.mobilePane !== 'main' && 'pointer-events-none',
          )}
        >
          {state.layoutType === 'community'
            ? showsCommunityPreview
              ? isMobile && previewContent
              : <ManageCommunityLayout>{children}</ManageCommunityLayout>
            : state.activeTab === 'manage'
              ? <ManageEventLayout shortid={shortid || ''} />
              : isMobile && previewContent}
        </div>

        <AnimatePresence initial={false}>
          {state.mobilePane !== 'main' && (
            <motion.div
              key={`mobile-pane-${state.mobilePane}`}
              initial={{ x: isChatPane ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isChatPane ? '-100%' : '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={clsx(
                'absolute inset-0 overflow-auto bg-background z-40',
                shouldPadMobileConfigPane && 'p-4',
                state.mobilePane === 'chat' && 'px-4 pt-2 pb-3',
              )}
            >
              {mobilePaneContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default ManageLayoutContent;
