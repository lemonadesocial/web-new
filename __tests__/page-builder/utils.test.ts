import { expect, it, describe, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  formatRelativeTime,
  formatInstallCount,
  renderStars,
  usePageConfig,
} from '$lib/components/features/page-builder/utils';
import type { PageConfig } from '$lib/components/features/page-builder/types';
import { DEFAULT_THEME } from '$lib/components/features/page-builder/types';

// ---------------------------------------------------------------------------
// Mock localStorage (jsdom in this vitest config doesn't provide it)
// ---------------------------------------------------------------------------

const localStorageStore: Record<string, string> = {};

const mockLocalStorage = {
  getItem: (key: string) => localStorageStore[key] ?? null,
  setItem: (key: string, value: string) => { localStorageStore[key] = value; },
  removeItem: (key: string) => { delete localStorageStore[key]; },
};

Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });

// ---------------------------------------------------------------------------
// Mock the GraphQL client
// ---------------------------------------------------------------------------

const mockQuery = vi.fn();

vi.mock('$lib/graphql/request/instances', () => ({
  defaultClient: { query: (...args: unknown[]) => mockQuery(...args) },
}));

vi.mock('$lib/graphql/generated/backend/graphql', () => ({
  GetPageConfigDocument: 'GetPageConfigDocument',
  CreatePageConfigDocument: 'CreatePageConfigDocument',
}));

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const MOCK_CONFIG: PageConfig = {
  _id: 'config-abc-123',
  owner_type: 'event',
  owner_id: 'event-42',
  created_by: 'user-1',
  status: 'draft',
  version: 1,
  theme: DEFAULT_THEME,
  sections: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-23T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" for dates less than 1 minute ago', () => {
    const thirtySecsAgo = new Date('2026-02-23T11:59:30Z').toISOString();
    expect(formatRelativeTime(thirtySecsAgo)).toBe('Just now');
  });

  it('returns singular "1 minute ago"', () => {
    const oneMinAgo = new Date('2026-02-23T11:59:00Z').toISOString();
    expect(formatRelativeTime(oneMinAgo)).toBe('1 minute ago');
  });

  it('returns plural "X minutes ago"', () => {
    const fiveMinAgo = new Date('2026-02-23T11:55:00Z').toISOString();
    expect(formatRelativeTime(fiveMinAgo)).toBe('5 minutes ago');
  });

  it('returns singular "1 hour ago"', () => {
    const oneHourAgo = new Date('2026-02-23T11:00:00Z').toISOString();
    expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
  });

  it('returns plural "X hours ago"', () => {
    const threeHoursAgo = new Date('2026-02-23T09:00:00Z').toISOString();
    expect(formatRelativeTime(threeHoursAgo)).toBe('3 hours ago');
  });

  it('returns "Yesterday"', () => {
    const yesterday = new Date('2026-02-22T12:00:00Z').toISOString();
    expect(formatRelativeTime(yesterday)).toBe('Yesterday');
  });

  it('returns "X days ago" for 2-29 days', () => {
    const fiveDaysAgo = new Date('2026-02-18T12:00:00Z').toISOString();
    expect(formatRelativeTime(fiveDaysAgo)).toBe('5 days ago');
  });

  it('returns locale date string for 30+ days ago', () => {
    const oldDate = new Date('2025-12-01T12:00:00Z').toISOString();
    const result = formatRelativeTime(oldDate);
    // Should be a locale date, not a relative string
    expect(result).not.toContain('ago');
    expect(result).not.toBe('Just now');
    expect(result).not.toBe('Yesterday');
  });
});

// ---------------------------------------------------------------------------
// formatInstallCount
// ---------------------------------------------------------------------------

describe('formatInstallCount', () => {
  it('returns raw number for counts under 1000', () => {
    expect(formatInstallCount(0)).toBe('0');
    expect(formatInstallCount(1)).toBe('1');
    expect(formatInstallCount(999)).toBe('999');
  });

  it('formats 1000 as "1k"', () => {
    expect(formatInstallCount(1000)).toBe('1k');
  });

  it('formats 1240 as "1.2k"', () => {
    expect(formatInstallCount(1240)).toBe('1.2k');
  });

  it('formats 2500 as "2.5k"', () => {
    expect(formatInstallCount(2500)).toBe('2.5k');
  });

  it('formats 10000 as "10k"', () => {
    expect(formatInstallCount(10000)).toBe('10k');
  });

  it('strips trailing .0 (15000 → "15k" not "15.0k")', () => {
    expect(formatInstallCount(15000)).toBe('15k');
  });
});

