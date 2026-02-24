import { ethers, formatUnits } from 'ethers';
import { format, formatDistance, isSameDay, isSameYear, isToday, isTomorrow } from 'date-fns';

import {
  Address,
  EmailSetting,
  Event,
  EventRole,
  EventTicketCategory,
  EventTicketPrice,
  EventTokenGate,
  NewPaymentAccount,
  PaymentAccountInfo,
  PaymentAccountType,
  PurchasableTicketType,
  Ticket,
  User,
} from '$lib/graphql/generated/backend/graphql';

import { formatCurrency, formatNumber } from './string';

import { convertFromUtcToTimezone, formatWithTimezone } from './date';
import { getListChains } from './crypto';
import { groupBy } from 'lodash';
import { JOIN_REQUEST_STATE_MAP, RECIPIENT_TYPE_MAP } from './email';

export function formatCryptoPrice(price: EventTicketPrice, skipCurrency: boolean = false) {
  const { cost, currency } = price;
  const decimals = getListChains()
    ?.flatMap(({ tokens }) => tokens)
    ?.find((token) => token?.symbol === price.currency)?.decimals;

  if (!decimals) {
    console.error('Cannot find currency decimals.');
    return '';
  }
  if (skipCurrency) return ethers.formatUnits(cost, decimals);

  // return `${ethers.formatUnits(cost, decimals)} ${currency.toUpperCase()}`;
  return `${formatNumber(ethers.formatUnits(cost, decimals))} ${currency.toUpperCase()}`;
}

export function formatFiatPrice(price: EventTicketPrice) {
  const { cost, currency, payment_accounts_expanded } = price;
  const decimals = payment_accounts_expanded?.[0]?.account_info?.currency_map[currency]?.decimals;

  if (!Number.isFinite(decimals)) return '';

  return formatCurrency(Number(cost), currency, decimals, false);
}

export function formatPrice(price: EventTicketPrice, showFree?: boolean) {
  if (!price.payment_accounts_expanded?.[0]) return showFree ? 'Free' : '';

  const isStripe = price.payment_accounts_expanded[0].provider === 'stripe';

  return isStripe ? formatFiatPrice(price) : formatCryptoPrice(price);
}

export function getEventPrice(event: Event) {
  const defaultPrice =
    event.event_ticket_types?.[0]?.prices.find((price) => price.default) || event.event_ticket_types?.[0]?.prices[0];

  if (!defaultPrice) return '';

  return formatPrice(defaultPrice, true);
}

export function getEventAddress(address?: Address | undefined, short?: boolean) {
  if (!address) return;

  if (short) return [address.title, address.city || address.region, address.country].filter(Boolean).join(', ');

  return [
    address.title,
    address.street_1,
    address.street_2,
    address.postal,
    address.city,
    address.region,
    address.country,
    address.additional_directions,
  ]
    .filter(Boolean)
    .join(', \n');
}

export function getEventSubAddress(address?: Address | undefined) {
  if (!address) return;

  return [
    address.street_1 === address.title ? undefined : address.street_1,
    address.street_2,
    address.postal,
    address.city,
    address.region,
    address.country,
    address.additional_directions,
  ]
    .filter(Boolean)
    .join(', \n');
}

export function getEventDateBlockStart(event: Event) {
  const startTime = convertFromUtcToTimezone(event.start, event.timezone as string);
  const endTime = convertFromUtcToTimezone(event.end, event.timezone as string);

  if (isSameDay(startTime, endTime)) {
    return `${format(startTime, 'EEE, MMM dd')}`;
  }

  if (isSameYear(startTime, new Date())) {
    return `${format(startTime, 'EEE, MMM dd')} &middot; ${formatDistance(event.start, event.end)}`;
  }

  return `${format(startTime, 'EEE, dd MMMM yyyy')} `;
}

export const getEventDateBlockRange = (event: Event) => {
  const startTime = convertFromUtcToTimezone(event.start, event.timezone as string);
  const endTime = convertFromUtcToTimezone(event.end, event.timezone as string);

  if (isSameDay(startTime, endTime)) {
    return `${format(startTime, 'hh:mm a')} - ${formatWithTimezone(endTime, 'hh:mm a OOO', event.timezone as string)}`;
  }

  return `${format(startTime, 'hh:mm a')} - ${formatWithTimezone(endTime, 'EEE, MMM dd, hh:mm a OOO', event.timezone as string)}`;
};

export interface GroupedTicketTypes {
  category: EventTicketCategory | null;
  ticketTypes: Array<PurchasableTicketType>;
}

