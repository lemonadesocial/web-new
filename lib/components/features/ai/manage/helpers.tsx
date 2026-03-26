import React from 'react';
import { AIChat } from '../AIChat';
import { ActiveTabType } from './store';
import { DesignTool } from './DesignTool';

export const tabMappings: Record<ActiveTabType, { icon: string; label: string; component: React.FC }> = {
  manage: {
    icon: 'icon-settings',
    label: 'Manage',
    component: () => (
      <div className="px-4 h-full">
        <AIChat />
      </div>
    ),
  },
  design: {
    icon: 'icon-palette-outline',
    label: 'Design',
    component: () => (
      <div className="h-full">
        <DesignTool />
      </div>
    ),
  },
  preview: {
    icon: 'icon-eye-line',
    label: 'Preview',
    component: () => (
      <div className="px-4 h-full">
        <AIChat />
      </div>
    ),
  },
};
