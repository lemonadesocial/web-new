'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface CardItem {
  title?: string;
  description?: string;
  image_url?: string;
  url?: string;
  badge?: string;
}

type Columns = 2 | 3 | 4;

interface CardsGridProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  cards?: CardItem[];
  columns?: Columns;
}

const GRID_CLASSES: Record<Columns, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

function _CardsGrid({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = '',
  cards = [],
  columns = 3,
}: CardsGridProps) {
  const hasHeading = heading.trim().length > 0;
  const hasCards = cards.length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div className="flex flex-col gap-8">
        {hasHeading && (
          <h2 className="text-2xl font-bold text-primary md:text-3xl">{heading}</h2>
        )}

        {hasCards ? (
          <div className={clsx('grid gap-6', GRID_CLASSES[columns])}>
            {cards.map((card, idx) => {
              const inner = (
                <div
                  className={clsx(
                    'group flex flex-col overflow-hidden rounded-xl border border-card-border bg-overlay-primary/40 transition-all',
                    card.url && 'hover:border-accent hover:-translate-y-0.5 hover:shadow-lg',
                  )}
                >
                  {/* Image */}
                  {card.image_url ? (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={card.image_url}
                        alt={card.title || ''}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      {card.badge && (
                        <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                          {card.badge}
                        </span>
                      )}
                    </div>
                  ) : card.badge ? (
                    <div className="px-5 pt-5">
                      <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                        {card.badge}
                      </span>
                    </div>
                  ) : null}

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    {card.title && (
                      <h3 className="text-base font-semibold text-primary">{card.title}</h3>
                    )}
                    {card.description && (
                      <p className="text-sm text-secondary line-clamp-3">{card.description}</p>
                    )}
                  </div>
                </div>
              );

              if (card.url) {
                return (
                  <a key={idx} href={card.url} className="block no-underline">
                    {inner}
                  </a>
                );
              }
              return <div key={idx}>{inner}</div>;
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[160px] px-6 py-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <i className="icon-grid-view size-6 text-tertiary" />
              <p className="text-sm text-secondary">Content Cards</p>
              <p className="text-xs text-tertiary">
                Add cards to build your content grid
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const CardsGrid = React.memo(_CardsGrid);
CardsGrid.craft = {
  displayName: 'CardsGrid',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: '',
    cards: [],
    columns: 3,
  },
};
