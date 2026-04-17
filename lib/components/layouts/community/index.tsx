import React from 'react';
import { notFound } from 'next/navigation';

import { isObjectId } from '$lib/utils/helpers';

import { ThemeProvider } from '$lib/components/features/theme-builder/provider';
import { getClient } from '$lib/graphql/request';
import { GetSpaceDocument, Space, GetEventsDocument, Event } from '$lib/graphql/generated/backend/graphql';
import { CommunityContainer } from './container';
import { AIChatProvider } from '$lib/components/features/ai/provider';
import { Config, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { getCommunityThemeData } from '$lib/components/features/community-manage/theme';

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

  const themeData = getCommunityThemeData(space);

  return (
    <ThemeProvider themeData={themeData}>
      <AIChatProvider initialConfigs={enrichedConfigs as Config[]}>
        <CommunityContainer space={space}>{children}</CommunityContainer>
      </AIChatProvider>
    </ThemeProvider>
  );
}
