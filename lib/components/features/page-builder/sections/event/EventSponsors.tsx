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

interface Sponsor {
  id?: string;
  name: string;
  logo_url?: string;
  url?: string;
}

interface SponsorTier {
  name: string;
  sponsors: Sponsor[];
}

/** Larger logo sizes for top-tier sponsors. */
const TIER_SIZE_MAP: Record<string, string> = {
  platinum: 'h-20 sm:h-24',
  gold: 'h-16 sm:h-20',
  silver: 'h-12 sm:h-16',
  bronze: 'h-10 sm:h-12',
};

function logoSizeForTier(tierName: string): string {
  const key = tierName.toLowerCase().trim();
  return TIER_SIZE_MAP[key] || 'h-12 sm:h-14';
}

function EventSponsorsInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  tiers,
  show_tier_labels,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  tiers?: SponsorTier[];
  show_tier_labels?: boolean;
}) {
  const displayHeading = heading || 'Sponsors';
  const tierList = Array.isArray(tiers) ? (tiers as SponsorTier[]) : [];
  const hasTiers = tierList.length > 0 && tierList.some((t) => t.sponsors?.length > 0);

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

        {hasTiers ? (
          <div className="flex flex-col gap-10">
            {tierList.map((tier, tierIdx) => {
              if (!tier.sponsors || tier.sponsors.length === 0) return null;
              const sizeClass = logoSizeForTier(tier.name);

              return (
                <div key={`tier-${tierIdx}`} className="flex flex-col gap-4">
                  {show_tier_labels !== false && (
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">
                      {tier.name}
                    </h3>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                    {tier.sponsors.map((sponsor, sIdx) => {
                      const content = sponsor.logo_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={sanitizeMediaSrc(sponsor.logo_url)}
                          alt={sponsor.name}
                          className={clsx(
                            'w-auto object-contain opacity-80 transition-opacity hover:opacity-100',
                            sizeClass,
                          )}
                        />
                      ) : (
                        <div
                          className={clsx(
                            'flex items-center justify-center rounded-lg border border-card-border bg-primary/4 px-6',
                            sizeClass,
                          )}
                        >
                          <span className="text-sm font-medium text-secondary">
                            {sponsor.name}
                          </span>
                        </div>
                      );

                      return sponsor.url ? (
                        <a
                          key={sponsor.id || `sponsor-${sIdx}`}
                          href={sanitizeHref(sponsor.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          {content}
                        </a>
                      ) : (
                        <div key={sponsor.id || `sponsor-${sIdx}`}>
                          {content}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
              <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.257.26-2.456.716-3.418" />
            </svg>
            <p className="text-sm font-medium text-secondary">
              No sponsors configured
            </p>
            <p className="text-xs text-tertiary mt-1">
              Add sponsor tiers and logos to showcase your partners
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventSponsors = React.memo(EventSponsorsInner);
EventSponsors.craft = {
  displayName: 'EventSponsors',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Sponsors',
    tiers: [],
    show_tier_labels: true,
  },
};
