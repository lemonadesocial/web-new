'use client';

import React from 'react';
import clsx from 'clsx';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../types';

export interface SectionWrapperProps {
  children: React.ReactNode;
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  className?: string;
}

const WIDTH_CLASSES: Record<SectionWidth, string> = {
  full: 'w-full',
  contained: 'w-full max-w-5xl mx-auto',
  narrow: 'w-full max-w-2xl mx-auto',
};

const PADDING_CLASSES: Record<SectionPadding, string> = {
  none: '',
  sm: 'px-4 py-4',
  md: 'px-6 py-8',
  lg: 'px-8 py-12',
  xl: 'px-10 py-16',
};

const ALIGNMENT_CLASSES: Record<SectionAlignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function getBackgroundStyle(bg?: SectionBackground): React.CSSProperties {
  if (!bg) return {};
  switch (bg.type) {
    case 'color':
      return { backgroundColor: bg.value };
    case 'image': {
      const safeBgUrl = String(bg.value).replace(/'/g, '%27').replace(/\)/g, '%29').replace(/"/g, '%22');
      return {
        backgroundImage: `url('${safeBgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    case 'gradient':
      return { background: bg.value };
    default:
      return {};
  }
}

export const SectionWrapper = React.memo(function SectionWrapper({
  children,
  width = 'contained',
  padding = 'md',
  alignment,
  min_height,
  background,
  className,
}: SectionWrapperProps) {
  return (
    <section
      className={clsx(
        WIDTH_CLASSES[width],
        PADDING_CLASSES[padding],
        alignment && ALIGNMENT_CLASSES[alignment],
        className,
      )}
      style={{
        ...getBackgroundStyle(background),
        ...(min_height ? { minHeight: min_height } : {}),
      }}
    >
      {children}
    </section>
  );
});
