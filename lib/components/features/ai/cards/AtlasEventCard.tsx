'use client';

import { format } from 'date-fns';
import clsx from 'clsx';
import Image from 'next/image';

import type { AtlasEvent } from '$lib/types/atlas';

interface AtlasEventCardProps {
  event: AtlasEvent;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (event: AtlasEvent) => void;
  onClick?: (event: AtlasEvent) => void;
}

const availabilityColor: Record<AtlasEvent['availability'], string> = {
  available: 'bg-success-500',
  limited: 'bg-warning-300',
  sold_out: 'bg-danger-500',
};

export function AtlasEventCard({ event, selectable, selected, onSelect, onClick }: AtlasEventCardProps) {
  const dateStr = event.start ? format(new Date(event.start), "EEE, d MMM 'at' h:mm a") : '';
  const locationStr = [event.city, event.country].filter(Boolean).join(', ');
  const priceStr =
    event.min_price != null
      ? event.min_price === 0
        ? 'Free'
        : `${event.currency ?? '$'}${event.min_price}`
      : null;

  function handleClick() {
    if (selectable && onSelect) {
      onSelect(event);
    } else if (onClick) {
      onClick(event);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-3 py-3 px-4 rounded-md border bg-overlay-secondary text-left w-full transition-colors',
        selected ? 'border-accent-400' : 'border-card-border',
        'hover:border-accent-400/60',
      )}
    >
      {selectable && (
        <span
          className={clsx(
            'size-4 rounded-full border-2 shrink-0 flex items-center justify-center',
            selected ? 'border-accent-400 bg-accent-400' : 'border-card-border',
          )}
        >
          {selected && <span className="size-1.5 rounded-full bg-white" />}
        </span>
      )}

      <Image
        src={event.image_url || '/placeholder-event.png'}
        alt={event.title}
        width={38}
        height={38}
        className="rounded-sm border border-card-border object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-primary text-sm font-medium truncate">{event.title}</p>
        <p className="text-tertiary text-xs truncate">
          {dateStr}
          {locationStr ? ` \u00b7 ${locationStr}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {priceStr && <span className="text-secondary text-xs font-medium">{priceStr}</span>}
        <span className={clsx('size-2 rounded-full shrink-0', availabilityColor[event.availability])} />
        <span className="text-quaternary text-[10px] capitalize">{event.source_platform}</span>
      </div>
    </button>
  );
}
