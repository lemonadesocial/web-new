import type {
  Event,
  EventGuestDetail,
  Space,
  Ticket,
} from '$lib/graphql/generated/backend/graphql';

export type CardItem =
  | { type: 'event'; data: Event; link?: string }
  | { type: 'ticket'; data: Ticket; link?: string }
  | { type: 'space'; data: Space; link?: string }
  | { type: 'guest'; data: EventGuestDetail; link?: string };

export interface OverflowData {
  total: number;
  shown: number;
  viewAllLink: string;
  viewAllLabel: string;
}
