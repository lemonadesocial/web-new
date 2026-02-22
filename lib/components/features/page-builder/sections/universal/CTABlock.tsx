'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface CTABlockProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  description?: string;
  primary_cta_text?: string;
  primary_cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  accent_color?: string;
}

function _CTABlock({
  width = 'contained',
  padding = 'lg',
  alignment = 'center',
  min_height,
  background,
  heading = '',
  description = '',
  primary_cta_text = 'Get Started',
  primary_cta_url = '',
  secondary_cta_text = '',
  secondary_cta_url = '',
  accent_color = '',
}: CTABlockProps) {
  const hasHeading = heading.trim().length > 0;
  const hasDescription = description.trim().length > 0;
  const hasContent = hasHeading || hasDescription;
  const hasSecondary = secondary_cta_text.trim().length > 0;

  const accentStyle = accent_color
    ? { backgroundColor: accent_color }
    : undefined;

  const accentHoverStyle = accent_color
    ? { backgroundColor: accent_color, filter: 'brightness(0.85)' }
    : undefined;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {hasContent ? (
        <div
          className={clsx(
            'flex flex-col gap-6 rounded-xl border border-card-border bg-overlay-primary/40 px-8 py-12 md:px-12 md:py-16',
            alignment === 'center' && 'items-center',
            alignment === 'left' && 'items-start',
            alignment === 'right' && 'items-end',
          )}
        >
          {hasHeading && (
            <h2
              className={clsx(
                'text-2xl font-bold text-primary md:text-4xl',
                alignment === 'center' && 'text-center',
                alignment === 'right' && 'text-right',
              )}
            >
              {heading}
            </h2>
          )}

          {hasDescription && (
            <p
              className={clsx(
                'max-w-2xl text-base text-secondary md:text-lg',
                alignment === 'center' && 'text-center',
                alignment === 'right' && 'text-right',
              )}
            >
              {description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <a
              href={primary_cta_url || '#'}
              className={clsx(
                'inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold transition-all',
                !accent_color && 'bg-accent text-white hover:opacity-90',
                accent_color && 'text-white hover:brightness-90',
              )}
              style={accent_color ? accentStyle : undefined}
              onMouseEnter={
                accent_color
                  ? (e) => {
                      Object.assign(e.currentTarget.style, accentHoverStyle);
                    }
                  : undefined
              }
              onMouseLeave={
                accent_color
                  ? (e) => {
                      Object.assign(e.currentTarget.style, accentStyle!);
                    }
                  : undefined
              }
            >
              {primary_cta_text}
            </a>

            {hasSecondary && (
              <a
                href={secondary_cta_url || '#'}
                className="inline-flex items-center rounded-lg border border-card-border bg-transparent px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-overlay-primary"
              >
                {secondary_cta_text}
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[160px] px-6 py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <i className="icon-campaign size-6 text-tertiary" />
            <p className="text-sm text-secondary">Call to Action</p>
            <p className="text-xs text-tertiary">
              Add a heading and description for your CTA block
            </p>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

export const CTABlock = React.memo(_CTABlock);
CTABlock.craft = {
  displayName: 'CTABlock',
  props: {
    width: 'contained',
    padding: 'lg',
    alignment: 'center',
    heading: '',
    description: '',
    primary_cta_text: 'Get Started',
    primary_cta_url: '',
    secondary_cta_text: '',
    secondary_cta_url: '',
    accent_color: '',
  },
};
