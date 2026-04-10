'use client';
import { Segment, SegmentItem } from '$lib/components/core';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import clsx from 'clsx';
import React from 'react';
import { AIChat } from '../AIChat';
import { AIChatActionKind, useAIChat } from '../provider';
import { TemplateTool } from './TemplateTool';
import { SectionTool } from './SectionTool';
import { storeManageLayout, useStoreManageLayout } from './store';

const segments: SegmentItem<string>[] = [
  { label: 'Builder', value: 'builder', iconLeft: 'icon-cards-outline' },
  { label: 'AI Designer', value: 'ai', iconLeft: 'icon-sparkles' },
];

const DESIGN_SYSTEM_PROMPT = `You are an expert event page designer using CraftJS. 
Your goal is to design a beautiful, functional event page by returning a valid structure_data JSON object.
The structure_data should follow the CraftJS format and use the following available components:
- Container (ROOT)
- Grid
- Col
- RichText (props: content)
- VideoEmbed (props: url)
- AboutSection (props: event)
- LocationSection (props: event)
- EventAccess (props: event)
- EventCollectibles (props: event)
- SubEventSection (props: event)
- GallerySection (props: event)
- EventDateTimeBlock (props: event)
- EventLocationBlock (props: event)
- CommunitySection (props: event)
- HostedBySection (props: event)
- AttendeesSection (props: event)
- EventHero (props: event, align: 'text-left' | 'text-center' | 'text-right')
- EventSidebarImage (props: event)

IMPORTANT: 
1. You MUST return your response with the design in the 'metadata.structure_data' field.
2. DO NOT include the JSON structure in the 'message' field. The 'message' field should only contain a brief, friendly description of the changes you made.
3. Ensure the output is a valid structure_data that can be loaded into the CraftJS editor.
4. If you are asked to "update" or "change" something, return the ENTIRE updated structure_data, not just the changes.`;

export function DesignTool() {
  const state = useStoreManageLayout();
  const segment = state.designMode;
  const [_, aiChatDispatch] = useAIChat();

  React.useEffect(() => {
    if (segment === 'ai') {
      aiChatDispatch({
        type: AIChatActionKind.set_system_prompt,
        payload: { systemPrompt: DESIGN_SYSTEM_PROMPT },
      });
    } else {
      aiChatDispatch({
        type: AIChatActionKind.set_system_prompt,
        payload: { systemPrompt: undefined },
      });
    }
  }, [segment, aiChatDispatch]);

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
          <AIChat compact showTools={false} readOnly={true} />
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
