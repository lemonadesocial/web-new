import { ActiveTabType } from './store';

export const tabMappings: Record<ActiveTabType, { icon: string; label: string }> = {
  manage: {
    icon: 'icon-settings',
    label: 'Manage',
  },
  design: {
    icon: 'icon-palette-outline',
    label: 'Design',
  },
  preview: {
    icon: 'icon-eye-line',
    label: 'Preview',
  },
};
