'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { isMobile } from 'react-device-detect';

import { Event } from '$lib/graphql/generated/backend/graphql';
import { EventProtected } from '$lib/components/features/event-manage/EventProtected';
import { AIChatActionKind, useAIChat } from '$lib/components/features/ai/provider';
import { aiChat } from '$lib/components/features/ai/AIChatContainer';
import { AiConfigFieldsFragment, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { useQuery } from '$lib/graphql/request';

import { PageBuilderEditor } from '$lib/components/features/page-builder/Editor';
import { EditorSkeleton } from '$lib/components/features/page-builder/EditorSkeleton';
import { useStubPageConfig } from '$lib/components/features/page-builder/utils';

/**
 * Event Page Builder Route
 *
 * URL: /agent/e/{shortid}/edit
 *
 * Follows the same access-control pattern as the event manage page:
 * wraps in EventProtected to verify ownership, then hydrates AI chat
 * context and renders the page builder editor.
 */
export default function Page() {
  const params = useParams<{ shortid: string }>();
  const shortid = params.shortid;

  const loadingFallback = <EditorSkeleton />;

  return (
    <EventProtected shortid={shortid} loadingFallback={loadingFallback}>
      {(event) => <EventEditorContent event={event} shortid={shortid} />}
    </EventProtected>
  );
}

// ── Content ──

function EventEditorContent({ event, shortid }: { event: Event; shortid: string }) {
  const [aiChatState, aiChatDispatch] = useAIChat();

  // Fetch AI config for this event (same pattern as manage page)
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

  // Hydrate AI chat context on mount
  React.useEffect(() => {
    aiChatDispatch({ type: AIChatActionKind.reset });
    aiChatDispatch({
      type: AIChatActionKind.set_data_run,
      payload: { data: { event_id: event._id } },
    });
    aiChatDispatch({
      type: AIChatActionKind.add_message,
      payload: {
        messages: [
          {
            message: `Welcome to the Page Builder for "${event.title}". I can help you design your event page — just describe what you'd like!`,
            sourceDocuments: [],
            role: 'assistant',
          },
        ],
      },
    });

    // Auto-open AI chat on desktop
    if (!isMobile) {
      aiChat.open();
    }
  }, []);

  // TODO: Fetch actual PageConfig for this event from the backend.
  // For now, create a stub config so the editor shell renders.
  const stubConfig = useStubPageConfig(event._id, 'event');

  return (
    <div className="relative h-dvh overflow-hidden flex flex-col">
      <PageBuilderEditor
        config={stubConfig}
        ownerType="event"
        ownerId={event._id}
        entityName={event.title || 'Untitled Event'}
        backHref={`/agent/e/manage/${shortid}`}
      />

      {/* Floating AI chat button for mobile (same pattern as manage page) */}
      {!aiChatState.toggleChat && (
        <button
          className="fixed bottom-4 right-4 w-14 h-14 aspect-square flex items-center justify-center rounded-full bg-gradient-to-r from-(--btn-tertiary) via-[rgba(255,255,255,0.08)] via-(--color-page-background-overlay) to-(--btn-tertiary) border cursor-pointer group backdrop-blur-sm z-30"
          onClick={() => aiChat.open()}
        >
          <i className="icon-lemon-ai text-warning-300 w-8 h-8 aspect-square hover:scale-110 transition-all ease-in-out duration-300" />
        </button>
      )}
    </div>
  );
}

