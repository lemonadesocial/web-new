'use client';
import { drawer } from '$lib/components/core/dialog';
import React from 'react';
import { ToolKey, useAIChat } from './provider';
import { CreateEventPane } from './panes/CreateEventPane';
import { CreateCommunityPane } from './panes/CreateCommunityPane';

const MAPPING_COMPONENTS: Record<ToolKey, React.FC<any>> = {
  create_event: CreateEventPane,
  manage_event: CreateEventPane,
  create_community: CreateCommunityPane,
  manage_community: CreateCommunityPane,
};

export function AIChatRightPane({ template }: { template: React.ReactNode }) {
  const [state] = useAIChat();

  const Comp = state.toggleDetail?.action ? MAPPING_COMPONENTS[state.toggleDetail?.action] : React.Fragment;

  return <Comp {...(state.toggleDetail?.props || {})} />;
}
