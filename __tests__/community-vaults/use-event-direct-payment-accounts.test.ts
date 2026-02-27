import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEventDirectPaymentAccounts } from '$lib/hooks/useEventDirectPaymentAccounts';
import { PaymentAccountType, NewPaymentProvider } from '$lib/graphql/generated/backend/graphql';
import type { Event, NewPaymentAccount } from '$lib/graphql/generated/backend/graphql';

function makeAccount(overrides: Partial<NewPaymentAccount> = {}): NewPaymentAccount {
  return {
    _id: 'acc-1',
    type: PaymentAccountType.Ethereum,
    provider: NewPaymentProvider.Ethereum,
    active: true,
    created_at: '2024-01-01',
    user: 'user-1',
    title: 'Test Vault',
    account_info: {},
    ...overrides,
  } as NewPaymentAccount;
}

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    _id: 'event-1',
    payment_accounts_expanded: [],
    ...overrides,
  } as Event;
}

describe('useEventDirectPaymentAccounts', () => {
  it('should return empty array when event is null', () => {
    const { result } = renderHook(() => useEventDirectPaymentAccounts(null));
    expect(result.current.directPaymentAccounts).toEqual([]);
  });

  it('should return empty array when event is undefined', () => {
    const { result } = renderHook(() => useEventDirectPaymentAccounts(undefined));
    expect(result.current.directPaymentAccounts).toEqual([]);
  });

  it('should return empty array when event has no payment accounts', () => {
    const event = makeEvent({ payment_accounts_expanded: [] });
    const { result } = renderHook(() => useEventDirectPaymentAccounts(event));
    expect(result.current.directPaymentAccounts).toEqual([]);
  });

  it('should return only direct payment accounts (Ethereum + EthereumRelay)', () => {
    const event = makeEvent({
      payment_accounts_expanded: [
        makeAccount({ _id: '1', type: PaymentAccountType.Ethereum }),
        makeAccount({ _id: '2', type: PaymentAccountType.Digital }),
        makeAccount({ _id: '3', type: PaymentAccountType.EthereumRelay }),
        makeAccount({ _id: '4', type: PaymentAccountType.EthereumStake }),
      ],
    });

    const { result } = renderHook(() => useEventDirectPaymentAccounts(event));
    expect(result.current.directPaymentAccounts).toHaveLength(2);
    expect(result.current.directPaymentAccounts.map((a) => a._id)).toEqual(['1', '3']);
  });

  it('should handle null entries in payment_accounts_expanded', () => {
    const event = makeEvent({
      payment_accounts_expanded: [
        makeAccount({ _id: '1', type: PaymentAccountType.Ethereum }),
        null,
        makeAccount({ _id: '2', type: PaymentAccountType.EthereumRelay }),
      ],
    } as unknown as Partial<Event>);

    const { result } = renderHook(() => useEventDirectPaymentAccounts(event));
    expect(result.current.directPaymentAccounts).toHaveLength(2);
  });

  it('should memoize the result when payment accounts do not change', () => {
    const event = makeEvent({
      payment_accounts_expanded: [
        makeAccount({ _id: '1', type: PaymentAccountType.Ethereum }),
      ],
    });

    const { result, rerender } = renderHook(() => useEventDirectPaymentAccounts(event));
    const firstResult = result.current.directPaymentAccounts;

    rerender();
    expect(result.current.directPaymentAccounts).toBe(firstResult);
  });

  it('should update when payment accounts change', () => {
    const event1 = makeEvent({
      payment_accounts_expanded: [
        makeAccount({ _id: '1', type: PaymentAccountType.Ethereum }),
      ],
    });
    const event2 = makeEvent({
      payment_accounts_expanded: [
        makeAccount({ _id: '1', type: PaymentAccountType.Ethereum }),
        makeAccount({ _id: '2', type: PaymentAccountType.EthereumRelay }),
      ],
    });

    const { result, rerender } = renderHook(
      ({ event }) => useEventDirectPaymentAccounts(event),
      { initialProps: { event: event1 } }
    );
    expect(result.current.directPaymentAccounts).toHaveLength(1);

    rerender({ event: event2 });
    expect(result.current.directPaymentAccounts).toHaveLength(2);
  });
});
