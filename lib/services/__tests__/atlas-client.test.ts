import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const MOCK_REGISTRY_URL = 'https://atlas-registry.example.com';

// We need to control env vars before importing the module, so we use dynamic imports
// and reset modules between tests.

function mockFetch(response: { ok: boolean; status?: number; body?: unknown; text?: string }) {
  const fn = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    json: () => Promise.resolve(response.body),
    text: () => Promise.resolve(response.text ?? ''),
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('atlas-client', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_ATLAS_REGISTRY_URL = MOCK_REGISTRY_URL;
    process.env.NEXT_PUBLIC_LMD_BE = 'https://backend.example.com';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_ATLAS_REGISTRY_URL;
    delete process.env.NEXT_PUBLIC_LMD_BE;
  });

  describe('isAtlasEnabled', () => {
    it('returns true when registry URL is set', async () => {
      const { isAtlasEnabled } = await import('$lib/services/atlas-client');
      expect(isAtlasEnabled()).toBe(true);
    });

    it('returns false when registry URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_ATLAS_REGISTRY_URL;
      vi.resetModules();
      const { isAtlasEnabled } = await import('$lib/services/atlas-client');
      expect(isAtlasEnabled()).toBe(false);
    });
  });

  describe('atlasSearch', () => {
    it('calls correct URL with query params and parses response', async () => {
      const mockResult = {
        events: [{ id: 'e1', title: 'Test Event' }],
        total: 1,
        cursor: 'abc',
        sources: [{ platform: 'luma', count: 1 }],
      };
      const fetchFn = mockFetch({ ok: true, body: mockResult });

      const { atlasSearch } = await import('$lib/services/atlas-client');
      const result = await atlasSearch({ query: 'music', city: 'NYC', limit: 10 });

      expect(fetchFn).toHaveBeenCalledOnce();
      const calledUrl = fetchFn.mock.calls[0][0] as string;
      expect(calledUrl).toContain(`${MOCK_REGISTRY_URL}/v1/events/search`);
      expect(calledUrl).toContain('query=music');
      expect(calledUrl).toContain('city=NYC');
      expect(calledUrl).toContain('limit=10');

      const calledOptions = fetchFn.mock.calls[0][1] as RequestInit;
      expect(calledOptions.headers).toEqual(
        expect.objectContaining({
          'Content-Type': 'application/json',
          'Atlas-Version': '1.0',
        }),
      );

      expect(result).toEqual(mockResult);
    });

    it('calls URL without query string when no params provided', async () => {
      mockFetch({ ok: true, body: { events: [], total: 0, sources: [] } });

      const { atlasSearch } = await import('$lib/services/atlas-client');
      await atlasSearch({});

      const calledUrl = (vi.mocked(fetch).mock.calls[0][0] as string);
      expect(calledUrl).toBe(`${MOCK_REGISTRY_URL}/v1/events/search`);
    });
  });

  describe('atlasListTickets', () => {
    it('calls correct URL and returns ticket types', async () => {
      const mockTickets = [
        { id: 't1', event_id: 'e1', name: 'GA', price: 50, currency: 'USD', availability: 'available' },
      ];
      const fetchFn = mockFetch({ ok: true, body: mockTickets });

      const { atlasListTickets } = await import('$lib/services/atlas-client');
      const result = await atlasListTickets('e1');

      expect(fetchFn).toHaveBeenCalledOnce();
      const calledUrl = fetchFn.mock.calls[0][0] as string;
      expect(calledUrl).toBe(`${MOCK_REGISTRY_URL}/v1/events/e1/tickets`);
      expect(result).toEqual(mockTickets);
    });
  });

  describe('error handling', () => {
    it('throws on non-ok response with status and body', async () => {
      mockFetch({ ok: false, status: 404, text: 'Not found' });

      const { atlasSearch } = await import('$lib/services/atlas-client');
      await expect(atlasSearch({ query: 'test' })).rejects.toThrow('Atlas API error 404: Not found');
    });

    it('throws when registry URL is not configured', async () => {
      delete process.env.NEXT_PUBLIC_ATLAS_REGISTRY_URL;
      vi.resetModules();
      mockFetch({ ok: true, body: {} });

      const { atlasSearch } = await import('$lib/services/atlas-client');
      await expect(atlasSearch({ query: 'test' })).rejects.toThrow('Atlas registry URL is not configured');
    });
  });
});
