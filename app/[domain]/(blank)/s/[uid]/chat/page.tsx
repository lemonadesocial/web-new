'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import { useQuery } from '$lib/graphql/request';
import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { isObjectId } from '$lib/utils/helpers';
import { useAIChat, AIChatActionKind } from '$lib/components/features/ai/provider';
import { AIChat } from '$lib/components/features/ai/AIChat';

export default function ChatPage() {
  const params = useParams();
  const uid = params.uid as string;
  const [_, dispatch] = useAIChat();

  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const { data: spaceData } = useQuery(GetSpaceDocument, { variables });
  const space = spaceData?.getSpace as Space;

  React.useEffect(() => {
    if (space?._id) {
      dispatch({ type: AIChatActionKind.set_data_run, payload: { standId: space._id } });
    }
  }, [space?._id, dispatch]);

  if (!space) return null;

  return <AIChat hideHeader showTools={false} readonly={true} />;
}
