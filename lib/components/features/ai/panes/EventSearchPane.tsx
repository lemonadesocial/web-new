'use client';

import type { AtlasEvent } from '$lib/types/atlas';
import { AtlasEventCard } from '../cards/AtlasEventCard';

interface EventSearchPaneProps {
  events: AtlasEvent[];
  total: number;
  sources: Array<{ platform: string; count: number }>;
}

export function EventSearchPane({ events, total, sources }: EventSearchPaneProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <p className="text-secondary text-xs font-medium">
          {total} event{total !== 1 ? 's' : ''} found
        </p>
        <div className="flex gap-1.5">
          {sources.map((source) => (
            <span
              key={source.platform}
              className="px-2 py-0.5 rounded-full bg-overlay-secondary border border-card-border text-quaternary text-[10px] capitalize"
            >
              {source.platform} ({source.count})
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        {events.map((event) => (
          <AtlasEventCard
            key={event.id}
            event={event}
            onClick={(e) => {
              if (e.url) {
                window.open(e.url, '_blank', 'noopener,noreferrer');
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