// ---------------------------------------------------------------------------
// renderStars
// ---------------------------------------------------------------------------

describe('renderStars', () => {
  it('renders 0 stars for 0 rating', () => {
    expect(renderStars(0)).toBe('');
  });

  it('renders 5 full stars for rating 5', () => {
    expect(renderStars(5)).toBe('★★★★★');
  });

  it('renders 3 full stars for rating 3', () => {
    expect(renderStars(3)).toBe('★★★');
  });

  it('renders half star for .5 ratings', () => {
    expect(renderStars(4.5)).toBe('★★★★½');
  });

  it('renders half star for .7 ratings (>= 0.5)', () => {
    expect(renderStars(2.7)).toBe('★★½');
  });

  it('does not render half star for .3 ratings (< 0.5)', () => {
    expect(renderStars(3.3)).toBe('★★★');
  });

  it('renders just half star for 0.5', () => {
    expect(renderStars(0.5)).toBe('½');
  });
});

// ---------------------------------------------------------------------------
// usePageConfig hook
// ---------------------------------------------------------------------------

describe('usePageConfig', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    for (const key of Object.keys(localStorageStore)) {
      delete localStorageStore[key];
    }
  });

  it('creates a new config when no cached ID exists', async () => {
    mockQuery.mockResolvedValueOnce({
      data: { createPageConfig: MOCK_CONFIG },
    });

    const { result } = renderHook(() => usePageConfig('event-42', 'event'));

    // Initially loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.config).toEqual(MOCK_CONFIG);
    expect(result.current.error).toBeNull();

    // Should have called CreatePageConfig (not GetPageConfig)
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'CreatePageConfigDocument',
        variables: {
          input: {
            owner_type: 'event',
            owner_id: 'event-42',
            theme: DEFAULT_THEME,
          },
        },
      }),
    );

    // Should cache the config ID in localStorage
    expect(localStorageStore['pb_config_event_event-42']).toBe('config-abc-123');
  });

  it('loads existing config when cached ID is found', async () => {
    // Pre-populate localStorage
    localStorageStore['pb_config_event_event-42'] = 'config-abc-123';

    mockQuery.mockResolvedValueOnce({
      data: { getPageConfig: MOCK_CONFIG },
    });

    const { result } = renderHook(() => usePageConfig('event-42', 'event'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.config).toEqual(MOCK_CONFIG);

    // Should have called GetPageConfig with the cached ID
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'GetPageConfigDocument',
        variables: { id: 'config-abc-123' },
      }),
    );
  });

  it('falls back to create when cached config is stale (deleted)', async () => {
    // Pre-populate localStorage with a stale ID
    localStorageStore['pb_config_event_event-42'] = 'deleted-config';

    // First call: GetPageConfig returns null (config deleted)
    mockQuery.mockResolvedValueOnce({
      data: { getPageConfig: null },
    });

    // Second call: CreatePageConfig succeeds
    mockQuery.mockResolvedValueOnce({
      data: { createPageConfig: MOCK_CONFIG },
    });

    const { result } = renderHook(() => usePageConfig('event-42', 'event'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.config).toEqual(MOCK_CONFIG);
    expect(mockQuery).toHaveBeenCalledTimes(2);

    // localStorage should be updated with the new config ID
    expect(localStorageStore['pb_config_event_event-42']).toBe('config-abc-123');
  });

  it('sets error when all queries fail', async () => {
    const testError = new Error('Network error');
    mockQuery.mockRejectedValueOnce(testError);

    const { result } = renderHook(() => usePageConfig('event-42', 'event'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.config).toBeNull();
    expect(result.current.error).toBe(testError);
  });

  it('does not fetch when ownerId is empty', async () => {
    const { result } = renderHook(() => usePageConfig('', 'event'));

    // Should transition to loading: false without making any fetch
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockQuery).not.toHaveBeenCalled();
    expect(result.current.config).toBeNull();
  });

  it('works for space owner type', async () => {
    mockQuery.mockResolvedValueOnce({
      data: { createPageConfig: { ...MOCK_CONFIG, _id: 'space-config-1', owner_type: 'space', owner_id: 'space-7' } },
    });

    const { result } = renderHook(() => usePageConfig('space-7', 'space'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.config?.owner_type).toBe('space');
    expect(localStorageStore['pb_config_space_space-7']).toBe('space-config-1');
  });
});
