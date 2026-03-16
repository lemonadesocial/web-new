'use client';
import React from 'react';
import clsx from 'clsx';

import { useMe } from '$lib/hooks/useMe';
import { AIChat } from '$lib/components/features/ai/AIChat';
import { useAIChat } from '$lib/components/features/ai/provider';
import { NonLoginContent } from './NonLoginContent';
import { HomeEventsSection } from './HomeEventsSection';

export function Home() {
  const me = useMe();
  const [aiState] = useAIChat();

  if (!me) {
    return (
      <div className="w-full h-full flex max-sm:px-4 max-sm:pt-44 items-center justify-center max-w-[1200px] mx-auto">
        <NonLoginContent />
      </div>
    );
  }

  const chatExpanded = aiState.messages.length || aiState.thinking;
  const rootClassName = clsx(
    'min-h-full w-full bg-overlay-primary flex flex-col items-center',
    !chatExpanded && 'pb-10',
  );

  return (
    <div className={rootClassName}>
      <div
        className={
          chatExpanded
            ? 'w-full max-w-[720px] h-screen px-4 md:px-0'
            : 'w-full max-w-[720px] min-h-[calc(100vh-100px)] px-4 md:px-0 shrink-0 flex flex-col justify-center'
        }
      >
        <AIChat />
      </div>
      {
        !chatExpanded && <HomeEventsSection />
      }
    </div>
  );
}
