'use client';
import React from 'react';
import clsx from 'clsx';

import { ThemeGenerator } from '$lib/components/features/theme-builder/generator';
import { useTheme } from '$lib/components/features/theme-builder/provider';
import { Space } from '$lib/graphql/generated/backend/graphql';
import Header from '../header';
import LoadMoreWrapper from './loadMoreWrapper';
import Sidebar from './sidebar';
import { Footer } from './footer';

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

      <div className="flex-1 overflow-auto">
        <Header hideLogo className="sticky top-0 left-0 w-full h-[64px] z-[9] border-b backdrop-blur-md" />
        <LoadMoreWrapper>
          <div className="lg:pl-[97px] pt-[64px]">
            <div className="page mx-auto px-4 xl:px-0 pt-6">{children}</div>
          </div>
        </LoadMoreWrapper>
      </div>
      <Footer space={space} />
    </main>
  );
}
