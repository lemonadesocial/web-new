import type {
  AtlasSearchParams,
  AtlasSearchResult,
  AtlasEvent,
  AtlasTicketType,
  AtlasRewardBalance,
  AtlasRewardTransaction,
} from '$lib/types/atlas';

const ATLAS_VERSION_HEADER = { 'Atlas-Version': '1.0' };

function getAtlasRegistryUrl(): string | undefined {
  return typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_ATLAS_REGISTRY_URL
    : process.env.NEXT_PUBLIC_ATLAS_REGISTRY_URL;
}

function getBackendUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_LMD_BE;
}

export function isAtlasEnabled(): boolean {
  return Boolean(getAtlasRegistryUrl());
}

async function atlasFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = getAtlasRegistryUrl();
  if (!baseUrl) {
    throw new Error('Atlas registry URL is not configured');
  }

  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...ATLAS_VERSION_HEADER,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Atlas API error ${res.status}: ${body}`);
  }

  return res.json();
}

async function backendFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = getBackendUrl();
  if (!baseUrl) {
    throw new Error('Backend URL is not configured');
  }

  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...ATLAS_VERSION_HEADER,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Backend API error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function atlasSearch(params: AtlasSearchParams): Promise<AtlasSearchResult> {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('query', params.query);
  if (params.category) searchParams.set('category', params.category);
  if (params.city) searchParams.set('city', params.city);
  if (params.date_from) searchParams.set('date_from', params.date_from);
  if (params.date_to) searchParams.set('date_to', params.date_to);
  if (params.price_min != null) searchParams.set('price_min', String(params.price_min));
  if (params.price_max != null) searchParams.set('price_max', String(params.price_max));
  if (params.currency) searchParams.set('currency', params.currency);
  if (params.source_platform) searchParams.set('source_platform', params.source_platform);
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.cursor) searchParams.set('cursor', params.cursor);

  const qs = searchParams.toString();
  return atlasFetch<AtlasSearchResult>(`/v1/events/search${qs ? `?${qs}` : ''}`);
}

export async function atlasGetEvent(id: string): Promise<AtlasEvent> {
  return atlasFetch<AtlasEvent>(`/v1/events/${encodeURIComponent(id)}`);
}

export async function atlasListTickets(eventId: string): Promise<AtlasTicketType[]> {
  return atlasFetch<AtlasTicketType[]>(`/v1/events/${encodeURIComponent(eventId)}/tickets`);
}

export async function atlasGetRewardBalance(): Promise<AtlasRewardBalance> {
  return backendFetch<AtlasRewardBalance>('/atlas/rewards/balance');
}

export async function atlasGetRewardHistory(): Promise<AtlasRewardTransaction[]> {
  return backendFetch<AtlasRewardTransaction[]>('/atlas/rewards/history');
}
