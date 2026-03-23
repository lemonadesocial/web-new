'use client';

import { useState, useCallback } from 'react';

import type { AtlasEvent, AtlasSearchParams } from '$lib/types/atlas';
import { atlasSearch } from '$lib/services/atlas-client';

interface UseAtlasSearchReturn {
  events: AtlasEvent[];
  total: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  search: (params: AtlasSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useAtlasSearch(): UseAtlasSearchReturn {
  const [events, setEvents] = useState<AtlasEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [lastParams, setLastParams] = useState<AtlasSearchParams | null>(null);

  const search = useCallback(async (params: AtlasSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await atlasSearch(params);
      setEvents(result.events);
      setTotal(result.total);
      setCursor(result.cursor);
      setLastParams(params);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      setEvents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastParams || !cursor || loading) return;

    setLoading(true);
    setError(null);
    try {
      const result = await atlasSearch({ ...lastParams, cursor });
      setEvents((prev) => [...prev, ...result.events]);
      setTotal(result.total);
      setCursor(result.cursor);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load more';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [lastParams, cursor, loading]);

  return {
    events,
    total,
    loading,
    error,
    hasMore: Boolean(cursor),
    search,
    loadMore,
  };
}
