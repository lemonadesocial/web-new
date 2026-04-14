'use client';
import React from 'react';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { match } from 'ts-pattern';

import { useQuery } from '$lib/graphql/request';
import { AiConfigFieldsFragment, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
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
import { useEventTheme } from '$lib/components/features/theme-builder/provider';

import { mockWelcomeEvent } from '../InputChat';
import { AIChat } from '../AIChat';
import { DesignTool } from './DesignTool';
import ManageEventLayout from '../../event-manage/ManageEventLayout';
import ManageCommunityLayout from '../../community-manage/ManageCommunityLayout';
import CommunityManageDesignPane from '../../community-manage/CommunityManageDesignPane';
import CommunityManagePreview from '../../community-manage/CommunityManagePreview';

import { storeManageLayout as store, useStoreManageLayout } from './store';
import { useEditor } from '@craftjs/core';
import { setAIPageEditTriggers } from '$lib/components/features/page-builder/hooks/ai-page-edit-bridge';
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
  const [themeState] = useEventTheme();
  const [_, aiChatDispatch] = useAIChat();
  const initializedConfigEventRef = React.useRef<string | null>(null);

  const { isSelected, actions, query } = useEditor((state) => ({
    isSelected: state.events.selected.size > 0,
  }));

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
    if (pageConfig) {
      aiChatDispatch({
        type: AIChatActionKind.set_page_config,
        payload: { pageConfig },
      });
    }
  }, [pageConfig, aiChatDispatch]);

  React.useEffect(() => {
    if (pageConfigData_?.structure_data) {
      try {
        const data = typeof pageConfigData_.structure_data === 'string'
          ? pageConfigData_.structure_data
          : JSON.stringify(pageConfigData_.structure_data);
        actions.deserialize(data);
      } catch (e) {
        console.error('Failed to parse pageConfig structure_data', e);
      }
    }
  }, [pageConfigData_, actions]);

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

  const sidebarContent = match([state.layoutType, state.activeTab] as const)
    .with(['event', 'manage'], () => (
      <div className="h-full px-4">
        <AIChat compact />
      </div>
    ))
    .with(['community', 'manage'], () => (
      <div className="h-full px-4">
        <AIChat compact />
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
        <AIChat compact />
      </div>
    ))
    .otherwise(() => null);

  const editorRef = React.useRef({ actions, query });
  editorRef.current = { actions, query };

  React.useEffect(() => {
    setAIPageEditTriggers({
      applyStructureData: (data: string) => {
        editorRef.current.actions.deserialize(data);
      },
      getStructureData: () => {
        try {
          return editorRef.current.query.serialize();
        } catch {
          return null;
        }
      },
    });
    return () => setAIPageEditTriggers(null);
  }, []);

  const isReady = state.layoutType === 'community' || ready;

  if (!isReady) return null;

  const mobilePaneContent = match(state.mobilePane)
    .with('chat', () => <AIChat compact />)
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
        <main
          data-theme-scope="event-preview"
          className={clsx(
            'relative isolate flex flex-col w-full h-full',
            themeState.theme,
            themeState.config.name,
            themeState.config.color,
            themeState.config.mode,
          )}
          style={themeState.variables.font as React.CSSProperties}
          onClick={(e) => {
            if (e.target === e.currentTarget) actions.selectNode(undefined);
          }}
        >
          <ThemeGenerator data={themeState} scoped scopeSelector="[data-theme-scope='event-preview']" />
          <div
            className="page relative z-10 mx-auto px-4 xl:px-0 pt-10 pb-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) actions.selectNode(undefined);
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
