import type {
  Event,
  EventGuestDetail,
  Space,
  Ticket,
} from '$lib/graphql/generated/backend/graphql';
import type {
  AtlasEvent,
  AtlasTicketComparison,
  AtlasCheckoutInfo,
  AtlasPurchaseReceipt,
} from '$lib/types/atlas';

export type CardItem =
  | { type: 'event'; data: Event; link?: string }
  | { type: 'ticket'; data: Ticket; link?: string }
  | { type: 'space'; data: Space; link?: string }
  | { type: 'guest'; data: EventGuestDetail; link?: string }
  | { type: 'atlas_event'; data: AtlasEvent }
  | { type: 'atlas_comparison'; data: AtlasTicketComparison[] }
  | { type: 'atlas_payment_link'; data: AtlasCheckoutInfo }
  | { type: 'atlas_receipt'; data: AtlasPurchaseReceipt };

export interface OverflowData {
  total: number;
  shown: number;
  viewAllLink: string;
  viewAllLabel: string;
}
