import React from 'react';
import { ActiveTabType } from './store';
import { AIChat } from '../AIChat';

export const tabMappings: Record<ActiveTabType, { icon: string; label: string; component: React.FC }> = {
  manage: {
    icon: 'icon-settings',
    label: 'Manage',
    component: AIChat,
  },
  design: {
    icon: 'icon-settings',
    label: 'Design',
    component: () => null,
  },
  preview: {
    icon: 'icon-settings',
    label: 'Preview',
    component: () => null,
  },
};

const ManageChat = () => {
  return;
};
