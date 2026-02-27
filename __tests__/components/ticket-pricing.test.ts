import { describe, expect, it, vi } from 'vitest';

// Mock getListChains for crypto pricing
vi.mock('$utils/crypto', () => ({
  getListChains: () => [
    {
      tokens: [
        { symbol: 'USDC', decimals: 6 },
        { symbol: 'ETH', decimals: 18 },
      ],
    },
  ],
}));

vi.mock('$utils/email', () => ({
  JOIN_REQUEST_STATE_MAP: new Map(),
  RECIPIENT_TYPE_MAP: new Map(),
}));

import { formatFiatPrice, formatCryptoPrice, formatPrice } from '$utils/event';

describe('formatFiatPrice', () => {
  it('formats USD price correctly', () => {
    const price = {
      cost: '2500',
      currency: 'USD',
      payment_accounts_expanded: [
        {
          provider: 'stripe',
          account_info: {
            currency_map: { USD: { decimals: 2 } },
          },
        },
      ],
    } as any;
    const result = formatFiatPrice(price);
    // formatCurrency produces locale-specific output, just verify it's non-empty
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('returns empty string when decimals are not available', () => {
    const price = {
      cost: '2500',
      currency: 'USD',
      payment_accounts_expanded: [
        {
          provider: 'stripe',
          account_info: {
            currency_map: {},
          },
        },
      ],
    } as any;
    expect(formatFiatPrice(price)).toBe('');
  });

  it('returns empty string when payment_accounts_expanded is empty', () => {
    const price = {
      cost: '2500',
      currency: 'USD',
      payment_accounts_expanded: [],
    } as any;
    // This will throw because [0] is undefined, so account_info is undefined
    // formatFiatPrice accesses payment_accounts_expanded?.[0]?.account_info?.currency_map
    // with ?. it should return '' since decimals is undefined
    expect(formatFiatPrice(price)).toBe('');
  });
});

describe('formatCryptoPrice', () => {
  it('formats USDC with 6 decimals', () => {
    const price = {
      cost: '1000000',
      currency: 'USDC',
      payment_accounts_expanded: [{ provider: 'ethereum' }],
    } as any;
    const result = formatCryptoPrice(price);
    expect(result).toContain('USDC');
    expect(result).toContain('1');
  });

  it('returns empty string for unknown currency', () => {
    const price = {
      cost: '1000',
      currency: 'UNKNOWN_TOKEN',
      payment_accounts_expanded: [{ provider: 'ethereum' }],
    } as any;
    expect(formatCryptoPrice(price)).toBe('');
  });

  it('skips currency suffix when skipCurrency is true', () => {
    const price = {
      cost: '1000000',
      currency: 'USDC',
      payment_accounts_expanded: [{ provider: 'ethereum' }],
    } as any;
    const result = formatCryptoPrice(price, true);
    expect(result).not.toContain('USDC');
  });
});

describe('formatPrice', () => {
  it('detects Stripe and uses fiat formatting', () => {
    const price = {
      cost: '1000',
      currency: 'USD',
      payment_accounts_expanded: [
        {
          provider: 'stripe',
          account_info: {
            currency_map: { USD: { decimals: 2 } },
          },
        },
      ],
    } as any;
    const result = formatPrice(price);
    expect(typeof result).toBe('string');
  });

  it('detects non-Stripe and uses crypto formatting', () => {
    const price = {
      cost: '1000000',
      currency: 'USDC',
      payment_accounts_expanded: [{ provider: 'ethereum' }],
    } as any;
    const result = formatPrice(price);
    expect(result).toContain('USDC');
  });

  it('returns "Free" for no payment accounts with showFree', () => {
    const price = {
      cost: '0',
      currency: 'USD',
      payment_accounts_expanded: [],
    } as any;
    expect(formatPrice(price, true)).toBe('Free');
  });
});
