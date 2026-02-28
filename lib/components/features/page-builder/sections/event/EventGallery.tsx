'use client';

import React from 'react';
import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

function EventGalleryInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  images,
  columns,
  aspect_ratio,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  images?: GalleryImage[];
  columns?: 2 | 3 | 4;
  aspect_ratio?: 'square' | 'landscape' | 'auto';
}) {
  const displayHeading = heading || 'Gallery';
  const imageList = Array.isArray(images) ? (images as GalleryImage[]) : [];
  const hasImages = imageList.length > 0;
  const cols = columns || 3;
  const ratio = aspect_ratio || 'auto';

  const gridColsClass =
    cols === 2
      ? 'sm:grid-cols-2'
      : cols === 4
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : 'sm:grid-cols-2 lg:grid-cols-3';

  const aspectClass =
    ratio === 'square'
      ? 'aspect-square'
      : ratio === 'landscape'
        ? 'aspect-video'
        : '';

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

        {hasImages ? (
          <div className={clsx('grid gap-4', gridColsClass)}>
            {imageList.map((image, index) => (
              <div
                key={`gallery-${index}`}
                className={clsx(
                  'group relative overflow-hidden rounded-lg',
                  aspectClass,
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sanitizeMediaSrc(image.url)}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  className={clsx(
                    'w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105',
                    aspectClass ? 'h-full' : 'h-auto',
                  )}
                />

                {/* Caption overlay on hover */}
                {image.caption && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="p-4 text-sm font-medium text-white">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty placeholder */
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-card-border bg-primary/4 px-6 py-12">
            <svg
              className="size-8 text-tertiary mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <p className="text-sm font-medium text-secondary">
              No images added
            </p>
            <p className="text-xs text-tertiary mt-1">
              Add images to create your event gallery
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventGallery = React.memo(EventGalleryInner);
EventGallery.craft = {
  displayName: 'EventGallery',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Gallery',
    images: [],
    columns: 3,
    aspect_ratio: 'auto',
  },
};
