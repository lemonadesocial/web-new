'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHref, sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface SpaceHeroProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  name?: string;
  tagline?: string;
  avatar_url?: string;
  cover_image_url?: string;
  member_count?: number;
  cta_text?: string;
  cta_url?: string;
  show_member_count?: boolean;
}

function _SpaceHero({
  width = 'full',
  padding = 'xl',
  alignment = 'center',
  min_height,
  background,
  name,
  tagline,
  avatar_url,
  cover_image_url,
  member_count = 0,
  cta_text = 'Join Space',
  cta_url,
  show_member_count = true,
}: SpaceHeroProps) {
  const hasName = name && name.trim().length > 0;
  const hasTagline = tagline && tagline.trim().length > 0;
  const hasAvatar = avatar_url && avatar_url.trim().length > 0;
  const hasCover = cover_image_url && cover_image_url.trim().length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
      className="relative overflow-hidden"
    >
      {/* Cover image background */}
      {hasCover && (
        <div className="absolute inset-0 z-0">
          <img
            src={sanitizeMediaSrc(cover_image_url)}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Content */}
      <div
        className={clsx(
          'relative z-10 flex flex-col gap-6',
          alignment === 'center' && 'items-center',
          alignment === 'left' && 'items-start',
          alignment === 'right' && 'items-end',
        )}
      >
        {/* Avatar / Logo */}
        {hasAvatar ? (
          <img
            src={sanitizeMediaSrc(avatar_url)}
            alt={hasName ? name : 'Space avatar'}
            className="size-24 rounded-full border-2 border-card-border object-cover"
          />
        ) : (
          <div className="flex size-24 items-center justify-center rounded-full border-2 border-dashed border-card-border bg-primary/4">
            <i className="icon-community size-10 text-tertiary" />
          </div>
        )}

        {/* Name */}
        {hasName ? (
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            {name}
          </h1>
        ) : (
          <h1 className="text-4xl font-bold tracking-tight text-tertiary">
            Space Name
          </h1>
        )}

        {/* Tagline */}
        {hasTagline ? (
          <p className="max-w-xl text-lg text-secondary">{tagline}</p>
        ) : (
          <p className="max-w-xl text-lg text-tertiary">
            Add a tagline for your space
          </p>
        )}

        {/* Member count badge */}
        {show_member_count && (
          <div className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1">
            <i className="icon-community size-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              {member_count > 0
                ? `${member_count.toLocaleString()} member${member_count !== 1 ? 's' : ''}`
                : '0 members'}
            </span>
          </div>
        )}

        {/* CTA Button */}
        <a
          href={sanitizeHref(cta_url)}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          {cta_text || 'Join Space'}
        </a>
      </div>
    </SectionWrapper>
  );
}

export const SpaceHero = React.memo(_SpaceHero);
SpaceHero.craft = {
  displayName: 'SpaceHero',
  props: {
    width: 'full',
    padding: 'xl',
    alignment: 'center',
    name: '',
    tagline: '',
    avatar_url: '',
    cover_image_url: '',
    member_count: 0,
    cta_text: 'Join Space',
    cta_url: '',
    show_member_count: true,
  },
};
