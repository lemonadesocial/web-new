'use client';
import React from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';

import Image from 'next/image';
import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useTheme } from '$lib/components/features/theme-builder/provider';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { Config } from '$lib/graphql/generated/ai/graphql';
import Header from '../header';
import LoadMoreWrapper from './loadMoreWrapper';
import Sidebar from './sidebar';
import { Footer } from './footer';
import { useAIChat, AIChatActionKind } from '../../features/ai/provider';
import { randomEventDP } from '$lib/utils/user';
import { Button, Card, modal } from '$lib/components/core';
import { AgentInfoModal, AgentList } from '$lib/components/features/ai/AgentsSidebar';

function FaviconUpdater({ faviconUrl }: { faviconUrl?: string | null }) {
  React.useEffect(() => {
    if (!faviconUrl) return;

    const updateFavicon = (url: string) => {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = url;

      const shortcutLink = document.querySelector("link[rel~='shortcut icon']") as HTMLLinkElement;
      if (shortcutLink) {
        shortcutLink.href = url;
      }

      const appleLink = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement;
      if (appleLink) {
        appleLink.href = url;
      }
    };

    updateFavicon(faviconUrl);
  }, [faviconUrl]);

  return null;
}

export function CommunityContainer({ space, children }: React.PropsWithChildren & { space: Space }) {
  const [state] = useTheme();
  const [aiState, aiDispatch] = useAIChat();
  const pathname = usePathname();
  const [showAgents, setShowAgents] = React.useState(false);

  const isChat = /\/s\/[^/]+\/chat$/.test(pathname || '');
  const currentAgent = aiState.configs.find((c) => c._id === aiState.config) as Config;

  React.useEffect(() => {
    if (isChat && aiState.configs.length && !aiState.messages.length) {
      const configId = aiState.config || (aiState.configs[0] as Config)?._id;
      if (configId) {
        aiDispatch({ type: AIChatActionKind.set_config, payload: { config: configId } });
      }
    }
  }, [isChat, aiState.configs, aiDispatch]);

  React.useEffect(() => {
    setShowAgents(false);
  }, [aiState.config]);

  return (
    <main
      id={space._id}
      className={clsx(
        'relative flex h-dvh w-full z-100 overflow-hidden',
        state.theme !== 'default' && [state.config.color, state.config.mode],
      )}
    >
      <FaviconUpdater faviconUrl={space?.fav_icon_url} />
      <ThemeGenerator data={state} />
      <Sidebar space={space} />

      <div className={clsx('flex-1 flex flex-col overflow-hidden relative', isChat && 'bg-overlay-primary')}>
        <Header
          hideLogo
          className="hidden md:flex sticky top-0 left-0 w-full h-16 z-9 border-b backdrop-blur-md"
          title={
            isChat ? (
              <div className="flex items-center gap-3">
                <Image
                  src={currentAgent?.avatar || randomEventDP(currentAgent?._id)}
                  className="w-8 h-8 rounded-full object-cover"
                  alt={currentAgent?.name || 'LemonAI'}
                  width={32}
                  height={32}
                />
                <p className="font-semibold text-lg">{currentAgent?.name || 'LemonAI'}</p>
              </div>
            ) : undefined
          }
        />

        <Header className="md:hidden sticky top-0 left-0 w-full h-16 z-11 border-b backdrop-blur-md" />
        {isChat && (
          <>
            <div className="md:hidden flex items-center gap-3 py-3 px-4 border-b bg-background z-10">
              <Image
                src={currentAgent?.avatar || randomEventDP(currentAgent?._id)}
                className="w-8 h-8 rounded-full object-cover"
                alt={currentAgent?.name || 'LemonAI'}
                width={32}
                height={32}
              />
              <div className="flex-1">
                <p>{currentAgent?.name || 'LemonAI'}</p>
                {currentAgent?.job && <p className="text-tertiary text-sm">{currentAgent?.job}</p>}
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  icon="icon-info"
                  variant="tertiary-alt"
                  size="sm"
                  aria-label="Agent Info"
                  onClick={() => {
                    if (!currentAgent) return;
                    modal.open(AgentInfoModal, {
                      props: {
                        agent: currentAgent,
                        onSelectAgent: () => {
                          if (currentAgent?._id !== aiState.config) {
                            aiDispatch({ type: AIChatActionKind.set_config, payload: { config: currentAgent?._id } });
                          }
                          modal.close();
                        },
                      },
                    });
                  }}
                />
                {!!aiState.configs.length && (
                  <Button
                    icon={showAgents ? 'icon-x-close' : 'icon-chevrons-up-down'}
                    variant="tertiary-alt"
                    size="sm"
                    onClick={() => setShowAgents(!showAgents)}
                  />
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showAgents && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden absolute top-30 left-0 right-0 z-50 overflow-hidden bg-background/80 backdrop-blur-md border-b"
                >
                  <div className="max-h-[calc(100dvh-120px)] flex flex-col">
                    <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
                      <AgentList />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <LoadMoreWrapper className="flex-1 overflow-auto no-scrollbar">
          <div
            className={clsx(
              !isChat && 'lg:pl-24.25',
              'md:pt-16',
              isChat && 'h-full',
              'pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0',
            )}
          >
            <div className={clsx('mx-auto', isChat ? 'w-full h-full' : 'page px-4 xl:px-0 pt-6')}>{children}</div>
          </div>
        </LoadMoreWrapper>
      </div>
      <Footer space={space} />
    </main>
  );
}
