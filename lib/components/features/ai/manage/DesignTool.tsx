'use client';
import { Segment, SegmentItem } from '$lib/components/core';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import clsx from 'clsx';
import React from 'react';
import { AIChat } from '../AIChat';
import { AIChatActionKind, Message, useAIChat } from '../provider';
import { TemplateTool } from './TemplateTool';
import { SectionTool } from './SectionTool';
import { storeManageLayout, useStoreManageLayout } from './store';
import { AI_CONFIG } from '$lib/utils/constants';
import { useQuery } from '$lib/graphql/request/hooks';
import { Config, GetAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';

const segments: SegmentItem<string>[] = [
  { label: 'Builder', value: 'builder', iconLeft: 'icon-cards-outline' },
  { label: 'AI Designer', value: 'ai', iconLeft: 'icon-sparkles' },
];

const PAGE_DESIGNER_CONFIG_ID = process.env.NEXT_PUBLIC_PAGE_DESIGNER_CONFIG;

export function DesignTool() {
  const state = useStoreManageLayout();
  const segment = state.designMode;
  const [_, aiChatDispatch] = useAIChat();
  const [pageDesignerConfig, setPageDesignerConfig] = React.useState<Config | null>(null);

  useQuery(
    GetAiConfigDocument,
    {
      variables: { id: PAGE_DESIGNER_CONFIG_ID! },
      onComplete: (data) => {
        if (data?.config) {
          setPageDesignerConfig(data.config as Config);
        }
      },
      skip: !PAGE_DESIGNER_CONFIG_ID,
    },
    aiChatClient,
  );

  React.useEffect(() => {
    if (segment !== 'builder') return;
    aiChatDispatch({
      type: AIChatActionKind.set_config,
      payload: { config: AI_CONFIG },
    });
  }, [segment, aiChatDispatch]);

  React.useEffect(() => {
    if (segment !== 'ai' || !pageDesignerConfig) return;
    const welcomeMessage: Message = {
      message:
        pageDesignerConfig.welcomeMessage ||
        `Hi, I'm ${pageDesignerConfig.name}, your ${pageDesignerConfig.job || 'assistant'}.\nHow can I help?`,
      role: 'assistant',
      metadata: pageDesignerConfig.welcomeMetadata,
    };
    aiChatDispatch({
      type: AIChatActionKind.set_config,
      payload: {
        config: PAGE_DESIGNER_CONFIG_ID,
        configs: [pageDesignerConfig],
        messages: [welcomeMessage],
      },
    });
  }, [segment, pageDesignerConfig, aiChatDispatch]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 mb-4 mt-2 shrink-0">
        <Segment
          items={segments}
          selected={segment}
          onSelect={(item) => storeManageLayout.setDesignMode(item.value as any)}
          className="w-full"
          size="sm"
        />
      </div>
      {segment === 'builder' ? (
        <BuilderTabs />
      ) : (
        <div className="flex-1 overflow-hidden px-4">
          <AIChat compact showTools={false} readOnly={true} configOverride={PAGE_DESIGNER_CONFIG_ID} />
        </div>
      )}
    </div>
  );
}

const tabs = [
  { key: 'template', label: 'Templates', component: () => <TemplateTool /> },
  { key: 'sections', label: 'Sections', component: () => <SectionTool /> },
  {
    key: 'theme',
    label: 'Theme',
    component: () => (
      <div className="p-5">
        <EventThemeBuilder autoSave={false} inline />
      </div>
    ),
  },
];

function BuilderTabs() {
  const state = useStoreManageLayout();
  const selectedTab = state.builderTab;

  const Comp = tabs.find((item) => item.key === selectedTab)?.component || null;
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ul className="flex border-b px-4 shrink-0">
        {tabs.map((item) => (
          <li
            key={item.key}
            className={clsx(
              'flex-1 flex items-center justify-center cursor-pointer',
              item.key === selectedTab && 'border-b-2 border-b-primary',
              'pb-2.5',
            )}
            onClick={() => storeManageLayout.setBuilderTab(item.key as any)}
          >
            <div>
              <p className={clsx(item.key === selectedTab ? 'text-primary' : 'text-tertiary', 'font-medium')}>
                {item.label}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex-1 overflow-y-auto no-scrollbar">{Comp && <Comp />}</div>
    </div>
  );
}
