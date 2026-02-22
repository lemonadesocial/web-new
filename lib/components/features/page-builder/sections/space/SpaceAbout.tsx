'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHtml } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface AboutStat {
  label: string;
  value: string;
}

interface SpaceAboutProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  heading?: string;
  description?: string;
  image_url?: string;
  image_position?: 'left' | 'right';
  show_image?: boolean;
  stats?: AboutStat[];
}

function StatItem({ stat }: { stat: AboutStat }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-card-border bg-primary/4 px-4 py-3">
      <span className="text-xl font-bold text-primary">{stat.value}</span>
      <span className="text-xs font-medium text-secondary">{stat.label}</span>
    </div>
  );
}

function _SpaceAbout({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = 'About',
  description = '',
  image_url = '',
  image_position = 'right',
  show_image = true,
  stats = [],
}: SpaceAboutProps) {
  const hasDescription = description && description.trim().length > 0;
  const hasImage = image_url && image_url.trim().length > 0;
  const hasStats = stats.length > 0;
  const showImageSection = show_image && hasImage;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {/* Heading */}
      <h2 className="mb-6 text-2xl font-bold text-primary">
        {heading || 'About'}
      </h2>

      {/* Two-column layout */}
      <div
        className={clsx(
          'flex flex-col gap-8',
          showImageSection && 'lg:flex-row lg:items-start',
        )}
      >
        {/* Text column */}
        <div
          className={clsx(
            'flex flex-col gap-4',
            showImageSection ? 'lg:flex-1' : 'w-full',
            showImageSection && image_position === 'right' && 'lg:order-1',
            showImageSection && image_position === 'left' && 'lg:order-2',
          )}
        >
          {hasDescription ? (
            <div
              className="prose prose-invert max-w-none text-sm leading-relaxed text-secondary"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          ) : (
            <p className="text-sm leading-relaxed text-tertiary">
              Add a description for your space to tell visitors what it is about.
            </p>
          )}
        </div>

        {/* Image column */}
        {showImageSection && (
          <div
            className={clsx(
              'shrink-0 overflow-hidden rounded-md border border-card-border lg:w-2/5',
              image_position === 'right' && 'lg:order-2',
              image_position === 'left' && 'lg:order-1',
            )}
          >
            <img
              src={image_url}
              alt={heading || 'About'}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Stats row */}
      {hasStats && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <StatItem key={`${stat.label}-${idx}`} stat={stat} />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

export const SpaceAbout = React.memo(_SpaceAbout);
SpaceAbout.craft = {
  displayName: 'SpaceAbout',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'About',
    description: '',
    image_url: '',
    image_position: 'right',
    show_image: true,
    stats: [],
  },
};
