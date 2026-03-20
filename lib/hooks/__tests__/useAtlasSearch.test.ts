import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('$lib/services/atlas-client', () => ({
  atlasSearch: vi.fn(),
}));

import { useAtlasSearch } from '$lib/hooks/useAtlasSearch';
import { atlasSearch } from '$lib/services/atlas-client';

const mockedAtlasSearch = vi.mocked(atlasSearch);

describe('useAtlasSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state with empty events and not loading', () => {
    const { result } = renderHook(() => useAtlasSearch());

    expect(result.current.events).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasMore).toBe(false);
  });

  it('sets loading during search then populates events on success', async () => {
    const mockResult = {
      events: [
        { id: 'e1', title: 'Music Fest', availability: 'available' as const, source_platform: 'luma', start: '2026-04-01T18:00:00Z', source_id: 'x1' },
      ],
      total: 1,
      cursor: 'page2',
      sources: [{ platform: 'luma', count: 1 }],
    };
    mockedAtlasSearch.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useAtlasSearch());

    await act(async () => {
      await result.current.search({ query: 'music' });
    });

    expect(result.current.events).toEqual(mockResult.events);
    expect(result.current.total).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasMore).toBe(true);
  });

  it('sets error state when search fails', async () => {
    mockedAtlasSearch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAtlasSearch());

    await act(async () => {
      await result.current.search({ query: 'fail' });
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('passes cursor to loadMore for pagination', async () => {
    const page1 = {
      events: [{ id: 'e1', title: 'Event 1', availability: 'available' as const, source_platform: 'luma', start: '2026-04-01T18:00:00Z', source_id: 'x1' }],
      total: 2,
      cursor: 'page2',
      sources: [{ platform: 'luma', count: 2 }],
    };
    const page2 = {
      events: [{ id: 'e2', title: 'Event 2', availability: 'available' as const, source_platform: 'luma', start: '2026-04-02T18:00:00Z', source_id: 'x2' }],
      total: 2,
      cursor: undefined,
      sources: [{ platform: 'luma', count: 2 }],
    };

    mockedAtlasSearch.mockResolvedValueOnce(page1).mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useAtlasSearch());

    await act(async () => {
      await result.current.search({ query: 'events' });
    });

    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      await result.current.loadMore();
    });

    expect(mockedAtlasSearch).toHaveBeenCalledTimes(2);
    expect(mockedAtlasSearch).toHaveBeenLastCalledWith({ query: 'events', cursor: 'page2' });
    expect(result.current.events).toHaveLength(2);
    expect(result.current.hasMore).toBe(false);
  });
});
