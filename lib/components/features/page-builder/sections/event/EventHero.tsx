'use client';

import React from 'react';
import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHref } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

function EventHeroInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  title,
  subtitle,
  date,
  location,
  cover_image_url,
  cta_text,
  cta_url,
  show_date,
  show_location,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  title?: string;
  subtitle?: string;
  date?: string;
  location?: string;
  cover_image_url?: string;
  cta_text?: string;
  cta_url?: string;
  show_date?: boolean;
  show_location?: boolean;
}) {
  const displayTitle = title || 'Your Event Title Here';
  const displaySubtitle = subtitle || '';
  const displayDate = date || '';
  const displayLocation = location || '';
  const displayCtaText = cta_text || 'Register Now';
  const hasCoverImage = !!cover_image_url;

  // Build a background that incorporates cover_image_url when provided
  const resolvedBackground: SectionBackground | undefined = hasCoverImage
    ? { type: 'image', value: cover_image_url as string }
    : background;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height || '400px'}
      background={resolvedBackground}
      className="relative overflow-hidden"
    >
      {/* Overlay for readability when cover image is present */}
      {hasCoverImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      <div
        className={clsx(
          'relative z-10 flex flex-col gap-4',
          alignment === 'center' && 'items-center',
          alignment === 'right' && 'items-end',
          alignment !== 'center' && alignment !== 'right' && 'items-start',
        )}
      >
        {/* Title */}
        <h1
          className={clsx(
            'text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-tight',
            !title && 'opacity-50',
          )}
        >
          {displayTitle}
        </h1>

        {/* Subtitle */}
        {displaySubtitle && (
          <p className="text-lg sm:text-xl text-secondary max-w-2xl">
            {displaySubtitle}
          </p>
        )}

        {/* Date & Location row */}
        <div className="flex flex-wrap items-center gap-4 text-secondary">
          {show_date !== false && displayDate && (
            <span className="flex items-center gap-1.5 text-sm sm:text-base">
              <svg
                className="size-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {displayDate}
            </span>
          )}
          {show_location !== false && displayLocation && (
            <span className="flex items-center gap-1.5 text-sm sm:text-base">
              <svg
                className="size-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {displayLocation}
            </span>
          )}
        </div>

        {/* Placeholder hint when date/location are empty but toggled on */}
        {show_date !== false && !displayDate && show_location !== false && !displayLocation && (
          <p className="text-sm text-tertiary opacity-60">
            Add a date and location to display event details
          </p>
        )}

        {/* CTA Button */}
        <div className="mt-4">
          {cta_url ? (
            <a
              href={sanitizeHref(cta_url as string)}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              {displayCtaText}
            </a>
          ) : (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              {displayCtaText}
            </button>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

export const EventHero = React.memo(EventHeroInner);
EventHero.craft = {
  displayName: 'EventHero',
  props: {
    width: 'full',
    padding: 'xl',
    alignment: 'center',
    title: '',
    subtitle: '',
    date: '',
    location: '',
    cover_image_url: '',
    cta_text: 'Register Now',
    cta_url: '',
    show_date: true,
    show_location: true,
  },
};
