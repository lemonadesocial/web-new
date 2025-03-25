import { ethers } from 'ethers';
import { format, isSameDay, isSameYear } from 'date-fns';

import {
  Address,
  Event,
  EventTicketPrice,
  EventTicketType,
  PurchasableTicketType,
} from '$lib/generated/backend/graphql';

import { formatCurrency } from './number';
import { Currency } from './payment';
import { convertFromUtcToTimezone, formatWithTimezone } from './date';

export function formatCryptoCurrency(price: EventTicketPrice, skipCurrency: boolean = false) {
  const { cost, currency } = price;
  const decimals = window.supportedPaymentChains
    ?.flatMap(({ tokens }) => tokens)
    ?.find((token) => token?.symbol === price.currency)?.decimals;

  if (!decimals) {
    console.error('Cannot find currency decimals.');
    return '';
  }
  if (skipCurrency) return ethers.formatUnits(cost, decimals);

  return `${ethers.formatUnits(cost, decimals)} ${currency.toUpperCase()}`;
}

export function getTicketCost(ticket: EventTicketType | PurchasableTicketType) {
  const defaultPrice: EventTicketPrice = ticket.prices.find((price) => price.default) || ticket.prices[0];

  if (defaultPrice.cost === '0') return 'Free';

  const isStripe = defaultPrice.payment_accounts_expanded?.[0]?.provider === 'stripe';

  if (isStripe) return formatCurrency(Number(defaultPrice.cost), defaultPrice.currency as Currency);

  return formatCryptoCurrency(defaultPrice);
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
