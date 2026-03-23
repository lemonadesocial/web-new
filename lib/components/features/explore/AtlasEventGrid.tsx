'use client';

import type { AtlasEvent } from '$lib/types/atlas';
import { AtlasEventCard } from '../ai/cards/AtlasEventCard';

interface AtlasEventGridProps {
  events: AtlasEvent[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onEventClick?: (event: AtlasEvent) => void;
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-overlay-secondary animate-pulse">
      <div className="size-[38px] rounded-sm bg-overlay-secondary border border-card-border shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3.5 w-3/4 rounded bg-overlay-secondary" />
        <div className="h-3 w-1/2 rounded bg-overlay-secondary" />
      </div>
    </div>
  );
}

export function AtlasEventGrid({ events, loading, hasMore, onLoadMore, onEventClick }: AtlasEventGridProps) {
  if (!loading && events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <i aria-hidden="true" className="icon-search size-10 text-quaternary mb-3" />
        <p className="text-secondary text-sm font-medium">No events found</p>
        <p className="text-quaternary text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {events.map((event) => (
          <AtlasEventCard
            key={event.id}
            event={event}
            onClick={onEventClick || ((e) => {
              if (e.url) {
                window.open(e.url, '_blank', 'noopener,noreferrer');
              }
            })}
          />
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <button
          type="button"
          onClick={onLoadMore}
          className="mx-auto mt-4 px-6 py-2 rounded-md border border-card-border text-secondary text-sm hover:bg-overlay-secondary transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  );
}
