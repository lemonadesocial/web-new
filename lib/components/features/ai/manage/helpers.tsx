import React from 'react';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import { AIChat } from '../AIChat';
import { ActiveTabType } from './store';

export const tabMappings: Record<ActiveTabType, { icon: string; label: string; component: React.FC }> = {
  manage: {
    icon: 'icon-settings',
    label: 'Manage',
    component: AIChat,
  },
  design: {
    icon: 'icon-palette-outline',
    label: 'Design',
    component: DesignTool,
  },
  preview: {
    icon: 'icon-eye-line',
    label: 'Preview',
    component: AIChat,
  },
};

function DesignTool() {
  return <EventThemeBuilder autoSave={false} inline />;
}
