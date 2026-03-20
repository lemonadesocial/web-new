'use client';
import React from 'react';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { useAIChat, AIChatActionKind } from '$lib/components/features/ai/provider';
import { AIChat } from '$lib/components/features/ai/AIChat';

export default function Content({ space }: { space: Space }) {
  const [_, dispatch] = useAIChat();

  React.useEffect(() => {
    if (space?._id) {
      dispatch({ type: AIChatActionKind.set_data_run, payload: { standId: space._id } });
    }
  }, [space?._id, dispatch]);

  return (
    <div className="md:w-[720px] w-full h-full mx-auto">
      <AIChat hideHeader showTools={false} readonly={true} />
    </div>
  );
}
