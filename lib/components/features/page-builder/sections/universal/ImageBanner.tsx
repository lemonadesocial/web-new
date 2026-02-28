'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHref } from '../../utils/sanitize-html';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

type AspectRatio = '16/9' | '21/9' | '4/3' | 'auto';

interface ImageBannerProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  image_url?: string;
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_url?: string;
  overlay_opacity?: number;
  aspect_ratio?: AspectRatio;
}

const ASPECT_RATIO_CLASSES: Record<AspectRatio, string> = {
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
  '4/3': 'aspect-[4/3]',
  auto: '',
};

function _ImageBanner({
  width = 'full',
  padding = 'none',
  alignment = 'center',
  min_height,
  background,
  image_url = '',
  title = '',
  subtitle = '',
  cta_text = '',
  cta_url = '',
  overlay_opacity = 40,
  aspect_ratio = '16/9',
}: ImageBannerProps) {
  const hasImage = image_url.trim().length > 0;
  const hasTitle = title.trim().length > 0;
  const hasSubtitle = subtitle.trim().length > 0;
  const hasCta = cta_text.trim().length > 0;
  const hasOverlayContent = hasTitle || hasSubtitle || hasCta;

  const clampedOpacity = Math.min(100, Math.max(0, overlay_opacity)) / 100;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {hasImage ? (
        <div
          className={clsx(
            'relative w-full overflow-hidden rounded-lg',
            ASPECT_RATIO_CLASSES[aspect_ratio],
            aspect_ratio === 'auto' && 'min-h-[300px]',
          )}
        >
          {/* Background image */}
          <img
            src={image_url}
            alt={title || 'Banner image'}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Gradient overlay */}
          {hasOverlayContent && (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,${clampedOpacity}) 0%, rgba(0,0,0,${clampedOpacity * 0.5}) 50%, transparent 100%)`,
              }}
            />
          )}

          {/* Content overlay */}
          {hasOverlayContent && (
            <div
              className={clsx(
                'absolute inset-0 flex flex-col items-center justify-end gap-4 p-8 md:p-12',
                alignment === 'left' && 'items-start',
                alignment === 'right' && 'items-end',
              )}
            >
              {hasTitle && (
                <h2 className="text-3xl font-bold text-white md:text-5xl drop-shadow-lg">
                  {title}
                </h2>
              )}
              {hasSubtitle && (
                <p className="max-w-2xl text-lg text-white/90 md:text-xl drop-shadow-md">
                  {subtitle}
                </p>
              )}
              {hasCta && (
                <a
                  href={sanitizeHref(cta_url)}
                  className="mt-2 inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                  {cta_text}
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={clsx(
            'relative flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 overflow-hidden',
            ASPECT_RATIO_CLASSES[aspect_ratio],
            aspect_ratio === 'auto' && 'min-h-[300px]',
          )}
        >
          <div className="flex flex-col items-center gap-2 text-center p-8">
            <i className="icon-image size-8 text-tertiary" />
            <p className="text-sm text-secondary">Add a banner image</p>
            <p className="text-xs text-tertiary">
              Upload or paste an image URL to create your banner
            </p>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

export const ImageBanner = React.memo(_ImageBanner);
ImageBanner.craft = {
  displayName: 'ImageBanner',
  props: {
    width: 'full',
    padding: 'none',
    alignment: 'center',
    image_url: '',
    title: '',
    subtitle: '',
    cta_text: '',
    cta_url: '',
    overlay_opacity: 40,
    aspect_ratio: '16/9',
  },
};
