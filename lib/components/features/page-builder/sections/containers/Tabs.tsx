'use client';

import React from 'react';
import clsx from 'clsx';
import { Element } from '@craftjs/core';
import { useSafeNode } from '../../utils/use-safe-node';
import { SectionWrapper } from '../SectionWrapper';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

// ---------------------------------------------------------------------------
// TabCanvas — drop zone for a single tab's content
// ---------------------------------------------------------------------------

interface TabCanvasProps {
  children?: React.ReactNode;
}

function _TabCanvas({ children }: TabCanvasProps) {
  const {
    connectors: { connect },
  } = useSafeNode();

  const hasChildren = React.Children.count(children) > 0;

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className={clsx(
        'min-h-[60px] rounded-md transition-colors',
        !hasChildren &&
          'border border-dashed border-card-border bg-overlay-primary/20 flex items-center justify-center',
      )}
    >
      {hasChildren ? (
        children
      ) : (
        <span className="text-xs text-tertiary select-none">
          Drop content here
        </span>
      )}
    </div>
  );
}

export const TabCanvas = React.memo(_TabCanvas);
TabCanvas.craft = {
  displayName: 'TabCanvas',
  props: {},
  rules: {
    canMoveIn: () => true,
  },
};

// ---------------------------------------------------------------------------
// Tabs — tabbed content container
// ---------------------------------------------------------------------------

interface TabItem {
  label: string;
}

interface TabsProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  tabs?: TabItem[];
  active_tab?: number;
}

function _Tabs({
  width = 'contained',
  padding = 'md',
  alignment,
  min_height,
  background,
  tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }],
  active_tab = 0,
}: TabsProps) {
  const {
    connectors: { connect, drag },
  } = useSafeNode();

  const [activeTab, setActiveTab] = React.useState(active_tab);

  // Keep internal state in sync when the prop changes (e.g. from props panel)
  React.useEffect(() => {
    setActiveTab(active_tab);
  }, [active_tab]);

  // Clamp to valid range
  const safeActiveTab = Math.min(Math.max(0, activeTab), tabs.length - 1);

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div
        ref={(ref) => {
          if (ref) connect(drag(ref));
        }}
        className="w-full"
      >
        {/* Tab bar */}
        <div className="flex border-b border-card-border overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i)}
              className={clsx(
                'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                'border-b-2 -mb-px',
                i === safeActiveTab
                  ? 'border-accent text-primary'
                  : 'border-transparent text-tertiary hover:text-secondary hover:border-card-border',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content panels */}
        <div className="mt-4">
          {tabs.map((_, i) => (
            <div
              key={i}
              style={{ display: i === safeActiveTab ? 'block' : 'none' }}
            >
              <Element
                id={`tab-content-${i}`}
                is={TabCanvas}
                canvas
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export const Tabs = React.memo(_Tabs);
Tabs.craft = {
  displayName: 'Tabs',
  props: {
    width: 'contained',
    padding: 'md',
    tabs: [{ label: 'Tab 1' }, { label: 'Tab 2' }],
    active_tab: 0,
  },
};
