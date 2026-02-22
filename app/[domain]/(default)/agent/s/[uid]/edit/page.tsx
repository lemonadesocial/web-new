'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { isMobile } from 'react-device-detect';

import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { Button } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { isObjectId } from '$lib/utils/helpers';
import { AIChatActionKind, useAIChat } from '$lib/components/features/ai/provider';
import { aiChat } from '$lib/components/features/ai/AIChatContainer';
import { AiConfigFieldsFragment, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';

import { PageBuilderEditor } from '$lib/components/features/page-builder/Editor';
import { EditorSkeleton } from '$lib/components/features/page-builder/EditorSkeleton';
import { usePageConfig } from '$lib/components/features/page-builder/utils';

/**
 * Space Page Builder Route
 *
 * URL: /agent/s/{uid}/edit
 *
 * Follows the same access-control pattern as the space manage page:
 * fetches the space, verifies admin access, hydrates AI chat context,
 * and renders the page builder editor.
 */
export default function Page() {
  const me = useMe();
  const { uid } = useParams<{ uid: string }>();

  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data, loading } = useQuery(GetSpaceDocument, { variables });

  if (loading) {
    return <EditorSkeleton />;
  }

  if (!data?.getSpace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh text-center space-y-6 px-4">
        <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
          <i className="icon-alert-outline size-8 text-warning-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Community Not Found</h1>
          <p className="text-secondary">The community you are looking for does not exist or has been removed.</p>
        </div>
        <Button variant="tertiary" onClick={() => (window.location.href = '/')} iconLeft="icon-home">
          Go Home
        </Button>
      </div>
    );
  }

  const space = data.getSpace as Space;
  const spaceAdmins = space.admins?.map((u) => u._id) || [];
  const canManage = me?._id && [space.creator, ...spaceAdmins].includes(me._id);

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh text-center space-y-6 px-4">
        <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
          <i className="icon-lock size-8 text-warning-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">No Access</h1>
          <p className="text-secondary">You do not have access to edit this community page.</p>
        </div>
        <Button
          variant="tertiary"
          onClick={() => (window.location.href = `/s/${space.slug || space._id}`)}
          iconRight="icon-chevron-right"
        >
          Community Page
        </Button>
      </div>
    );
  }

  return <SpaceEditorContent space={space} uid={uid} />;
}

// ── Content ──

function SpaceEditorContent({ space, uid }: { space: Space; uid: string }) {
  const [aiChatState, aiChatDispatch] = useAIChat();

  // Fetch AI config for this space (same pattern as manage page)
  useQuery(
    GetListAiConfigDocument,
    {
      variables: { filter: { spaces_eq: space._id } },
      onComplete: (data) => {
        if (data?.configs?.items?.length) {
          const config = data.configs.items[0] as AiConfigFieldsFragment;
          aiChatDispatch({ type: AIChatActionKind.set_config, payload: { config: config._id } });
        }
      },
      skip: !space._id,
    },
    aiChatClient,
  );

  // Hydrate AI chat context on mount
  React.useEffect(() => {
    aiChatDispatch({ type: AIChatActionKind.reset });
    aiChatDispatch({
      type: AIChatActionKind.set_data_run,
      payload: { data: { space_id: space._id } },
    });
    aiChatDispatch({
      type: AIChatActionKind.add_message,
      payload: {
        messages: [
          {
            message: `Welcome to the Page Builder for "${space.title}". I can help you design your community page — just describe what you'd like!`,
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

  const { config, loading: configLoading, error: configError } = usePageConfig(space._id, 'space');

  if (configLoading) return <EditorSkeleton />;

  if (configError || !config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh text-center space-y-4 px-4">
        <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
          <i className="icon-alert-outline size-8 text-warning-500" />
        </div>
        <h1 className="text-2xl font-semibold">Unable to load editor</h1>
        <p className="text-secondary">Could not load or create a page configuration. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="relative h-dvh overflow-hidden flex flex-col">
      <PageBuilderEditor
        config={config}
        ownerType="space"
        ownerId={space._id}
        entityName={space.title || 'Untitled Community'}
        backHref={`/agent/s/manage/${uid}`}
      />

      {/* Floating AI chat button for mobile */}
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

