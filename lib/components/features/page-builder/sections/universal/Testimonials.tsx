'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface TestimonialItem {
  quote?: string;
  author_name?: string;
  author_title?: string;
  author_avatar_url?: string;
  rating?: number;
}

type Columns = 1 | 2 | 3;

interface TestimonialsProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  testimonials?: TestimonialItem[];
  columns?: Columns;
}

const GRID_CLASSES: Record<Columns, string> = {
  1: 'grid-cols-1 max-w-2xl mx-auto',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
};

function StarRating({ rating }: { rating: number }) {
  const stars = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <i
          key={i}
          className={clsx(
            'icon-star size-4',
            i < stars ? 'text-yellow-400' : 'text-tertiary/30',
          )}
        />
      ))}
    </div>
  );
}

function _Testimonials({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = 'What People Say',
  testimonials = [],
  columns = 2,
}: TestimonialsProps) {
  const hasHeading = heading.trim().length > 0;
  const hasTestimonials = testimonials.length > 0;

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

        {hasTestimonials ? (
          <div className={clsx('grid gap-6', GRID_CLASSES[columns])}>
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 rounded-xl border border-card-border bg-overlay-primary/40 p-6"
              >
                {/* Large quote mark */}
                <span className="text-4xl leading-none text-accent font-serif select-none">
                  &ldquo;
                </span>

                {/* Quote text */}
                {t.quote && (
                  <p className="text-sm text-secondary leading-relaxed">{t.quote}</p>
                )}

                {/* Rating */}
                {typeof t.rating === 'number' && t.rating > 0 && (
                  <StarRating rating={t.rating} />
                )}

                {/* Author */}
                <div className="mt-auto flex items-center gap-3 pt-2 border-t border-card-border">
                  {t.author_avatar_url ? (
                    <img
                      src={t.author_avatar_url}
                      alt={t.author_name || ''}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <i className="icon-person size-5" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    {t.author_name && (
                      <span className="text-sm font-semibold text-primary">
                        {t.author_name}
                      </span>
                    )}
                    {t.author_title && (
                      <span className="text-xs text-tertiary">{t.author_title}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[160px] px-6 py-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <i className="icon-format-quote size-6 text-tertiary" />
              <p className="text-sm text-secondary">Testimonials</p>
              <p className="text-xs text-tertiary">
                Add testimonials to showcase what people say
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const Testimonials = React.memo(_Testimonials);
Testimonials.craft = {
  displayName: 'Testimonials',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'What People Say',
    testimonials: [],
    columns: 2,
  },
};
