'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  logo_url?: string;
  logo_text?: string;
  columns?: FooterColumn[];
  social_links?: SocialLink[];
  copyright_text?: string;
  show_powered_by?: boolean;
}

/** Map well-known platform names to icon class names. */
const SOCIAL_ICON_MAP: Record<string, string> = {
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

function _Footer({
  width = 'full',
  padding = 'lg',
  alignment,
  min_height,
  background,
  logo_url = '',
  logo_text = '',
  columns = [],
  social_links = [],
  copyright_text = '',
  show_powered_by = true,
}: FooterProps) {
  const hasLogo = logo_url.trim().length > 0;
  const hasLogoText = logo_text.trim().length > 0;
  const hasColumns = columns.length > 0;
  const hasSocial = social_links.length > 0;
  const hasCopyright = copyright_text.trim().length > 0;
  const hasAnyContent = hasLogo || hasLogoText || hasColumns || hasSocial || hasCopyright;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {hasAnyContent ? (
        <footer className="flex flex-col gap-10">
          {/* Top row: logo + columns */}
          <div
            className={clsx(
              'flex flex-col gap-10 md:flex-row md:justify-between',
              hasColumns && 'md:items-start',
            )}
          >
            {/* Logo / brand area */}
            {(hasLogo || hasLogoText) && (
              <div className="flex shrink-0 flex-col gap-2">
                {hasLogo && (
                  <img
                    src={logo_url}
                    alt={logo_text || 'Logo'}
                    className="h-8 w-auto object-contain"
                  />
                )}
                {hasLogoText && (
                  <span className="text-lg font-bold text-primary">{logo_text}</span>
                )}
              </div>
            )}

            {/* Link columns */}
            {hasColumns && (
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-12">
                {columns.map((col, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
                      {col.title}
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {col.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.url || '#'}
                            className="text-sm text-secondary transition-colors hover:text-primary"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-card-border" />

          {/* Bottom row: social + copyright + powered by */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Social links */}
            {hasSocial && (
              <div className="flex items-center gap-4">
                {social_links.map((social, index) => {
                  const iconClass =
                    SOCIAL_ICON_MAP[social.platform.toLowerCase()] || 'icon-link';
                  return (
                    <a
                      key={index}
                      href={social.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="text-secondary transition-colors hover:text-primary"
                    >
                      <i className={clsx(iconClass, 'size-5')} />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Copyright */}
            {hasCopyright && (
              <p className="text-xs text-tertiary">{copyright_text}</p>
            )}

            {/* Powered by badge */}
            {show_powered_by && (
              <p className="text-xs text-tertiary">
                Powered by{' '}
                <a
                  href="https://lemonade.social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-secondary transition-colors hover:text-primary"
                >
                  Lemonade
                </a>
              </p>
            )}
          </div>
        </footer>
      ) : (
        <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[120px] px-6 py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <i className="icon-dock-to-bottom size-6 text-tertiary" />
            <p className="text-sm text-secondary">Footer</p>
            <p className="text-xs text-tertiary">
              Add a logo, link columns, social links, and copyright text
            </p>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

export const Footer = React.memo(_Footer);
Footer.craft = {
  displayName: 'Footer',
  props: {
    width: 'full',
    padding: 'lg',
    logo_url: '',
    logo_text: '',
    columns: [],
    social_links: [],
    copyright_text: '',
    show_powered_by: true,
  },
};
