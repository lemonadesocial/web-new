import type {
  AtlasSearchParams,
  AtlasSearchResult,
  AtlasEvent,
  AtlasTicketType,
  AtlasRewardBalance,
  AtlasRewardTransaction,
} from '$lib/types/atlas';

const ATLAS_VERSION_HEADER = { 'Atlas-Version': '1.0' };

const ATLAS_REGISTRY_URL = process.env.NEXT_PUBLIC_ATLAS_REGISTRY_URL;
const ATLAS_BACKEND_URL = process.env.NEXT_PUBLIC_LMD_BE;

export function isAtlasEnabled(): boolean {
  return Boolean(ATLAS_REGISTRY_URL);
}

async function atlasFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = ATLAS_REGISTRY_URL;
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

// GraphQL query helper for reward data (Phase 4 resolvers)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function atlasGraphqlQuery(query: string, variables: Record<string, unknown> = {}): Promise<any> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (!graphqlUrl) throw new Error('GraphQL URL is not configured');

  const res = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GraphQL error ${res.status}: ${body}`);
  }

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

async function backendFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = ATLAS_BACKEND_URL;
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

// Reward data comes from GraphQL resolvers (Phase 4), not REST endpoints.
// The RewardDashboard component should use useQuery with these query strings.
export const ATLAS_REWARD_SUMMARY_QUERY = `
  query AtlasRewardSummary($space: String!) {
    atlasRewardSummary(space: $space) {
      organizer_accrued_usdc
      organizer_pending_usdc
      organizer_paid_out_usdc
      attendee_accrued_usdc
      attendee_pending_usdc
      attendee_paid_out_usdc
      volume_tier
      monthly_gmv_usdc
      next_tier_threshold_usdc
      next_payout_date
      is_self_verified
      verification_cta_extra_usdc
    }
  }
`;

export const ATLAS_REWARD_HISTORY_QUERY = `
  query AtlasRewardHistory($space: String!, $limit: Int, $offset: Int) {
    atlasRewardHistory(space: $space, limit: $limit, offset: $offset) {
      _id
      event_id
      gross_amount_usdc
      organizer_cashback_usdc
      attendee_cashback_usdc
      organizer_volume_bonus_usdc
      attendee_discovery_bonus_usdc
      payment_method
      status
      created_at
    }
  }
`;

// Convert backend micro-unit USDC strings to dollar numbers
export function usdcMicroToDollars(micro: string): number {
  return Number(micro) / 1_000_000;
}

// Map backend AtlasRewardSummaryOutput to frontend AtlasRewardBalance
export function mapRewardSummary(data: {
  organizer_accrued_usdc: string;
  organizer_pending_usdc: string;
  organizer_paid_out_usdc: string;
  attendee_accrued_usdc: string;
  attendee_pending_usdc: string;
  attendee_paid_out_usdc: string;
  volume_tier: string;
  next_tier_threshold_usdc: string;
  is_self_verified: boolean;
}): AtlasRewardBalance {
  return {
    total_earned: usdcMicroToDollars(data.organizer_accrued_usdc) + usdcMicroToDollars(data.attendee_accrued_usdc),
    available: usdcMicroToDollars(data.organizer_pending_usdc) + usdcMicroToDollars(data.attendee_pending_usdc),
    total_redeemed: usdcMicroToDollars(data.organizer_paid_out_usdc) + usdcMicroToDollars(data.attendee_paid_out_usdc),
    currency: 'USDC',
    volume_tier: data.volume_tier,
    next_tier_threshold: usdcMicroToDollars(data.next_tier_threshold_usdc),
    is_verified: data.is_self_verified,
  };
}
