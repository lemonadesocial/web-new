'use client';

import React from 'react';
import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface Collectible {
  id?: string;
  name: string;
  image_url?: string;
  price?: number;
  currency?: string;
  rarity?: string;
}

const RARITY_STYLES: Record<string, string> = {
  common: 'bg-neutral-500/15 text-neutral-400',
  uncommon: 'bg-green-500/15 text-green-400',
  rare: 'bg-blue-500/15 text-blue-400',
  epic: 'bg-purple-500/15 text-purple-400',
  legendary: 'bg-amber-500/15 text-amber-400',
};

function rarityClass(rarity?: string): string {
  if (!rarity) return '';
  return RARITY_STYLES[rarity.toLowerCase().trim()] || 'bg-primary/10 text-secondary';
}

function _EventCollectibles({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  description,
  collectibles,
  columns,
  ...rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  description?: string;
  collectibles?: Collectible[];
  columns?: 2 | 3;
}) {
  const displayHeading = heading || 'Collectibles';
  const collectibleList = Array.isArray(collectibles)
    ? (collectibles as Collectible[])
    : [];
  const hasCollectibles = collectibleList.length > 0;
  const cols = columns || 3;

  const gridColsClass =
    cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  function formatPrice(price?: number, currency?: string): string {
    if (price == null) return '';
    if (price === 0) return 'Free';
    const cur = currency || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price);
    } catch {
      return `${price} ${cur}`;
    }
  }

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
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            {displayHeading}
          </h2>
          {description && (
            <p className="text-secondary text-sm sm:text-base max-w-xl">
              {description}
            </p>
          )}
        </div>

        {hasCollectibles ? (
          <div className={clsx('grid gap-6', gridColsClass)}>
            {collectibleList.map((item, index) => (
              <div
                key={item.id || `collectible-${index}`}
                className="flex flex-col overflow-hidden rounded-lg border border-card-border bg-primary/4 transition-colors hover:border-primary/30"
              >
                {/* Image */}
                {item.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-overlay-primary">
                    <svg
                      className="size-12 text-tertiary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-primary">
                      {item.name || 'Collectible'}
                    </h3>
                    {item.rarity && (
                      <span
                        className={clsx(
                          'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                          rarityClass(item.rarity),
                        )}
                      >
                        {item.rarity}
                      </span>
                    )}
                  </div>

                  {(item.price != null || item.currency) && (
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  )}
                </div>
              </div>
            ))}
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
              <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <p className="text-sm font-medium text-secondary">
              No collectibles added
            </p>
            <p className="text-xs text-tertiary mt-1">
              Add NFTs or collectibles to showcase for your event
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventCollectibles = React.memo(_EventCollectibles);
EventCollectibles.craft = {
  displayName: 'EventCollectibles',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Collectibles',
    description: '',
    collectibles: [],
    columns: 3,
  },
};
