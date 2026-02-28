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

interface TicketTier {
  name: string;
  price?: number;
  currency?: string;
  description?: string;
  available?: number;
  sold_out?: boolean;
}

function EventRegistrationInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  description,
  tickets,
  show_prices,
  show_descriptions,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  description?: string;
  tickets?: TicketTier[];
  show_prices?: boolean;
  show_descriptions?: boolean;
}) {
  const displayHeading = heading || 'Registration';
  const ticketList = Array.isArray(tickets) ? (tickets as TicketTier[]) : [];
  const hasTickets = ticketList.length > 0;

  function formatPrice(price?: number, currency?: string): string {
    if (price == null) return 'Free';
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
        <div
          className={clsx(
            'flex flex-col gap-2',
            alignment === 'center' && 'items-center',
            alignment === 'right' && 'items-end',
          )}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            {displayHeading}
          </h2>
          {description && (
            <p className="text-secondary text-sm sm:text-base max-w-xl">
              {description}
            </p>
          )}
        </div>

        {/* Ticket list */}
        {hasTickets ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ticketList.map((ticket, index) => {
              const isSoldOut = !!ticket.sold_out;
              const isLimited =
                !isSoldOut &&
                ticket.available != null &&
                ticket.available > 0 &&
                ticket.available <= 10;

              return (
                <div
                  key={`${ticket.name}-${index}`}
                  className={clsx(
                    'flex flex-col gap-3 rounded-lg border border-card-border p-5 transition-colors',
                    isSoldOut
                      ? 'opacity-60 bg-primary/4'
                      : 'bg-primary/4 hover:border-primary/30',
                  )}
                >
                  {/* Ticket name + badges */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-primary">
                      {ticket.name || 'Ticket'}
                    </h3>
                    {isSoldOut && (
                      <span className="shrink-0 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400">
                        Sold Out
                      </span>
                    )}
                    {isLimited && (
                      <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                        {ticket.available} left
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  {show_prices !== false && (
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(ticket.price, ticket.currency)}
                    </p>
                  )}

                  {/* Description */}
                  {show_descriptions !== false && ticket.description && (
                    <p className="text-sm text-secondary leading-relaxed">
                      {ticket.description}
                    </p>
                  )}

                  {/* CTA */}
                  <div className="mt-auto pt-2">
                    <button
                      type="button"
                      disabled={isSoldOut}
                      className={clsx(
                        'w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity',
                        isSoldOut
                          ? 'cursor-not-allowed bg-primary/10 text-tertiary'
                          : 'bg-primary text-on-primary hover:opacity-90',
                      )}
                    >
                      {isSoldOut ? 'Sold Out' : 'Get Tickets'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Placeholder when no tickets configured */
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-card-border bg-primary/4 px-6 py-12">
            <svg
              className="size-8 text-tertiary mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5Z" />
            </svg>
            <p className="text-sm font-medium text-secondary">
              No tickets configured
            </p>
            <p className="text-xs text-tertiary mt-1">
              Add ticket tiers to display registration options
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventRegistration = React.memo(EventRegistrationInner);
EventRegistration.craft = {
  displayName: 'EventRegistration',
  props: {
    width: 'contained',
    padding: 'lg',
    alignment: 'center',
    heading: 'Registration',
    description: '',
    tickets: [],
    show_prices: true,
    show_descriptions: true,
  },
};
