'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface NavLink {
  label: string;
  url: string;
}

interface HeaderProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  logo_url?: string;
  logo_text?: string;
  nav_links?: NavLink[];
  cta_text?: string;
  cta_url?: string;
  is_sticky?: boolean;
  is_transparent?: boolean;
}

function _Header({
  width = 'full',
  padding = 'sm',
  alignment,
  min_height,
  background,
  logo_url = '',
  logo_text = '',
  nav_links = [],
  cta_text = '',
  cta_url = '',
  is_sticky = false,
  is_transparent = false,
}: HeaderProps) {
  const hasLogo = logo_url.trim().length > 0;
  const hasLogoText = logo_text.trim().length > 0;
  const hasNav = nav_links.length > 0;
  const hasCta = cta_text.trim().length > 0;
  const hasAnyContent = hasLogo || hasLogoText || hasNav || hasCta;

  return (
    <div
      className={clsx(
        is_sticky && 'sticky top-0 z-50',
        !is_transparent && 'bg-overlay-primary/80 backdrop-blur-md border-b border-card-border',
        is_transparent && 'bg-transparent',
      )}
    >
      <SectionWrapper
        width={width}
        padding={padding}
        alignment={alignment}
        min_height={min_height}
        background={is_transparent ? undefined : background}
      >
        {hasAnyContent ? (
          <nav className="flex items-center justify-between gap-6">
            {/* Logo area */}
            <div className="flex shrink-0 items-center gap-3">
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
              {!hasLogo && !hasLogoText && (
                <span className="text-lg font-bold text-primary">Logo</span>
              )}
            </div>

            {/* Navigation links */}
            {hasNav && (
              <div className="hidden items-center gap-6 md:flex">
                {nav_links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url || '#'}
                    className="text-sm font-medium text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* CTA button */}
            {hasCta && (
              <a
                href={cta_url || '#'}
                className="inline-flex shrink-0 items-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {cta_text}
              </a>
            )}
          </nav>
        ) : (
          <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[56px] px-6 py-3">
            <div className="flex items-center gap-2 text-center">
              <i className="icon-menu size-5 text-tertiary" />
              <p className="text-sm text-secondary">Header Navigation</p>
              <p className="text-xs text-tertiary">
                &mdash; Add a logo, nav links, and CTA button
              </p>
            </div>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}

export const Header = React.memo(_Header);
Header.craft = {
  displayName: 'Header',
  props: {
    width: 'full',
    padding: 'sm',
    logo_url: '',
    logo_text: '',
    nav_links: [],
    cta_text: '',
    cta_url: '',
    is_sticky: false,
    is_transparent: false,
  },
};
