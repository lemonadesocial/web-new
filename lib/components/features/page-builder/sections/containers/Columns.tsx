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
// Gap mapping
// ---------------------------------------------------------------------------

const GAP_MAP: Record<string, string> = {
  sm: '8px',
  md: '16px',
  lg: '24px',
};

// ---------------------------------------------------------------------------
// ColumnCanvas — drop zone for a single column
// ---------------------------------------------------------------------------

interface ColumnCanvasProps {
  children?: React.ReactNode;
}

function _ColumnCanvas({ children }: ColumnCanvasProps) {
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
        <span className="text-xs text-tertiary select-none">Drop here</span>
      )}
    </div>
  );
}

export const ColumnCanvas = React.memo(_ColumnCanvas);
ColumnCanvas.craft = {
  displayName: 'ColumnCanvas',
  props: {},
  rules: {
    canMoveIn: () => true,
  },
};

// ---------------------------------------------------------------------------
// Columns — multi-column layout container
// ---------------------------------------------------------------------------

interface ColumnsProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  columns_count?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  column_widths?: string;
}

function _Columns({
  width = 'contained',
  padding = 'md',
  alignment,
  min_height,
  background,
  columns_count = 2,
  gap = 'md',
  column_widths = '',
}: ColumnsProps) {
  const {
    connectors: { connect, drag },
  } = useSafeNode();

  // Resolve grid template: use custom widths if provided, otherwise equal columns
  const gridTemplateColumns = column_widths.trim()
    ? column_widths.trim()
    : `repeat(${columns_count}, 1fr)`;

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
        className="grid w-full"
        style={{
          gridTemplateColumns,
          gap: GAP_MAP[gap] || GAP_MAP.md,
        }}
      >
        {Array.from({ length: columns_count }, (_, i) => (
          <Element key={i} id={`column-${i}`} is={ColumnCanvas} canvas />
        ))}
      </div>
    </SectionWrapper>
  );
}

export const Columns = React.memo(_Columns);
Columns.craft = {
  displayName: 'Columns',
  props: {
    width: 'contained',
    padding: 'md',
    columns_count: 2,
    gap: 'md',
    column_widths: '',
  },
};