export function groupTicketTypesByCategory(ticketTypes: Array<PurchasableTicketType>): Array<GroupedTicketTypes> {
  const groupedByCategory = groupBy(ticketTypes, (ticket) => ticket.category_expanded?._id || 'uncategorized');

  return Object.entries(groupedByCategory).map(([, tickets]) => ({
    category: tickets[0]?.category_expanded || null,
    ticketTypes: tickets,
  }));
}

export function getPaymentAccounts(prices: EventTicketPrice[]) {
  const accounts = prices.flatMap((price) => price.payment_accounts_expanded || []).map((account) => account._id);

  return [...new Set(accounts)];
}

export function attending(event: Event, user: string | undefined) {
  return event.accepted?.includes(user);
}

export function hosting(event: Event, user: string) {
  const cohostIds = event.cohosts_expanded_new
    ?.filter((host) => !host?.event_role || host?.event_role === EventRole.Cohost)
    .map((host) => host?._id)
    .filter(Boolean) || [];
  
  return [event.host, ...cohostIds].includes(user);
}

export function isPromoter(event: Event, user: string) {
  const promoterIds = event.cohosts_expanded_new
    ?.filter((host) => host?.event_role === EventRole.Gatekeeper)
    .map((host) => host?._id)
    .filter(Boolean) || [];
  
  return promoterIds.includes(user);
}

export function getAssignedTicket(tickets: Ticket[], user?: string, email?: string | null) {
  return tickets?.find(({ assigned_to, assigned_email }) => assigned_to === user || assigned_email === email);
}

export function getUnassignedTickets(tickets: Ticket[]) {
  return tickets.filter((t) => !t.assigned_to && !t.assigned_email);
}

export function getEventCardStart(event: Event | { start: string; end: string; timezone?: string }) {
  const startTime = convertFromUtcToTimezone(event.start, event.timezone);

  if (isToday(startTime)) return `Today, ${formatWithTimezone(startTime, 'hh:mm a OOO', event.timezone)}`;
  if (isTomorrow(startTime)) return `Tomorrow, ${formatWithTimezone(startTime, 'hh:mm a OOO', event.timezone)}`;

  return `${formatWithTimezone(startTime, 'EEE, dd MMM, hh:mm a OOO', event.timezone)}`;
}

export const getDisplayPrice = (cost: string, currency: string, account?: PaymentAccountInfo) => {
  if (!currency) return 0;

  const decimals = account?.account_info.currency_map[currency]?.decimals;

  if (!Number.isFinite(decimals)) return 0;

  if (account.provider === 'stripe') return formatCurrency(Number(cost), currency, decimals, false);

  return `${ethers.formatUnits(cost, decimals)} ${currency}`;
};

export function isAttending(event: Event, userId: string): boolean {
  if (!event?._id) return false;
  return new Set(
    [...([event?.host] || [])]
      .concat(event?.cohosts || [])
      .concat(event?.speaker_users || [])
      .concat(event?.accepted || []),
  ).has(userId);
}

export function getTicketPassUrl(ticket: Ticket, provider: 'apple' | 'google') {
  return `${process.env.NEXT_PUBLIC_LMD_BE}/event/pass/${provider}/${ticket._id}?shortid=${ticket.shortid}`;
}

export function extractShortId(url: string): string | null {
  const match = url.match(/lemonade\.social\/e\/([\w-]+)/i);
  return match ? match[1] : null;
}

export function getEventCohosts(event: Event) {
  const visibleCohosts = event.visible_cohosts_expanded_new || [];

  return visibleCohosts.filter(Boolean) as User[];
}

export function formatTokenGateRange(tokenGate: EventTokenGate) {
  const { min_value, decimals } = tokenGate;

  if (min_value && decimals) return `> ${formatNumber(formatUnits(min_value, decimals))}`;

  return `> 0`;
}

export function getEmailBlastsRecipients(item: EmailSetting) {
  let list = item.recipient_types?.map((type) => RECIPIENT_TYPE_MAP.get(type)).filter(Boolean) || [];
  if (item.recipient_filters?.ticket_types?.length) list.push('Going');
  if (item.recipient_filters?.join_request_states) {
    const arr =
      item.recipient_filters?.join_request_states?.map((state) => JOIN_REQUEST_STATE_MAP.get(state)).filter(Boolean) ||
      [];
    list = [...list, ...arr];
  }

  return list.join(', ');
}

export function filterDirectPaymentAccounts(
  accounts: Array<NewPaymentAccount | null | undefined> | null | undefined
): NewPaymentAccount[] {
  return (accounts ?? []).filter(
    (account): account is NewPaymentAccount =>
      account != null &&
      (account.type === PaymentAccountType.Ethereum || account.type === PaymentAccountType.EthereumRelay)
  );
}
