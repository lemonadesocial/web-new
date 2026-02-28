// Card data shapes (from API metadata.cards[])

export interface EventCardData {
  _id: string;
  shortid: string;
  title: string;
  start?: string;
  end?: string;
  address?: string;
  published: boolean;
  cover?: string;
  attending_count?: number;
}

export interface TicketCardData {
  event_id: string;
  event_title: string;
  event_start?: string;
  ticket_type_title?: string;
  status: string;
}

export interface SpaceCardData {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  private: boolean;
  image_avatar_url?: string;
  member_count?: number;
  event_count?: number;
}

export interface GuestCardData {
  name?: string;
  email?: string;
  status: string;
  ticket_type_title?: string;
  checked_in: boolean;
}

export interface CardItem {
  type: 'event' | 'ticket' | 'space' | 'guest';
  data: EventCardData | TicketCardData | SpaceCardData | GuestCardData;
  link?: string;
}

export interface OverflowData {
  total: number;
  shown: number;
  viewAllLink: string;
  viewAllLabel: string;
}

const PLACEHOLDER_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getLetterPlaceholder(name: string): {
  letter: string;
  bgColor: string;
} {
  const letter = (name?.[0] || '?').toUpperCase();
  const colorIndex = hashCode(name || '') % PLACEHOLDER_COLORS.length;
  return { letter, bgColor: PLACEHOLDER_COLORS[colorIndex] };
}

export function formatDate(isoString?: string): string {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
