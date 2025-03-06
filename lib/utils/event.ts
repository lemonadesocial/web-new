import { ethers } from 'ethers';

import { EventTicketPrice, EventTicketType, PurchasableTicketType } from '$lib/generated/graphql';
import { formatCurrency } from './number';
import { Currency } from './payment';

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
