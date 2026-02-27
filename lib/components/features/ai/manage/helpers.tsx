import React from 'react';
import { match } from 'ts-pattern';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { AIChat } from '../AIChat';
import { ActiveTabType, useStoreManageLayout } from './store';

export const tabMappings: Record<ActiveTabType, { icon: string; label: string; component: React.FC }> = {
  manage: {
    icon: 'icon-settings',
    label: 'Manage',
    component: AIChat,
  },
  design: {
    icon: 'icon-palette-outline',
    label: 'Design',
    component: () => (
      <div className="flex items-center justify-around py-4">
        <p>Coming Soon.</p>
      </div>
    ),
  },
  preview: {
    icon: 'icon-eye-line',
    label: 'Preview',
    component: AIChat,
  },
};

function DesignTool() {
  const state = useStoreManageLayout();

  return (
    <>
      {match(state.layoutType)
        .with('event', () => (
          <EventThemeProvider themeData={(state.data as Event)?.theme_data}>
            <EventThemeBuilder eventId={(state.data as Event)?._id} />
          </EventThemeProvider>
        ))
        .otherwise(() => null)}
    </>
  );
}
