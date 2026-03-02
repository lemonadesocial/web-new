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
import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { EventGuestSide } from '$lib/components/features/event/EventGuestSide';

import { mockWelcomeEvent } from '../InputChat';
import ManageEventLayout from '../../event-manage/ManageEventLayout';

import { tabMappings } from './helpers';
import { storeManageLayout as store, useStoreManageLayout } from './store';

function ManageLayoutContent() {
  const params = useParams();
  const shortid = params?.shortid as string;

  const [ready, setReady] = React.useState(false);

  const state = useStoreManageLayout();
  const [_, aiChatDispatch] = useAIChat();

  const SidebarComp = tabMappings[state.activeTab].component || null;
  const isDesignOrPreview = state.activeTab === 'design' || state.activeTab === 'preview';

  const { data: dataGetEvent } = useQuery(GetEventDocument, {
    variables: { shortid },
    skip: !shortid && state.layoutType !== 'event',
  });
  const event = dataGetEvent?.getEvent as Event;

  useQuery(
    GetListAiConfigDocument,
    {
      variables: { filter: { events_eq: event?._id } },
      onComplete: (data) => {
        if (data?.configs?.items?.length) {
          const config = data.configs.items[0] as AiConfigFieldsFragment;
          aiChatDispatch({ type: AIChatActionKind.set_config, payload: { config: config._id } });
        }
      },
      skip: !event?._id,
    },
    aiChatClient,
  );

  React.useEffect(() => {
    if (state.layoutType === 'event' && event?.shortid === shortid && !ready) {
      aiChatDispatch({ type: AIChatActionKind.reset });
      aiChatDispatch({ type: AIChatActionKind.set_data_run, payload: { data: { event_id: event._id } } });
      aiChatDispatch({ type: AIChatActionKind.add_message, payload: { messages: mockWelcomeEvent(event) } });
      store.setData(event);

      if (!ready) setReady(true);
    }
  }, [state.layoutType, event, ready]);

  if (!ready) return null;

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
            <EventThemeProvider themeData={event.theme_data}>
              <main className="relative flex flex-col w-full mt-7 md:mt-11">
                <div className="page mx-auto px-4 xl:px-0">
                  <EventGuestSide event={event} />
                </div>
              </main>
            </EventThemeProvider>
          ) : null,
        )
        .otherwise(() => null),
    );

  return (
    <div className="flex px-1 flex-1 overflow-hidden">
      <AnimatePresence initial={false}>
        {state.showSidebarLeft && (
          <motion.div
            initial={{ width: 0, opacity: 0, marginRight: 0 }}
            animate={{ width: 440, opacity: 1, marginRight: 16 }}
            exit={{ width: 0, opacity: 0, marginRight: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden shrink-0"
          >
            <div data-mode={isDesignOrPreview ? state.device : undefined} className="w-[440px] h-full pl-4">
              <SidebarComp />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={clsx(
          'bg-(--btn-tertiary) transition-all ease-in-out duration-500 w-full h-full rounded-md m-1',
          state.device === 'mobile' && 'py-4',
        )}
      >
        <div
          data-mode={isDesignOrPreview ? state.device : undefined}
          className={clsx(
            'w-full bg-background h-full rounded-md overflow-auto transition-all ease-in-out mx-auto duration-500',
            state.device === 'mobile' && 'w-sm',
          )}
        >
          {mainContent}
        </div>
      </div>
    </div>
  );
}

export default ManageLayoutContent;
