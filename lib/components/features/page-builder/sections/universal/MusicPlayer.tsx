'use client';

import React from 'react';

import { SectionWrapper } from '../SectionWrapper';
import { sanitizeIframeSrc, sanitizeMediaSrc } from '../../utils/sanitize-html';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

type EmbedType = 'spotify' | 'soundcloud' | 'custom';

interface MusicPlayerProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  track_url?: string;
  track_title?: string;
  artist_name?: string;
  cover_image_url?: string;
  embed_type?: EmbedType;
}

/**
 * Convert a Spotify track/album/playlist URL into an embed URL.
 * e.g. https://open.spotify.com/track/xxx -> https://open.spotify.com/embed/track/xxx
 */
function getSpotifyEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.includes('/embed/')) return trimmed;
  return trimmed.replace('open.spotify.com/', 'open.spotify.com/embed/');
}

/**
 * Convert a SoundCloud URL to an embed URL via their oEmbed-style iframe src.
 */
function getSoundCloudEmbedUrl(url: string): string {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.trim())}&color=%239333ea&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
}

function _MusicPlayer({
  width = 'contained',
  padding = 'md',
  alignment,
  min_height,
  background,
  heading = '',
  track_url = '',
  track_title = '',
  artist_name = '',
  cover_image_url = '',
  embed_type = 'custom',
}: MusicPlayerProps) {
  const hasHeading = heading.trim().length > 0;
  const hasUrl = track_url.trim().length > 0;
  const hasTrackInfo = track_title.trim().length > 0 || artist_name.trim().length > 0;

  // Render Spotify embed
  if (embed_type === 'spotify' && hasUrl) {
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
          <div className="w-full overflow-hidden rounded-xl">
            <iframe
              src={sanitizeIframeSrc(getSpotifyEmbedUrl(track_url))}
              title={track_title || 'Spotify embed'}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="w-full border-0"
              style={{ height: '352px' }}
              loading="lazy"
            />
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Render SoundCloud embed
  if (embed_type === 'soundcloud' && hasUrl) {
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
          <div className="w-full overflow-hidden rounded-xl">
            <iframe
              src={sanitizeIframeSrc(getSoundCloudEmbedUrl(track_url))}
              title={track_title || 'SoundCloud embed'}
              allow="autoplay"
              className="w-full border-0"
              style={{ height: '166px' }}
              loading="lazy"
            />
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Custom / static player card
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

        {hasTrackInfo || cover_image_url.trim().length > 0 ? (
          <div className="flex items-center gap-4 rounded-xl border border-card-border bg-overlay-primary/40 p-4">
            {/* Cover art */}
            {cover_image_url.trim().length > 0 ? (
              <img
                src={sanitizeMediaSrc(cover_image_url)}
                alt={track_title || 'Cover art'}
                className="size-20 flex-shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-20 flex-shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <i className="icon-music-note size-8 text-accent" />
              </div>
            )}

            {/* Track info */}
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              {track_title.trim().length > 0 && (
                <p className="text-base font-semibold text-primary truncate">
                  {track_title}
                </p>
              )}
              {artist_name.trim().length > 0 && (
                <p className="text-sm text-secondary truncate">{artist_name}</p>
              )}
              {/* Static progress bar */}
              <div className="mt-2 h-1 w-full rounded-full bg-card-border">
                <div className="h-full w-1/3 rounded-full bg-accent" />
              </div>
            </div>

            {/* Static play button */}
            <button
              type="button"
              className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white"
              aria-label="Play"
            >
              <i className="icon-play-arrow size-6" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[120px] px-6 py-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <i className="icon-music-note size-6 text-tertiary" />
              <p className="text-sm text-secondary">Music Player</p>
              <p className="text-xs text-tertiary">
                Add a track URL or embed a Spotify/SoundCloud player
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const MusicPlayer = React.memo(_MusicPlayer);
MusicPlayer.craft = {
  displayName: 'MusicPlayer',
  props: {
    width: 'contained',
    padding: 'md',
    heading: '',
    track_url: '',
    track_title: '',
    artist_name: '',
    cover_image_url: '',
    embed_type: 'custom',
  },
};
