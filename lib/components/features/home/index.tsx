'use client';
import React from 'react';
import clsx from 'clsx';

import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { AIChat } from '$lib/components/features/ai/AIChat';
import { useAIChat } from '$lib/components/features/ai/provider';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { NonLoginContent } from './NonLoginContent';
import { HomeEventsSection } from './HomeEventsSection';

export function Home() {
  const me = useMe();
  const signIn = useSignIn();
  const [aiState] = useAIChat();
  const loggedIn = !!me;
  const chatExpanded = loggedIn && (aiState.messages.length || aiState.thinking);
  const rootClassName = clsx(
    'min-h-full w-full bg-overlay-primary flex flex-col items-center',
    !chatExpanded && 'pb-10 relative overflow-x-clip',
  );

  return (
    <div className={rootClassName}>
      {!chatExpanded && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute left-1/2 aspect-[2160/1432] -translate-x-1/2 -translate-y-1/2"
            style={{
              top: 'calc((100vh - 100px) / 2 + 464px)',
              width: 'max(2160px, 150vw)',
            }}
          >
            <img
              src={`${ASSET_PREFIX}/assets/images/home-ai-chat-bg.jpg`}
              alt=""
              className="absolute inset-0 size-full object-cover object-center"
            />
          </div>
        </div>
      )}

      {chatExpanded ? (
        <div className="relative z-10 w-full max-w-[720px] h-screen px-4 md:px-0">
          <AIChat variant="home" />
        </div>
      ) : (
        <div className="relative z-10 w-full min-h-[calc(100vh-100px)] shrink-0 flex justify-center">
          <div className="w-full max-w-[720px] px-4 md:px-0 flex flex-col justify-center relative">
            <AIChat variant="home" allowGuest={!loggedIn} />
            {!loggedIn && (
              <button
                type="button"
                onClick={() => signIn()}
                className="absolute inset-0 z-20 rounded-[16px] bg-transparent cursor-pointer"
                aria-label="Sign in to use LemonAI chat"
              />
            )}
          </div>
        </div>
      )}
      {!chatExpanded && (
        <div className="relative z-10 w-full px-4 md:px-6 xl:px-8">
          {loggedIn ? <HomeEventsSection /> : <NonLoginContent />}
        </div>
      )}
    </div>
  );
}
