'use client';

import React from 'react';
import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeIframeSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

function EventLocationInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  venue_name,
  address,
  city,
  description,
  map_embed_url,
  image_url,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  venue_name?: string;
  address?: string;
  city?: string;
  description?: string;
  map_embed_url?: string;
  image_url?: string;
}) {
  const displayHeading = heading || 'Location';
  const hasVenueInfo = !!(venue_name || address || city || description);
  const hasVisual = !!(map_embed_url || image_url);

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          {displayHeading}
        </h2>

        <div
          className={clsx(
            'grid gap-8',
            hasVisual || (!hasVenueInfo) ? 'md:grid-cols-2' : '',
          )}
        >
          {/* Left: Venue info */}
          <div className="flex flex-col gap-4">
            {venue_name ? (
              <h3 className="text-lg font-semibold text-primary">
                {venue_name}
              </h3>
            ) : (
              <p className="text-sm text-tertiary opacity-60">
                Add a venue name
              </p>
            )}

            {(address || city) && (
              <div className="flex items-start gap-2 text-secondary">
                <svg
                  className="size-5 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="flex flex-col">
                  {address && (
                    <span className="text-sm">{address}</span>
                  )}
                  {city && (
                    <span className="text-sm">{city}</span>
                  )}
                </div>
              </div>
            )}

            {description && (
              <p className="text-sm text-secondary leading-relaxed">
                {description}
              </p>
            )}

            {!hasVenueInfo && (
              <p className="text-sm text-tertiary opacity-60">
                Add venue details to display location information
              </p>
            )}
          </div>

          {/* Right: Map / Image / Placeholder */}
          <div className="overflow-hidden rounded-lg">
            {map_embed_url ? (
              <iframe
                src={sanitizeIframeSrc(map_embed_url as string)}
                title="Event location map"
                className="h-64 w-full rounded-lg border-0 md:h-full md:min-h-[280px]"
                loading="lazy"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin"
              />
            ) : image_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={image_url}
                alt={venue_name || displayHeading}
                className="h-64 w-full rounded-lg object-cover md:h-full md:min-h-[280px]"
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-card-border bg-primary/4 md:h-full md:min-h-[280px]">
                <div className="flex flex-col items-center gap-2 text-center px-4">
                  <svg
                    className="size-8 text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p className="text-xs text-tertiary">
                    Add a map embed URL or image to display here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export const EventLocation = React.memo(EventLocationInner);
EventLocation.craft = {
  displayName: 'EventLocation',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Location',
    venue_name: '',
    address: '',
    city: '',
    description: '',
    map_embed_url: '',
    image_url: '',
  },
};
