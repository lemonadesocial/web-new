export interface AtlasEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  timezone?: string;
  location?: string;
  city?: string;
  country?: string;
  image_url?: string;
  url?: string;
  source_platform: string;
  source_id: string;
  category?: string;
  tags?: string[];
  min_price?: number;
  max_price?: number;
  currency?: string;
  availability: 'available' | 'limited' | 'sold_out';
  organizer_name?: string;
  organizer_avatar?: string;
  attendee_count?: number;
}

export interface AtlasTicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  availability: 'available' | 'limited' | 'sold_out';
  quantity_total?: number;
  quantity_remaining?: number;
  sale_start?: string;
  sale_end?: string;
  max_per_order?: number;
}

export interface AtlasSearchResult {
  events: AtlasEvent[];
  total: number;
  cursor?: string;
  sources: Array<{ platform: string; count: number }>;
}

export interface AtlasSearchParams {
  query?: string;
  category?: string;
  city?: string;
  date_from?: string;
  date_to?: string;
  price_min?: number;
  price_max?: number;
  currency?: string;
  source_platform?: string;
  limit?: number;
  cursor?: string;
}

export interface AtlasTicketComparison {
  event: AtlasEvent;
  tickets: AtlasTicketType[];
  best_value_ticket_id?: string;
}

export interface AtlasCheckoutInfo {
  checkout_id: string;
  checkout_url: string;
  amount: number;
  currency: string;
  usdc_equivalent?: number;
  payment_methods: string[];
  expires_at: string;
  event_title: string;
  ticket_name: string;
  quantity: number;
}

export interface AtlasPurchaseReceipt {
  receipt_id: string;
  event: AtlasEvent;
  ticket: AtlasTicketType;
  quantity: number;
  total_paid: number;
  currency: string;
  payment_method: string;
  purchased_at: string;
  attendees: Array<{ name: string; email: string }>;
  confirmation_url?: string;
  reward_info?: {
    cashback_earned: number;
    cashback_currency: string;
    volume_tier: string;
  };
}

export interface AtlasRewardBalance {
  total_earned: number;
  total_redeemed: number;
  available: number;
  currency: string;
  volume_tier: string;
  next_tier_threshold?: number;
  is_verified: boolean;
}

export interface AtlasRewardTransaction {
  id: string;
  type: 'cashback' | 'redemption' | 'bonus';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'expired';
  description: string;
  event_title?: string;
  created_at: string;
}
