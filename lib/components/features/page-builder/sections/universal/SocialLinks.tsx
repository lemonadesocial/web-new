'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface SocialLinkItem {
  platform?: string;
  url?: string;
  label?: string;
}

type IconSize = 'sm' | 'md' | 'lg';
type LinkStyle = 'icons-only' | 'with-labels' | 'buttons';

interface SocialLinksProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  links?: SocialLinkItem[];
  icon_size?: IconSize;
  style?: LinkStyle;
}

const ICON_SIZE_CLASSES: Record<IconSize, string> = {
  sm: 'size-5',
  md: 'size-6',
  lg: 'size-8',
};

const PLATFORM_ICON_MAP: Record<string, string> = {
  twitter: 'icon-twitter',
  x: 'icon-twitter',
  facebook: 'icon-facebook',
  instagram: 'icon-instagram',
  linkedin: 'icon-linkedin',
  youtube: 'icon-youtube',
  discord: 'icon-discord',
  telegram: 'icon-telegram',
  github: 'icon-github',
  tiktok: 'icon-tiktok',
};

function getPlatformIcon(platform?: string): string {
  if (!platform) return 'icon-link';
  return PLATFORM_ICON_MAP[platform.toLowerCase()] ?? 'icon-link';
}

function getPlatformLabel(link: SocialLinkItem): string {
  if (link.label?.trim()) return link.label;
  if (link.platform?.trim()) {
    return link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
  }
  return 'Link';
}

function _SocialLinks({
  width = 'contained',
  padding = 'md',
  alignment = 'center',
  min_height,
  background,
  heading = '',
  links = [],
  icon_size = 'md',
  style = 'icons-only',
}: SocialLinksProps) {
  const hasHeading = heading.trim().length > 0;
  const hasLinks = links.length > 0;

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
          'flex flex-col gap-4',
          alignment === 'center' && 'items-center',
          alignment === 'right' && 'items-end',
        )}
      >
        {hasHeading && (
          <h2 className="text-xl font-bold text-primary md:text-2xl">{heading}</h2>
        )}

        {hasLinks ? (
          <div className="flex flex-wrap items-center gap-3">
            {links.map((link, idx) => {
              const iconClass = getPlatformIcon(link.platform);
              const label = getPlatformLabel(link);

              if (style === 'buttons') {
                return (
                  <a
                    key={idx}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-overlay-primary/40 px-4 py-2 text-sm text-primary transition-colors hover:border-accent hover:text-accent"
                  >
                    <i className={clsx(iconClass, ICON_SIZE_CLASSES[icon_size])} />
                    <span>{label}</span>
                  </a>
                );
              }

              if (style === 'with-labels') {
                return (
                  <a
                    key={idx}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex items-center gap-2 text-secondary transition-colors hover:text-accent"
                  >
                    <i className={clsx(iconClass, ICON_SIZE_CLASSES[icon_size])} />
                    <span className="text-sm">{label}</span>
                  </a>
                );
              }

              // icons-only (default)
              return (
                <a
                  key={idx}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center text-secondary transition-colors hover:text-accent"
                >
                  <i className={clsx(iconClass, ICON_SIZE_CLASSES[icon_size])} />
                </a>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[80px] w-full px-6 py-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <i className="icon-share size-6 text-tertiary" />
              <p className="text-sm text-secondary">Social Links</p>
              <p className="text-xs text-tertiary">
                Add your social media links
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const SocialLinks = React.memo(_SocialLinks);
SocialLinks.craft = {
  displayName: 'SocialLinks',
  props: {
    width: 'contained',
    padding: 'md',
    alignment: 'center',
    heading: '',
    links: [],
    icon_size: 'md',
    style: 'icons-only',
  },
};
