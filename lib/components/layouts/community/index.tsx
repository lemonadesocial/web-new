import React from 'react';
import { notFound } from 'next/navigation';

import { isObjectId } from '$lib/utils/helpers';

import { ThemeProvider } from '$lib/components/features/theme-builder/provider';
import { defaultTheme } from '$lib/components/features/theme-builder/store';
import { getClient } from '$lib/graphql/request';
import { GetSpaceDocument, Space, GetEventsDocument, Event } from '$lib/graphql/generated/backend/graphql';
import { CommunityContainer } from './container';
import { defaultPassportConfig } from '$lib/components/features/theme-builder/passports';
import { merge } from 'lodash';
import { AIChatProvider } from '$lib/components/features/ai/provider';
import { Config, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';

type LayoutProps = {
  children: React.ReactElement;
  params: { uid: string; domain: string };
};

export default async function CommunityLayout({ children, params }: LayoutProps) {
  const { uid, domain } = await params;
  let variables = {};

  if (uid) {
    variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  } else {
    if (domain) variables = { hostname: decodeURIComponent(domain) };
  }

  const client = getClient();

  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;

  if (!space) {
    return notFound();
  }

  const [aiTaskResult] = await Promise.allSettled([
    (async () => {
      // Fetch AI Configs
      const { data: dataConfig } = await aiChatClient.query({
        query: GetListAiConfigDocument,
        variables: { filter: { spaces_in: [space._id] } },
      });
      const configs = (dataConfig?.configs?.items || []) as Config[];

      // Fetch Events based on those configs
      const allEventIds = Array.from(new Set(configs.flatMap((c: any) => c.welcomeMetadata?.events || [])));
      let fetchedEvents: Event[] = [];

      if (allEventIds.length) {
        const { data: eventsData } = await client.query({
          query: GetEventsDocument,
          variables: { id: allEventIds },
        });
        fetchedEvents = (eventsData?.getEvents || []) as Event[];
      }

      return { configs, fetchedEvents };
    })(),
  ]);

  const { configs, fetchedEvents } =
    aiTaskResult.status === 'fulfilled' ? aiTaskResult.value : { configs: [], fetchedEvents: [] };

  if (aiTaskResult.status === 'rejected') {
    console.error('AI Service degradation:', aiTaskResult.reason);
  }

  const enrichedConfigs = configs.map((config) => {
    const meta = config.welcomeMetadata as any;
    if (meta?.events?.length) {
      const cards = meta.events
        .map((id: string) => {
          const event = fetchedEvents.find((e) => e._id === id);
          if (!event) return null;
          return { type: 'spotlight_event', data: event };
        })
        .filter(Boolean);

      return {
        ...config,
        welcomeMetadata: {
          ...meta,
          title: meta.title || 'Spotlight Events',
          cards,
        },
      };
    }
    return config;
  });

  let emptyTheme;

  let themeData = defaultTheme;
  // NOTE: adapt existing config
  if (space.theme_data) {
    themeData.theme = space.theme_data.theme;
    themeData.font_title = space.theme_data.font_title;
    themeData.font_body = space.theme_data.font_body;
    themeData.variables = { ...themeData.variables, ...space.theme_data.variables };
    themeData.config = {
      ...themeData.config,
      mode: space.theme_data.mode || space.theme_data.config?.mode,
      color: space.theme_data.foreground?.key || space.theme_data.config?.fg || space.theme_data.config?.color,
      class: space.theme_data.class,
      image: space.theme_data.config?.image,
      name: space.theme_data.config?.name,
      effect: space.theme_data.config?.effect,
    };

    if (space.theme_name && space.theme_name !== 'default') {
      themeData = merge({}, themeData, defaultPassportConfig[space.theme_name as string] || {});
    }
  } else {
    if (space.theme_name && space.theme_name !== 'default') {
      emptyTheme = defaultPassportConfig[space.theme_name as string] || null;
    }
  }

  return (
    <ThemeProvider themeData={!space.theme_data ? emptyTheme : themeData}>
      <AIChatProvider initialConfigs={enrichedConfigs as Config[]}>
        <CommunityContainer space={space}>{children}</CommunityContainer>
      </AIChatProvider>
    </ThemeProvider>
  );
}
