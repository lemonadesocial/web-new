'use client';
import { Segment, SegmentItem } from '$lib/components/core';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import clsx from 'clsx';
import React from 'react';

const segments: SegmentItem<string>[] = [
  { label: 'builder', value: 'builder', iconLeft: 'icon-cards-outline' },
  { label: 'ai', value: 'ai', iconLeft: 'icon-sparkles' },
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
  { key: 'template', label: 'Template', component: () => null },
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

      <div className="px-4!">{Comp && <Comp />}</div>
    </div >
  );
}
