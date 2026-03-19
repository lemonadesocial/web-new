'use client';
import React from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useTheme } from '$lib/components/features/theme-builder/provider';
import { Space } from '$lib/graphql/generated/backend/graphql';
import Header from '../header';
import LoadMoreWrapper from './loadMoreWrapper';
import Sidebar from './sidebar';
import { Footer } from './footer';
import { useAIChat } from '../../features/ai/provider';

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
  const [aiState] = useAIChat();
  const pathname = usePathname();

  const isChat = pathname?.endsWith('/chat');
  const currentAgent = aiState.configs.find((c: any) => c._id === aiState.config);

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

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          hideLogo
          className="sticky top-0 left-0 w-full h-[64px] z-[9] border-b backdrop-blur-md"
          title={
            isChat ? (
              <div className="flex items-center gap-3">
                <img
                  src={currentAgent?.avatar || '/assets/default-bot.png'}
                  className="w-8 h-8 rounded-full object-cover"
                  alt={currentAgent?.name}
                />
                <p className="font-semibold text-lg">{currentAgent?.name || 'LemonAI'}</p>
              </div>
            ) : undefined
          }
        />
        <LoadMoreWrapper className="flex-1 overflow-auto no-scrollbar">
          <div className={clsx(!isChat && 'lg:pl-[97px]', 'pt-[64px]', isChat && 'h-full')}>
            <div className={clsx('mx-auto', isChat ? 'w-full h-full' : 'page px-4 xl:px-0 pt-6')}>{children}</div>
          </div>
        </LoadMoreWrapper>
      </div>
      <Footer space={space} />
    </main>
  );
}
