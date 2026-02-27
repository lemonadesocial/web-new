import { describe, expect, it, vi } from 'vitest';

// Mock getListChains before importing event utils
vi.mock('$utils/crypto', () => ({
  getListChains: () => [
    {
      tokens: [
        { symbol: 'USDC', decimals: 6 },
        { symbol: 'ETH', decimals: 18 },
        { symbol: 'USDT', decimals: 6 },
      ],
    },
  ],
}));

// Mock the email module
vi.mock('$utils/email', () => ({
  JOIN_REQUEST_STATE_MAP: new Map([
    ['pending', 'Pending'],
    ['approved', 'Approved'],
    ['declined', 'Declined'],
  ]),
  RECIPIENT_TYPE_MAP: new Map([
    ['registration', 'Registered'],
    ['invited', 'Invited'],
  ]),
}));

import {
  formatPrice,
  getEventAddress,
  getEventSubAddress,
  groupTicketTypesByCategory,
  attending,
  hosting,
  isPromoter,
  getAssignedTicket,
  getUnassignedTickets,
  extractShortId,
  formatTokenGateRange,
  filterDirectPaymentAccounts,
} from '$utils/event';

describe('formatPrice', () => {
  it('returns empty string when no payment accounts', () => {
    const price = { cost: '0', currency: 'USD', payment_accounts_expanded: [] } as any;
    expect(formatPrice(price)).toBe('');
  });

  it('returns "Free" when no payment accounts and showFree is true', () => {
    const price = { cost: '0', currency: 'USD', payment_accounts_expanded: [] } as any;
    expect(formatPrice(price, true)).toBe('Free');
  });

  it('returns empty string when payment_accounts_expanded is null', () => {
    const price = { cost: '0', currency: 'USD', payment_accounts_expanded: null } as any;
    expect(formatPrice(price)).toBe('');
  });
});

describe('getEventAddress', () => {
  it('returns undefined when no address', () => {
    expect(getEventAddress(undefined)).toBeUndefined();
  });

  it('returns short format with title, city, country', () => {
    const address = {
      title: 'Test Venue',
      city: 'New York',
      country: 'US',
      street_1: '123 Main St',
      region: 'NY',
    } as any;
    expect(getEventAddress(address, true)).toBe('Test Venue, New York, US');
  });

  it('returns full format with all fields', () => {
    const address = {
      title: 'Test Venue',
      street_1: '123 Main St',
      city: 'New York',
      region: 'NY',
      country: 'US',
    } as any;
    const result = getEventAddress(address);
    expect(result).toContain('Test Venue');
    expect(result).toContain('123 Main St');
    expect(result).toContain('New York');
  });

  it('filters out falsy values', () => {
    const address = {
      title: 'Test Venue',
      street_1: null,
      street_2: undefined,
      city: 'New York',
      country: 'US',
    } as any;
    const result = getEventAddress(address, true);
    expect(result).toBe('Test Venue, New York, US');
  });
});

describe('getEventSubAddress', () => {
  it('returns undefined when no address', () => {
    expect(getEventSubAddress(undefined)).toBeUndefined();
  });

  it('excludes street_1 when it matches title', () => {
    const address = {
      title: 'Test Venue',
      street_1: 'Test Venue',
      city: 'New York',
      country: 'US',
    } as any;
    const result = getEventSubAddress(address);
    expect(result).not.toContain('Test Venue');
    expect(result).toContain('New York');
  });
});

describe('groupTicketTypesByCategory', () => {
  it('groups tickets by category', () => {
    const tickets = [
      { _id: '1', category_expanded: { _id: 'cat1', title: 'VIP' } },
      { _id: '2', category_expanded: { _id: 'cat1', title: 'VIP' } },
      { _id: '3', category_expanded: null },
    ] as any;
    const result = groupTicketTypesByCategory(tickets);
    expect(result).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    expect(groupTicketTypesByCategory([])).toHaveLength(0);
  });
});

