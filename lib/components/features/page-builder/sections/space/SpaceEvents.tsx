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

interface SpaceEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  thumbnail_url?: string;
  url?: string;
}

interface SpaceEventsProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  heading?: string;
  events?: SpaceEvent[];
  layout_style?: 'grid' | 'list';
  columns?: 2 | 3;
  show_past_events?: boolean;
}

function EventCard({
  event,
  layout_style,
}: {
  event: SpaceEvent;
  layout_style: 'grid' | 'list';
}) {
  const hasThumbnail =
    event.thumbnail_url && event.thumbnail_url.trim().length > 0;

  const content = (
    <div
      className={clsx(
        'group overflow-hidden rounded-md border border-card-border bg-primary/4 transition hover:border-primary/20',
        layout_style === 'list' && 'flex flex-row items-center',
        layout_style === 'grid' && 'flex flex-col',
      )}
    >
      {/* Thumbnail */}
      {hasThumbnail ? (
        <div
          className={clsx(
            'overflow-hidden bg-primary/8',
            layout_style === 'grid' && 'aspect-video w-full',
            layout_style === 'list' && 'h-24 w-32 shrink-0',
          )}
        >
          <img
            src={sanitizeMediaSrc(event.thumbnail_url)}
            alt={event.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className={clsx(
            'flex items-center justify-center bg-primary/4',
            layout_style === 'grid' && 'aspect-video w-full',
            layout_style === 'list' && 'h-24 w-32 shrink-0',
          )}
        >
          <i className="icon-ticket size-8 text-tertiary" />
        </div>
      )}

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-sm font-semibold text-primary line-clamp-2">
          {event.title}
        </h3>
        {event.date && (
          <p className="text-xs text-secondary">{event.date}</p>
        )}
        {event.location && (
          <p className="text-xs text-tertiary truncate">{event.location}</p>
        )}
      </div>
    </div>
  );

  if (event.url) {
    return (
      <a href={sanitizeHref(event.url)} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-card-border bg-primary/4 px-6 py-12">
      <i className="icon-ticket size-8 text-tertiary" />
      <p className="mt-3 text-sm font-medium text-secondary">No upcoming events</p>
      <p className="mt-1 text-xs text-tertiary">
        Events will appear here when they are created
      </p>
    </div>
  );
}

function _SpaceEvents({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = 'Upcoming Events',
  events = [],
  layout_style = 'grid',
  columns = 3,
  show_past_events = false,
}: SpaceEventsProps) {
  // show_past_events is a configuration toggle; filtering would happen at the
  // data-binding layer. Here we simply render whatever events are provided.
  void show_past_events;

  const hasEvents = events.length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">
          {heading || 'Upcoming Events'}
        </h2>
        {hasEvents && (
          <span className="text-sm font-medium text-secondary hover:text-primary transition cursor-pointer">
            View All
          </span>
        )}
      </div>

      {/* Events grid / list or empty state */}
      {hasEvents ? (
        <div
          className={clsx(
            layout_style === 'grid' && [
              'grid gap-4',
              columns === 2 && 'grid-cols-1 sm:grid-cols-2',
              columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            ],
            layout_style === 'list' && 'flex flex-col gap-3',
          )}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              layout_style={layout_style}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </SectionWrapper>
  );
}

export const SpaceEvents = React.memo(_SpaceEvents);
SpaceEvents.craft = {
  displayName: 'SpaceEvents',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Upcoming Events',
    events: [],
    layout_style: 'grid',
    columns: 3,
    show_past_events: false,
  },
};
