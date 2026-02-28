'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface Collectible {
  id: string;
  name: string;
  image_url?: string;
  price?: string;
  currency?: string;
  supply?: number;
  remaining?: number;
}

interface SpaceCollectiblesProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  heading?: string;
  description?: string;
  collectibles?: Collectible[];
  columns?: 2 | 3 | 4;
}

function CollectibleCard({ collectible }: { collectible: Collectible }) {
  const hasImage =
    collectible.image_url && collectible.image_url.trim().length > 0;
  const hasPrice = collectible.price && collectible.price.trim().length > 0;
  const hasSupply =
    typeof collectible.supply === 'number' && collectible.supply > 0;
  const currency = collectible.currency || 'ETH';

  return (
    <div className="group overflow-hidden rounded-md border border-card-border bg-primary/4 transition hover:border-primary/20">
      {/* Image */}
      {hasImage ? (
        <div className="aspect-square w-full overflow-hidden bg-primary/8">
          <img
            src={sanitizeMediaSrc(collectible.image_url)}
            alt={collectible.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-primary/4">
          <i className="icon-nft size-8 text-tertiary" />
        </div>
      )}

      {/* Details */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-primary line-clamp-1">
          {collectible.name || 'Untitled'}
        </h3>

        {/* Price */}
        {hasPrice && (
          <p className="mt-1.5 text-sm font-bold text-primary">
            {collectible.price} <span className="text-xs font-medium text-secondary">{currency}</span>
          </p>
        )}

        {/* Supply info */}
        {hasSupply && (
          <p className="mt-2 text-xs text-tertiary">
            {typeof collectible.remaining === 'number'
              ? `${collectible.remaining} / ${collectible.supply} remaining`
              : `${collectible.supply} total supply`}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-card-border bg-primary/4 px-6 py-12">
      <i className="icon-nft size-8 text-tertiary" />
      <p className="mt-3 text-sm font-medium text-secondary">No collectibles yet</p>
      <p className="mt-1 text-xs text-tertiary">
        Collectibles will appear here when they are created
      </p>
    </div>
  );
}

function _SpaceCollectibles({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = 'Collectibles',
  description = '',
  collectibles = [],
  columns = 3,
}: SpaceCollectiblesProps) {
  const hasCollectibles = collectibles.length > 0;
  const hasDescription = description && description.trim().length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          {heading || 'Collectibles'}
        </h2>
        {hasDescription && (
          <p className="mt-2 text-sm text-secondary">{description}</p>
        )}
      </div>

      {/* Collectibles grid or empty state */}
      {hasCollectibles ? (
        <div
          className={clsx(
            'grid gap-4',
            columns === 2 && 'grid-cols-1 sm:grid-cols-2',
            columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            columns === 4 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
          )}
        >
          {collectibles.map((collectible) => (
            <CollectibleCard key={collectible.id} collectible={collectible} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </SectionWrapper>
  );
}

export const SpaceCollectibles = React.memo(_SpaceCollectibles);
SpaceCollectibles.craft = {
  displayName: 'SpaceCollectibles',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Collectibles',
    description: '',
    collectibles: [],
    columns: 3,
  },
};
