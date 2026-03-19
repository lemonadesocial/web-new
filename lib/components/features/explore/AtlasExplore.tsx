'use client';

import { useEffect } from 'react';

import { isAtlasEnabled } from '$lib/services/atlas-client';
import { useAtlasSearch } from '$lib/hooks/useAtlasSearch';
import { AtlasSearchBar } from './AtlasSearchBar';
import { AtlasEventGrid } from './AtlasEventGrid';

export function AtlasExplore() {
  const enabled = isAtlasEnabled();
  const { events, total, loading, error, hasMore, search, loadMore } = useAtlasSearch();

  useEffect(() => {
    if (enabled) {
      search({ limit: 20 });
    }
  }, [enabled, search]);

  if (!enabled) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <i aria-hidden="true" className="icon-globe size-12 text-quaternary mb-4" />
        <p className="text-secondary text-lg font-medium">Atlas is not available</p>
        <p className="text-quaternary text-sm mt-1">Cross-platform event discovery is currently disabled.</p>
      </div>
    );
  }

  return (
    <div className="pt-12 px-8 max-sm:px-4 max-sm:pt-16 md:pb-8">
      <div className="space-y-1 mb-8">
        <h3 className="text-2xl font-semibold">Atlas Events</h3>
        <p className="text-sm text-tertiary">
          Search for events from Lemonade, Eventbrite, Lu.ma, Meetup, and more.
        </p>
      </div>

      <div className="space-y-6">
        <AtlasSearchBar onSearch={search} loading={loading} />

        {error && (
          <div className="px-3 py-2 rounded-md bg-danger-500/10 border border-danger-500/20">
            <p className="text-danger-500 text-xs">{error}</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <p className="text-tertiary text-xs">
            Showing {events.length} of {total} events
          </p>
        )}

        <AtlasEventGrid
          events={events}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}
