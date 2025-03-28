import { ethers } from 'ethers';
import { format, isSameDay, isSameYear } from 'date-fns';

import {
  Address,
  Event,
  EventTicketPrice,
} from '$lib/generated/backend/graphql';

import { formatCurrency } from './string';

import { convertFromUtcToTimezone, formatWithTimezone } from './date';
import { getListChains } from './crypto';

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

  return `${ethers.formatUnits(cost, decimals)} ${currency.toUpperCase()}`;
}

export function formatFiatPrice(price: EventTicketPrice) {
  const { cost, currency, payment_accounts_expanded } = price;
  const decimals = payment_accounts_expanded?.[0]?.account_info?.currency_map[currency]?.decimals;

  if (!decimals) return '';

  return formatCurrency(Number(cost), currency, decimals, false);
}

export function formatPrice(price: EventTicketPrice) {
  if (!price.payment_accounts_expanded?.[0]) return 'Free';

  const isStripe = price.payment_accounts_expanded[0].provider === 'stripe';

  return isStripe ? formatFiatPrice(price) : formatCryptoPrice(price);
}

export function getEventPrice(event: Event) {
  const defaultPrice = event.event_ticket_types?.[0]?.prices.find((price) => price.default) || event.event_ticket_types?.[0]?.prices[0];

  if (!defaultPrice) return '';

  return formatPrice(defaultPrice);
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

export function getEventDateBlockStart(event: Event) {
  const startTime = convertFromUtcToTimezone(event.start, event.timezone as string);

  if (isSameYear(startTime, new Date())) return `${format(startTime, 'EEEE, dd MMMM')}`;

  return `${format(startTime, 'EEEE, dd MMMM yyyy')}`;
}

export const getEventDateBlockRange = (event: Event) => {
  const startTime = convertFromUtcToTimezone(event.start, event.timezone as string);
  const endTime = convertFromUtcToTimezone(event.end, event.timezone as string);

  if (isSameDay(startTime, endTime)) {
    return `${format(startTime, 'hh:mm a')} - ${formatWithTimezone(endTime, 'hh:mm a OOO', event.timezone as string)}`;
  }

  return `${format(startTime, 'hh:mm a')} - ${formatWithTimezone(endTime, 'dd MMM, hh:mm a OOO', event.timezone as string)}`;
};