describe('attending', () => {
  it('returns true when user is in accepted list', () => {
    const event = { accepted: ['user-1', 'user-2'] } as any;
    expect(attending(event, 'user-1')).toBe(true);
  });

  it('returns false when user is not in accepted list', () => {
    const event = { accepted: ['user-1'] } as any;
    expect(attending(event, 'user-99')).toBe(false);
  });

  it('returns false when user is undefined', () => {
    const event = { accepted: ['user-1'] } as any;
    expect(attending(event, undefined)).toBe(false);
  });
});

describe('hosting', () => {
  it('returns true when user is the host', () => {
    const event = { host: 'user-1', cohosts_expanded_new: [] } as any;
    expect(hosting(event, 'user-1')).toBe(true);
  });

  it('returns true when user is a cohost', () => {
    const event = {
      host: 'user-1',
      cohosts_expanded_new: [{ _id: 'user-2', event_role: 'cohost' }],
    } as any;
    expect(hosting(event, 'user-2')).toBe(true);
  });

  it('returns false when user is neither host nor cohost', () => {
    const event = { host: 'user-1', cohosts_expanded_new: [] } as any;
    expect(hosting(event, 'user-99')).toBe(false);
  });
});

describe('isPromoter', () => {
  it('returns true when user is a gatekeeper', () => {
    const event = {
      cohosts_expanded_new: [{ _id: 'user-2', event_role: 'gatekeeper' }],
    } as any;
    expect(isPromoter(event, 'user-2')).toBe(true);
  });

  it('returns false when user is a cohost but not gatekeeper', () => {
    const event = {
      cohosts_expanded_new: [{ _id: 'user-2', event_role: 'cohost' }],
    } as any;
    expect(isPromoter(event, 'user-2')).toBe(false);
  });
});

describe('getAssignedTicket', () => {
  const tickets = [
    { _id: 't1', assigned_to: 'user-1', assigned_email: null },
    { _id: 't2', assigned_to: null, assigned_email: 'guest@test.com' },
    { _id: 't3', assigned_to: null, assigned_email: null },
  ] as any;

  it('finds ticket by user id', () => {
    expect(getAssignedTicket(tickets, 'user-1')?._id).toBe('t1');
  });

  it('finds ticket by email', () => {
    expect(getAssignedTicket(tickets, undefined, 'guest@test.com')?._id).toBe('t2');
  });

  it('returns undefined when no match', () => {
    expect(getAssignedTicket(tickets, 'no-one', 'no@one.com')).toBeUndefined();
  });
});

describe('getUnassignedTickets', () => {
  it('returns only unassigned tickets', () => {
    const tickets = [
      { _id: 't1', assigned_to: 'user-1', assigned_email: null },
      { _id: 't2', assigned_to: null, assigned_email: null },
      { _id: 't3', assigned_to: null, assigned_email: 'x@y.com' },
    ] as any;
    const result = getUnassignedTickets(tickets);
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('t2');
  });
});

describe('extractShortId', () => {
  it('extracts shortid from lemonade URL', () => {
    expect(extractShortId('https://lemonade.social/e/abc-123')).toBe('abc-123');
  });

  it('returns null for non-matching URL', () => {
    expect(extractShortId('https://example.com/event/123')).toBeNull();
  });
});

describe('filterDirectPaymentAccounts', () => {
  it('returns empty array for null input', () => {
    expect(filterDirectPaymentAccounts(null)).toEqual([]);
  });

  it('returns empty array for undefined input', () => {
    expect(filterDirectPaymentAccounts(undefined)).toEqual([]);
  });

  it('filters to only ethereum accounts', () => {
    const accounts = [
      { _id: '1', type: 'ethereum' },
      { _id: '2', type: 'stripe' },
      { _id: '3', type: 'ethereum_relay' },
      null,
    ] as any;
    const result = filterDirectPaymentAccounts(accounts);
    expect(result).toHaveLength(2);
    expect(result.map((a: any) => a._id)).toEqual(['1', '3']);
  });
});
