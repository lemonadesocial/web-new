'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeIframeSrc } from '../../utils/sanitize-html';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

type AspectRatio = '16/9' | '4/3' | '1/1';

interface VideoEmbedProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  video_url?: string;
  aspect_ratio?: AspectRatio;
  autoplay?: boolean;
  muted?: boolean;
}

const ASPECT_CLASSES: Record<AspectRatio, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
};

/**
 * Extract an embeddable URL from a YouTube or Vimeo link.
 * Falls back to the original URL for everything else.
 */
function getEmbedUrl(
  url: string,
  autoplay: boolean,
  muted: boolean,
): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  // YouTube
  const ytMatch =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/) ?? null;
  if (ytMatch) {
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('mute', '1');
    const qs = params.toString();
    return `https://www.youtube.com/embed/${ytMatch[1]}${qs ? `?${qs}` : ''}`;
  }

  // Vimeo
  const vimeoMatch =
    trimmed.match(/(?:vimeo\.com\/)(\d+)/) ?? null;
  if (vimeoMatch) {
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    const qs = params.toString();
    return `https://player.vimeo.com/video/${vimeoMatch[1]}${qs ? `?${qs}` : ''}`;
  }

  return sanitizeIframeSrc(trimmed);
}

function _VideoEmbed({
  width = 'contained',
  padding = 'md',
  alignment,
  min_height,
  background,
  heading = '',
  video_url = '',
  aspect_ratio = '16/9',
  autoplay = false,
  muted = true,
}: VideoEmbedProps) {
  const hasHeading = heading.trim().length > 0;
  const embedUrl = getEmbedUrl(video_url, autoplay, muted);
  const hasVideo = embedUrl.length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div className="flex flex-col gap-4">
        {hasHeading && (
          <h2 className="text-xl font-bold text-primary md:text-2xl">{heading}</h2>
        )}

        {hasVideo ? (
          <div
            className={clsx(
              'relative w-full overflow-hidden rounded-lg',
              ASPECT_CLASSES[aspect_ratio],
            )}
          >
            <iframe
              src={embedUrl}
              title={heading || 'Embedded video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : (
          <div
            className={clsx(
              'flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 overflow-hidden',
              ASPECT_CLASSES[aspect_ratio],
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center p-8">
              <i className="icon-play-circle size-8 text-tertiary" />
              <p className="text-sm text-secondary">Add a video</p>
              <p className="text-xs text-tertiary">
                Paste a YouTube, Vimeo, or video URL
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const VideoEmbed = React.memo(_VideoEmbed);
VideoEmbed.craft = {
  displayName: 'VideoEmbed',
  props: {
    width: 'contained',
    padding: 'md',
    heading: '',
    video_url: '',
    aspect_ratio: '16/9',
    autoplay: false,
    muted: true,
  },
};
