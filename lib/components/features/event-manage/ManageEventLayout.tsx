'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useRef } from 'react';
import { isMobile } from 'react-device-detect';

import { Event, PublishEventDocument } from '$lib/graphql/generated/backend/graphql';
import { Button, toast, Skeleton } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useUpdateEvent } from '$lib/components/features/event-manage/store';
import { EventProtected } from '$lib/components/features/event-manage/EventProtected';
import { aiChat } from '$lib/components/features/ai/AIChatContainer';
import { AIChatActionKind, useAIChat } from '$lib/components/features/ai/provider';
import { mockWelcomeEvent } from '$lib/components/features/ai/InputChat';
import { EventBlasts } from '$lib/components/features/event-manage/EventBlasts';
import { EventGuests } from '$lib/components/features/event-manage/EventGuests';
import { EventInsights } from '$lib/components/features/event-manage/EventInsights';
import { EventMore } from '$lib/components/features/event-manage/EventMore';
import { EventOverview } from '$lib/components/features/event-manage/overview/EventOverview';
import { EventRegistration } from '$lib/components/features/event-manage/EventRegistration';
import { AiConfigFieldsFragment, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { ManageEventPaymentLayout } from './ManageEventPaymentLayout';

const tabs: Record<string, { label: string; component: React.FC }> = {
  overview: { label: 'Overview', component: EventOverview },
  guests: { label: 'Guests', component: EventGuests },
  registration: { label: 'Registration', component: EventRegistration },
  payments: { label: 'Payments', component: ManageEventPaymentLayout },
  blasts: { label: 'Blasts', component: EventBlasts },
  insights: { label: 'Insights', component: EventInsights },
  more: { label: 'More', component: EventMore },
};

/**
 * @description ManageEventLayout is using for wrap new AI chat UI. Keep everything same as EventManageLayout but use state instead of page
 */
function ManageEventLayout() {
  const params = useParams<{ shortid: string }>();
  const shortid = params.shortid;

  const loadingFallback = (
    <div className="font-default p-4">
      <div className="sticky top-0 backdrop-blur-md transition-all duration-300 z-1 pt-7">
        <div className="page mx-auto px-4 md:px-0">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <nav className="flex gap-4 pt-1 overflow-auto no-scrollbar">
            {Object.keys(tabs).map((key) => (
              <Skeleton key={key} className="h-6 w-20" />
            ))}
          </nav>
        </div>
      </div>
      <div className="page mx-auto py-7 px-4 md:px-0">
        <div className="space-y-6">
          <div className="flex gap-2 overflow-auto no-scrollbar">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-32 rounded-md" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-md" />
            <Skeleton className="h-80 rounded-md" />
          </div>

          <Skeleton className="h-32 rounded-md" />
        </div>
      </div>
    </div>
  );

  return (
    <EventProtected shortid={shortid} loadingFallback={loadingFallback}>
      {(event) => <Content event={event} shortid={shortid} />}
    </EventProtected>
  );
}

function Content({ event, shortid }: { event: Event; shortid: string }) {
  const router = useRouter();
  const updateEvent = useUpdateEvent();

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [aiChatState, aiChatDispatch] = useAIChat();
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

  const [selectedTab, setSelectedTab] = React.useState('overview');

  const [publishEvent, { loading: publishing }] = useMutation(PublishEventDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent?.published) {
        toast.success('Event published successfully!');
        updateEvent({ published: true });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to publish event');
    },
  });

  const handlePublish = () => {
    if (!event?._id) return;

    publishEvent({
      variables: {
        event: event._id,
      },
    });
  };

  React.useEffect(() => {
    if (event.shortid === shortid) {
      aiChatDispatch({ type: AIChatActionKind.reset });
      aiChatDispatch({ type: AIChatActionKind.set_data_run, payload: { data: { event_id: event._id } } });
      aiChatDispatch({ type: AIChatActionKind.add_message, payload: { messages: mockWelcomeEvent(event) } });
    }
  }, []);

  const Comp = tabs[selectedTab].component;

  return (
    <div className="relative h-full overflow-auto">
      <div ref={sentinelRef} />
      <div className="sticky top-8 md:top-0 border-b z-1 px-4">
        <div className="backdrop-blur-md transition-all duration-300 pt-2 font-default">
          <div className="page mx-auto px-4 md:px-0">
            <nav className="flex gap-4 pt-1 overflow-auto no-scrollbar">
              {Object.entries(tabs).map(([key, item]) => {
                return (
                  <div
                    key={key}
                    className={clsx('cursor-pointer', key === selectedTab && 'border-b-2 border-b-primary', 'pb-2.5')}
                    onClick={() => setSelectedTab(key)}
                  >
                    <span className={clsx(key === selectedTab ? 'text-primary' : 'text-tertiary', 'font-medium')}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="pt-5 md:pt-0">
        <Comp />
      </div>
    </div>
  );
}

export default ManageEventLayout;
