'use client';

import React from 'react';
import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHtml, sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

function EventAboutInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  description,
  image_url,
  image_position,
  show_image,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  description?: string;
  image_url?: string;
  image_position?: 'left' | 'right';
  show_image?: boolean;
}) {
  const displayHeading = heading || 'About This Event';
  const hasDescription = !!description;
  const hasImage = show_image !== false && !!image_url;
  const imgPosition = image_position || 'right';

  // Determine if we use a two-column layout
  const useTwoColumns = hasImage;

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
          useTwoColumns
            ? 'grid gap-8 md:grid-cols-2 items-start'
            : 'flex flex-col gap-6',
        )}
      >
        {/* Text content */}
        <div
          className={clsx(
            'flex flex-col gap-4',
            useTwoColumns && imgPosition === 'left' && 'md:order-2',
          )}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            {displayHeading}
          </h2>

          {hasDescription ? (
            <div
              className="prose prose-invert prose-sm sm:prose-base max-w-none text-secondary [&_h1]:text-primary [&_h2]:text-primary [&_h3]:text-primary [&_strong]:text-primary [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description as string) }}
            />
          ) : (
            <p className="text-sm text-tertiary opacity-60">
              Add a description to tell attendees about your event
            </p>
          )}
        </div>

        {/* Image */}
        {useTwoColumns && (
          <div
            className={clsx(
              'overflow-hidden rounded-lg',
              imgPosition === 'left' && 'md:order-1',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sanitizeMediaSrc(image_url)}
              alt={displayHeading}
              className="h-auto w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* Image placeholder when show_image is on but no URL provided */}
        {show_image !== false && !image_url && (
          <div
            className={clsx(
              'flex items-center justify-center rounded-lg border border-dashed border-card-border bg-primary/4 min-h-[200px]',
              imgPosition === 'left' && 'md:order-1',
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <svg
                className="size-8 text-tertiary"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <p className="text-xs text-tertiary">
                Add an image URL to display here
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventAbout = React.memo(EventAboutInner);
EventAbout.craft = {
  displayName: 'EventAbout',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'About This Event',
    description: '',
    image_url: '',
    image_position: 'right',
    show_image: true,
  },
};
