'use client';

import React from 'react';

import { useQuery } from '$lib/graphql/request';
import { AIChatActionKind, useAIChat } from '$lib/components/features/ai/provider';
import { mockWelcomeSpace } from '$lib/components/features/ai/InputChat';
import { AiConfigFieldsFragment, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { storeManageLayout as store } from '$lib/components/features/ai/manage/store';
import { CommunityManageLayout } from './CommunityManageLayout';

function ManageCommunityLayout({ children }: React.PropsWithChildren) {
  const [resolvedSpace, setResolvedSpace] = React.useState<Space | null>(null);
  const [_, aiChatDispatch] = useAIChat();
  const initializedChatSpaceRef = React.useRef<string | null>(null);
  const initializedConfigSpaceRef = React.useRef<string | null>(null);

  useQuery(
    GetListAiConfigDocument,
    {
      variables: { filter: { spaces_eq: resolvedSpace?._id } },
      onComplete: (data) => {
        if (!resolvedSpace?._id) return;

        initializedConfigSpaceRef.current = resolvedSpace._id;

        if (data?.configs?.items?.length) {
          const config = data.configs.items[0] as AiConfigFieldsFragment;
          aiChatDispatch({
            type: AIChatActionKind.set_config,
            payload: {
              config: config._id,
              messages: mockWelcomeSpace(resolvedSpace),
            },
          });
        }
      },
      skip: !resolvedSpace?._id || initializedConfigSpaceRef.current === resolvedSpace._id,
    },
    aiChatClient,
  );

  React.useEffect(() => {
    if (!resolvedSpace?._id) return;

    store.setData(resolvedSpace);

    if (initializedChatSpaceRef.current === resolvedSpace._id) {
      return;
    }

    aiChatDispatch({
      type: AIChatActionKind.reset,
      payload: {
        data: { space_id: resolvedSpace._id },
        standId: resolvedSpace._id,
        messages: mockWelcomeSpace(resolvedSpace),
      },
    });

    initializedChatSpaceRef.current = resolvedSpace._id;
    initializedConfigSpaceRef.current = null;
  }, [aiChatDispatch, resolvedSpace]);

  return (
    <CommunityManageLayout
      embedded
      onSpaceResolved={(space) =>
        setResolvedSpace((prev) =>
          prev?._id === space._id && prev.slug === space.slug && prev.title === space.title ? prev : space,
        )
      }
    >
      {children}
    </CommunityManageLayout>
  );
}

export default ManageCommunityLayout;
