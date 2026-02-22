'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface RequirementItem {
  label?: string;
  completed?: boolean;
}

interface PassportProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  description?: string;
  badge_image_url?: string;
  badge_name?: string;
  requirements?: RequirementItem[];
  cta_text?: string;
  cta_url?: string;
}

function _Passport({
  width = 'contained',
  padding = 'lg',
  alignment = 'center',
  min_height,
  background,
  heading = 'Event Passport',
  description = '',
  badge_image_url = '',
  badge_name = '',
  requirements = [],
  cta_text = 'Claim Passport',
  cta_url = '',
}: PassportProps) {
  const hasHeading = heading.trim().length > 0;
  const hasDescription = description.trim().length > 0;
  const hasBadgeImage = badge_image_url.trim().length > 0;
  const hasBadgeName = badge_name.trim().length > 0;
  const hasRequirements = requirements.length > 0;
  const hasCta = cta_text.trim().length > 0;

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
          'flex flex-col gap-6 rounded-xl border border-card-border bg-overlay-primary/40 px-8 py-10 md:px-12 md:py-14',
          alignment === 'center' && 'items-center',
          alignment === 'left' && 'items-start',
          alignment === 'right' && 'items-end',
        )}
      >
        {hasHeading && (
          <h2
            className={clsx(
              'text-2xl font-bold text-primary md:text-3xl',
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
              'max-w-lg text-base text-secondary',
              alignment === 'center' && 'text-center',
              alignment === 'right' && 'text-right',
            )}
          >
            {description}
          </p>
        )}

        {/* Badge image */}
        {hasBadgeImage ? (
          <img
            src={badge_image_url}
            alt={badge_name || 'Passport badge'}
            className="size-32 rounded-2xl object-cover shadow-lg md:size-40"
          />
        ) : (
          <div className="flex size-32 items-center justify-center rounded-2xl border border-dashed border-card-border bg-overlay-primary/40 md:size-40">
            <i className="icon-verified size-12 text-tertiary" />
          </div>
        )}

        {/* Badge name */}
        {hasBadgeName && (
          <p className="text-lg font-semibold text-primary">{badge_name}</p>
        )}

        {/* Requirements checklist */}
        {hasRequirements && (
          <div className="flex flex-col gap-2 w-full max-w-sm">
            {requirements.map((req, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg border border-card-border bg-overlay-primary/40 px-4 py-2.5"
              >
                <i
                  className={clsx(
                    'size-5 flex-shrink-0',
                    req.completed
                      ? 'icon-check-circle text-green-400'
                      : 'icon-radio-button-unchecked text-tertiary',
                  )}
                />
                <span
                  className={clsx(
                    'text-sm',
                    req.completed ? 'text-primary' : 'text-secondary',
                  )}
                >
                  {req.label || 'Requirement'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA button */}
        {hasCta && (
          <a
            href={cta_url || '#'}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <i className="icon-verified size-4" />
            {cta_text}
          </a>
        )}
      </div>
    </SectionWrapper>
  );
}

export const Passport = React.memo(_Passport);
Passport.craft = {
  displayName: 'Passport',
  props: {
    width: 'contained',
    padding: 'lg',
    alignment: 'center',
    heading: 'Event Passport',
    description: '',
    badge_image_url: '',
    badge_name: '',
    requirements: [],
    cta_text: 'Claim Passport',
    cta_url: '',
  },
};
