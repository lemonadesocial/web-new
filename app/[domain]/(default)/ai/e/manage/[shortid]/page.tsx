'use client';
import React from 'react';
import NextLink from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useRef } from 'react';

import { PublishEventDocument } from '$lib/graphql/generated/backend/graphql';
import { Button, toast, Skeleton } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';
import { useEvent, useUpdateEvent } from '$lib/components/features/event-manage/store';
import { EventProtected } from '$lib/components/features/event-manage/EventProtected';
import { aiChat } from '$lib/components/features/ai/AIChatContainer';
import { AIChatActionKind, useAIChat } from '$lib/components/features/ai/provider';
import { mockWelcomeEvent } from '$lib/components/features/ai/InputChat';

const eventManageMenu = [
  { name: 'Overview', page: 'overview' },
  { name: 'Guests', page: 'guests' },
  { name: 'Registration', page: 'registration' },
  { name: 'Payments', page: 'payments' },
  { name: 'Blasts', page: 'blasts' },
  // { name: 'Program', page: 'program' },
  { name: 'Insights', page: 'insights' },
  { name: 'More', page: 'more' },
];

export default function Page() {
  const pathname = usePathname();
  const params = useParams<{ shortid: string }>();
  const shortid = params.shortid;
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [aiChatState, aiChatDispatch] = useAIChat();

  const router = useRouter();
  const event = useEvent();
  const updateEvent = useUpdateEvent();

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
    if (event) {
      aiChatDispatch({ type: AIChatActionKind.reset });
      aiChatDispatch({ type: AIChatActionKind.add_message, payload: { messages: mockWelcomeEvent(event) } });
      aiChat.open();
    }
  }, [event]);

  const loadingFallback = (
    <div className="font-default">
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
            {eventManageMenu.map((item) => (
              <Skeleton key={item.page} className="h-6 w-20" />
            ))}
          </nav>
        </div>
      </div>
      <div className="page mx-auto py-7 px-4 md:px-0">
        <div className="space-y-6">
          <div className="flex gap-2 overflow-auto no-scrollbar">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-32 rounded-md" />
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
      {(event) => (
        <div className="relative h-full">
          <div ref={sentinelRef} />
          <div className={clsx('sticky top-0 backdrop-blur-md transition-all duration-300 z-1 pt-7 font-default')}>
            <div className="page mx-auto px-4 md:px-0">
              {event.space_expanded && (
                <div
                  className="text-sm text-tertiary flex items-center gap-0.5 group cursor-pointer"
                  onClick={() => router.push(`/s/manage/${event.space_expanded?.slug || event.space}`)}
                >
                  <p className="group-hover:text-primary">{event.space_expanded?.title}</p>
                  <i className="icon-chevron-right size-4.5 text-quaternary transition group-hover:translate-x-0.5" />
                </div>
              )}
              <div className="flex justify-between items-center">
                <h1 className={clsx('font-semibold transition-all duration-300 text-2xl')}>{event.title}</h1>
                <div className="flex gap-2">
                  {event.published ? (
                    <Button
                      variant="tertiary-alt"
                      className="hidden md:block hover:bg-(--btn-tertiary)! hover:text-tertiary! cursor-default!"
                      size="sm"
                    >
                      Published
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handlePublish}
                      loading={publishing}
                      className="hidden md:block"
                    >
                      Publish
                    </Button>
                  )}
                  <Button
                    iconRight="icon-arrow-outward"
                    variant="tertiary-alt"
                    size="sm"
                    className="hidden md:block"
                    onClick={() => window.open(`/e/${shortid}`, '_blank')}
                  >
                    Event Page
                  </Button>
                  <Button
                    icon="icon-arrow-outward"
                    className="md:hidden"
                    variant="tertiary-alt"
                    size="sm"
                    onClick={() => window.open(`/e/${shortid}`, '_blank')}
                  ></Button>
                </div>
              </div>
              <nav className="flex gap-4 pt-1 overflow-auto no-scrollbar">
                {eventManageMenu.map((item) => {
                  const url = `/e/manage/${shortid}/${item.page}`;
                  const isActive =
                    item.page === 'overview'
                      ? pathname === `/e/manage/${shortid}` || pathname === url
                      : pathname === url;

                  return (
                    <NextLink
                      href={url}
                      key={item.page}
                      className={clsx(isActive && 'border-b-2 border-b-primary', 'pb-2.5')}
                    >
                      <span className={clsx(isActive ? 'text-primary' : 'text-tertiary', 'font-medium')}>
                        {item.name}
                      </span>
                    </NextLink>
                  );
                })}
              </nav>
            </div>
            <hr className="w-screen -mx-[50vw] ml-[calc(-50vw+50%)] border-t border-t-divider" />
          </div>
          Content go here
          {!aiChatState.toggleChat && (
            <button
              className="absolute bottom-10 left-10 w-14 h-14 aspect-square flex items-center justify-center rounded-full bg-gradient-to-r from-(--btn-tertiary) via-[rgba(255,255,255,0.08)] via-(--color-page-background-overlay) to-(--btn-tertiary) border cursor-pointer group"
              onClick={() => aiChat.open()}
            >
              <i className="icon-lemon-ai text-warning-300 w-8 h-8 aspect-square hover:scale-110  transition-all ease-in-out duration-300" />
            </button>
          )}
        </div>
      )}
    </EventProtected>
  );
}
