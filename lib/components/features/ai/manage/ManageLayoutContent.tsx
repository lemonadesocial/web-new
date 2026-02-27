'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoreManageLayout } from './store';
import { tabMappings } from './helpers';
import React from 'react';
import { useQuery } from '$lib/graphql/request';
import { AiConfigFieldsFragment, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { AIChatActionKind, useAIChat } from '../provider';
import { aiChatClient } from '$lib/graphql/request/instances';
import { mockWelcomeEvent } from '../InputChat';
import { match } from 'ts-pattern';
import ManageEventLayout from '../../event-manage/ManageEventLayout';
import { useParams } from 'next/navigation';

function ManageLayoutContent() {
  const params = useParams();
  console.log(params);

  const state = useStoreManageLayout();
  const [aiChatState, aiChatDispatch] = useAIChat();

  const SidebarComp = tabMappings[state.activeTab].component || null;

  // mock test ui
  const shortid = 'tCilMMJB';
  const event = { _id: '68ac4b998096a8611555fe11', shortid: 'tCilMMJB' };

  useQuery(
    GetListAiConfigDocument,
    {
      variables: { filter: { events_eq: event._id } },
      onComplete: (data) => {
        if (data?.configs?.items?.length) {
          const config = data.configs.items[0] as AiConfigFieldsFragment;
          aiChatDispatch({ type: AIChatActionKind.set_config, payload: { config: config._id } });
        }
      },
      skip: !event._id,
    },
    aiChatClient,
  );

  React.useEffect(() => {
    if (state.layoutType === 'event' && event.shortid === shortid) {
      aiChatDispatch({ type: AIChatActionKind.reset });
      aiChatDispatch({ type: AIChatActionKind.set_data_run, payload: { data: { event_id: event._id } } });
      aiChatDispatch({ type: AIChatActionKind.add_message, payload: { messages: mockWelcomeEvent(event) } });
    }
  }, [state]);

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
            <div className="w-[440px] h-full pl-4">
              <SidebarComp />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={clsx('bg-(--btn-tertiary) w-full h-full rounded-md m-1', state.device === 'mobile' && 'py-4')}>
        <div
          data-mode={state.device}
          className={clsx(
            'w-full bg-background h-full rounded-md overflow-auto',
            state.device === 'mobile' && 'max-w-sm mx-auto',
          )}
        >
          {match(state.layoutType)
            .with('event', ManageEventLayout)
            .otherwise(() => null)}
        </div>
      </div>
    </div>
  );
}

export default ManageLayoutContent;
