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
import { Event, GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { EventGuestSide } from '$lib/components/features/event/EventGuestSide';
import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';

import { mockWelcomeEvent } from '../InputChat';
import { AIChat } from '../AIChat';
import ManageEventLayout from '../../event-manage/ManageEventLayout';

import { tabMappings } from './helpers';
import { storeManageLayout as store, useStoreManageLayout } from './store';
import { pad } from 'lodash';

function ManageLayoutContent() {
  const params = useParams();
  const shortid = params?.shortid as string;

  const [ready, setReady] = React.useState(false);

  const state = useStoreManageLayout();
  const [themeState] = useEventTheme();
  const [_, aiChatDispatch] = useAIChat();
  const initializedConfigEventRef = React.useRef<string | null>(null);

  const SidebarComp = tabMappings[state.activeTab].component || null;
  const isDesignOrPreview = state.activeTab === 'design' || state.activeTab === 'preview';
  const cachedEvent = state.data as Event | undefined;
  const shouldFetchEvent = state.layoutType === 'event' && !!shortid && cachedEvent?.shortid !== shortid;

  const { data: dataGetEvent } = useQuery(GetEventDocument, {
    variables: { shortid },
    skip: !shouldFetchEvent,
  });
  const event =
    (dataGetEvent?.getEvent as Event | undefined) || (cachedEvent?.shortid === shortid ? cachedEvent : undefined);
  const eventId = event?._id;

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
          aiChatDispatch({ type: AIChatActionKind.set_config, payload: { config: config._id } });
        }
      },
      skip: !eventId || initializedConfigEventRef.current === eventId,
    },
    aiChatClient,
  );

  React.useEffect(() => {
    if (state.layoutType === 'event' && event?.shortid === shortid && !ready) {
      aiChatDispatch({ type: AIChatActionKind.reset });
      aiChatDispatch({
        type: AIChatActionKind.set_data_run,
        payload: { data: { event_id: event._id, space_id: event.space }, standId: event.space },
      });
      aiChatDispatch({ type: AIChatActionKind.add_message, payload: { messages: mockWelcomeEvent(event) } });
      store.setData(event);

      if (!ready) setReady(true);
    }
  }, [state.layoutType, event, ready, shortid, aiChatDispatch]);

  if (!ready) return null;

  const mobilePaneContent = match(state.mobilePane)
    .with('chat', () => <AIChat />)
    .with('config', () => <SidebarComp />)
    .otherwise(() => null);
  const isChatPane = state.mobilePane === 'chat';
  const isConfigPane = state.mobilePane === 'config';
  const needsMobileBottomInset = state.activeTab === 'manage';

  const mainContent = match(state.activeTab)
    .with('manage', () =>
      match(state.layoutType)
        .with('event', () => <ManageEventLayout shortid={shortid} />)
        .otherwise(() => null),
    )
    .otherwise(() =>
      match(state.layoutType)
        .with('event', () =>
          event ? (
            <main
              data-theme-scope="event-preview"
              className={clsx(
                'relative isolate overflow-hidden flex flex-col w-full h-full pt-2 md:px-4',
                themeState.theme !== 'default' && [themeState.config.color, themeState.config.mode],
              )}
            >
              <ThemeGenerator data={themeState} scoped scopeSelector="[data-theme-scope='event-preview']" />
              <div className="page relative z-10 mx-auto px-4 xl:px-0 overflow-auto">
                <EventGuestSide event={event} autoSave={false} />
              </div>
            </main>
          ) : null,
        )
        .otherwise(() => null),
    );

  return (
    <>
      <div className="hidden md:flex px-0 md:p-1 flex-1 overflow-hidden pb-10">
        <AnimatePresence initial={false}>
          {state.showSidebarLeft && (
            <motion.div
              initial={{ width: 0, opacity: 0, marginRight: 0 }}
              animate={{ width: 440, opacity: 1, marginRight: 16 }}
              exit={{ width: 0, opacity: 0, marginRight: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden shrink-0 hidden md:block"
            >
              <div
                data-mode={isDesignOrPreview ? state.device : undefined}
                className={clsx('w-110 h-full pl-4', isDesignOrPreview && 'pt-3')}
              >
                <SidebarComp />
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
            data-mode={isDesignOrPreview ? state.device : undefined}
            className={clsx(
              'w-full bg-background h-full rounded-none md:rounded-md overflow-auto transition-all ease-in-out mx-auto duration-500',
              state.device === 'mobile' && 'md:w-sm',
            )}
          >
            {mainContent}
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
          {mainContent}
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
                isConfigPane && 'p-4',
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
