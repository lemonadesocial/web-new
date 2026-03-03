'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

type SpacerHeight = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type DividerStyle = 'solid' | 'dashed' | 'dotted';

interface SpacerProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  height?: SpacerHeight;
  show_divider?: boolean;
  divider_style?: DividerStyle;
}

const HEIGHT_MAP: Record<SpacerHeight, number> = {
  xs: 16,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
};

function _Spacer({
  width = 'full',
  padding = 'none',
  alignment,
  min_height,
  background,
  height = 'md',
  show_divider = false,
  divider_style = 'solid',
}: SpacerProps) {
  const px = HEIGHT_MAP[height];

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div
        className={clsx(
          'relative flex items-center justify-center',
          // Subtle dotted outline in editor context to make spacer visible
          'outline-1 outline-dashed outline-card-border/30',
        )}
        style={{ height: `${px}px` }}
      >
        {show_divider && (
          <hr
            className="w-full border-0 border-t border-card-border"
            style={{ borderStyle: divider_style }}
          />
        )}
      </div>
    </SectionWrapper>
  );
}

export const Spacer = React.memo(_Spacer);
Spacer.craft = {
  displayName: 'Spacer',
  props: {
    width: 'full',
    padding: 'none',
    height: 'md',
    show_divider: false,
    divider_style: 'solid',
  },
};
