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
// AccordionPanelCanvas — drop zone for a single panel's content
// ---------------------------------------------------------------------------

interface AccordionPanelCanvasProps {
  children?: React.ReactNode;
}

function _AccordionPanelCanvas({ children }: AccordionPanelCanvasProps) {
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

export const AccordionPanelCanvas = React.memo(_AccordionPanelCanvas);
AccordionPanelCanvas.craft = {
  displayName: 'AccordionPanelCanvas',
  props: {},
  rules: {
    canMoveIn: () => true,
  },
};

// ---------------------------------------------------------------------------
// Chevron icon — rotates when panel is open
// ---------------------------------------------------------------------------

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={clsx(
        'size-5 shrink-0 text-secondary transition-transform duration-200',
        open && 'rotate-180',
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// AccordionContainer — collapsible panels container
// ---------------------------------------------------------------------------

interface PanelItem {
  title: string;
}

interface AccordionContainerProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  panels?: PanelItem[];
  allow_multiple_open?: boolean;
}

function _AccordionContainer({
  width = 'contained',
  padding = 'md',
  alignment,
  min_height,
  background,
  panels = [{ title: 'Panel 1' }, { title: 'Panel 2' }],
  allow_multiple_open = false,
}: AccordionContainerProps) {
  const {
    connectors: { connect, drag },
  } = useSafeNode();

  // Track which panels are open by index
  const [openPanels, setOpenPanels] = React.useState<Set<number>>(
    () => new Set([0]),
  );

  const togglePanel = React.useCallback(
    (index: number) => {
      setOpenPanels((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          if (!allow_multiple_open) {
            next.clear();
          }
          next.add(index);
        }
        return next;
      });
    },
    [allow_multiple_open],
  );

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
        className="w-full divide-y divide-card-border border border-card-border rounded-lg overflow-hidden"
      >
        {panels.map((panel, i) => {
          const isOpen = openPanels.has(i);

          return (
            <div key={i}>
              {/* Panel header */}
              <button
                type="button"
                onClick={() => togglePanel(i)}
                className={clsx(
                  'flex w-full items-center justify-between px-4 py-3 text-left transition-colors',
                  'bg-overlay-primary/40 hover:bg-overlay-primary/60',
                )}
              >
                <span className="text-sm font-medium text-primary">
                  {panel.title}
                </span>
                <ChevronIcon open={isOpen} />
              </button>

              {/* Panel content — collapsible */}
              <div
                className={clsx(
                  'overflow-hidden transition-all duration-200',
                  isOpen
                    ? 'max-h-[2000px] opacity-100'
                    : 'max-h-0 opacity-0',
                )}
              >
                <div className="px-4 py-3">
                  <Element
                    id={`accordion-panel-${i}`}
                    is={AccordionPanelCanvas}
                    canvas
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

export const AccordionContainer = React.memo(_AccordionContainer);
AccordionContainer.craft = {
  displayName: 'AccordionContainer',
  props: {
    width: 'contained',
    padding: 'md',
    panels: [{ title: 'Panel 1' }, { title: 'Panel 2' }],
    allow_multiple_open: false,
  },
};
