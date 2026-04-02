'use client';
import { Segment, SegmentItem } from '$lib/components/core';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import clsx from 'clsx';
import React from 'react';
import { TemplateTool } from './TemplateTool';

const segments: SegmentItem<string>[] = [
  { label: 'Builder', value: 'builder', iconLeft: 'icon-cards-outline' },
  { label: 'AI Designer', value: 'ai', iconLeft: 'icon-sparkles' },
];

export function DesignTool() {
  const [segment, setSegment] = React.useState(() => segments[0]);

  return (
    <>
      <div className="px-4 mb-4 mt-2">
        <Segment
          items={segments}
          selected={segment.value}
          onSelect={(item) => setSegment(item)}
          className="w-full"
          size="sm"
        />
      </div>
      <BuilderTabs />
    </>
  );
}

const tabs = [
  { key: 'template', label: 'Templates', component: () => <TemplateTool /> },
  { key: 'sections', label: 'Sections', component: () => null },
  { key: 'theme', label: 'Theme', component: () => <EventThemeBuilder autoSave={false} inline /> },
];
function BuilderTabs() {
  const [selectedTab, setSelectedTab] = React.useState<'template' | 'sections' | 'theme'>('template');

  const Comp = tabs.find((item) => item.key === selectedTab)?.component || null;
  return (
    <div>
      <ul className="flex border-b px-4">
        {tabs.map((item) => (
          <li
            key={item.key}
            className={clsx(
              'flex-1 flex items-center justify-center cursor-pointer',
              item.key === selectedTab && 'border-b-2 border-b-primary',
              'pb-2.5',
            )}
            onClick={() => setSelectedTab(item.key as 'template' | 'sections' | 'theme')}
          >
            <div>
              <p className={clsx(item.key === selectedTab ? 'text-primary' : 'text-tertiary', 'font-medium')}>
                {item.label}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div>{Comp && <Comp />}</div>
    </div>
  );
}
