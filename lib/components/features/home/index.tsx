'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';

import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { AIChatActionKind, useAIChat } from '$lib/components/features/ai/provider';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { NonLoginContent } from './NonLoginContent';
import { HomeEventsSection } from './HomeEventsSection';

const LazyHomeAIChat = dynamic(
  () => import('$lib/components/features/ai/AIChat').then((mod) => mod.AIChat),
  {
    ssr: false,
    loading: () => <HomeAIChatLoading />,
  },
);

export function Home() {
  const me = useMe();
  const signIn = useSignIn();
  const [aiState, aiDispatch] = useAIChat();
  const [hydrated, setHydrated] = React.useState(false);
  const loggedIn = hydrated && !!me;
  const chatExpanded = loggedIn && (aiState.messages.length || aiState.thinking);
  const rootClassName = clsx(
    'min-h-full w-full bg-overlay-primary flex flex-col items-center',
    !chatExpanded && 'pb-10 relative overflow-x-clip',
  );

  React.useEffect(() => {
    aiDispatch({ type: AIChatActionKind.reset });
  }, [aiDispatch]);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

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
        <div className="relative z-10 w-full max-w-180 h-screen px-4 md:px-0">
          <LazyHomeAIChat variant="home" />
        </div>
      ) : (
        <div className="relative z-10 w-full min-h-[calc(100vh-100px)] shrink-0 flex justify-center">
          <div className="w-full max-w-180 px-4 md:px-0 flex flex-col justify-center relative">
            {loggedIn ? (
              <LazyHomeAIChat variant="home" />
            ) : (
              <HomeGuestChatPrompt onClick={() => signIn()} />
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

function HomeAIChatLoading() {
  return (
    <div className="relative isolate flex h-full flex-col justify-center py-8 md:py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="space-y-3">
          <div className="h-9 w-52 rounded-sm bg-primary/8" />
          <div className="h-6 w-full max-w-106 rounded-sm bg-primary/8" />
        </div>
        <div className="h-30 rounded-lg border border-white bg-[rgba(20,19,23,0.64)] backdrop-blur" />
      </div>
    </div>
  );
}

function HomeGuestChatPrompt({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative isolate flex h-full w-full flex-col justify-center py-8 text-left md:py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="space-y-2">
          <h3 className="font-title text-[32px] leading-10 font-semibold">Where great events begin.</h3>
          <p className="text-base leading-6 text-tertiary">
            Create event pages, sell tickets, and build your community, just by chatting.
          </p>
        </div>
        <div className="space-y-4">
          <div className="overflow-visible rounded-lg border border-white bg-[rgba(20,19,23,0.64)] backdrop-blur transition hover:bg-[rgba(30,29,34,0.72)]">
            <div className="flex flex-col space-y-2 p-4">
              <div className="relative min-h-6 w-full overflow-hidden text-base leading-6 text-quaternary">
                <span className="font-medium">
                  Ask LemonAI to <span>create an event</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="inline-flex h-8 items-center justify-center rounded-sm bg-(--btn-tertiary) p-2 text-tertiary">
                    <i aria-hidden className="icon-discover-tune size-4" />
                  </span>
                </div>
                <span className="inline-flex size-8 items-center justify-center rounded-sm bg-primary/50 text-overlay-primary opacity-50">
                  <i aria-hidden className="icon-arrow-foward-sharp size-4 -rotate-90" />
                </span>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-tertiary">LemonAI can make mistakes, so please double-check it.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="absolute inset-0 z-20 rounded-lg bg-transparent cursor-pointer"
        aria-label="Sign in to use LemonAI chat"
      />
    </div>
  );
}
