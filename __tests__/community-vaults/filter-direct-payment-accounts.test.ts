import { describe, it, expect } from 'vitest';
import { filterDirectPaymentAccounts } from '$lib/utils/event';
import { PaymentAccountType, NewPaymentProvider } from '$lib/graphql/generated/backend/graphql';
import type { NewPaymentAccount } from '$lib/graphql/generated/backend/graphql';

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

describe('filterDirectPaymentAccounts', () => {
  it('should return Ethereum accounts', () => {
    const accounts = [makeAccount({ type: PaymentAccountType.Ethereum })];
    const result = filterDirectPaymentAccounts(accounts);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(PaymentAccountType.Ethereum);
  });

  it('should return EthereumRelay accounts', () => {
    const accounts = [makeAccount({ type: PaymentAccountType.EthereumRelay })];
    const result = filterDirectPaymentAccounts(accounts);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(PaymentAccountType.EthereumRelay);
  });

  it('should filter out non-direct account types', () => {
    const accounts = [
      makeAccount({ _id: '1', type: PaymentAccountType.Ethereum }),
      makeAccount({ _id: '2', type: PaymentAccountType.Digital }),
      makeAccount({ _id: '3', type: PaymentAccountType.EthereumEscrow }),
      makeAccount({ _id: '4', type: PaymentAccountType.EthereumRelay }),
      makeAccount({ _id: '5', type: PaymentAccountType.EthereumStake }),
      makeAccount({ _id: '6', type: PaymentAccountType.Solana }),
    ];
    const result = filterDirectPaymentAccounts(accounts);
    expect(result).toHaveLength(2);
    expect(result.map((a) => a._id)).toEqual(['1', '4']);
  });

  it('should handle null entries in the array', () => {
    const accounts = [
      makeAccount({ type: PaymentAccountType.Ethereum }),
      null,
      undefined,
      makeAccount({ type: PaymentAccountType.EthereumRelay }),
    ];
    const result = filterDirectPaymentAccounts(accounts);
    expect(result).toHaveLength(2);
  });

  it('should return empty array for null input', () => {
    expect(filterDirectPaymentAccounts(null)).toEqual([]);
  });

  it('should return empty array for undefined input', () => {
    expect(filterDirectPaymentAccounts(undefined)).toEqual([]);
  });

  it('should return empty array for empty array input', () => {
    expect(filterDirectPaymentAccounts([])).toEqual([]);
  });

  it('should return empty array when all accounts are non-direct types', () => {
    const accounts = [
      makeAccount({ type: PaymentAccountType.Digital }),
      makeAccount({ type: PaymentAccountType.EthereumEscrow }),
      makeAccount({ type: PaymentAccountType.EthereumStake }),
      makeAccount({ type: PaymentAccountType.Solana }),
    ];
    expect(filterDirectPaymentAccounts(accounts)).toEqual([]);
  });

  it('should return empty array when all entries are null/undefined', () => {
    const accounts = [null, undefined, null];
    expect(filterDirectPaymentAccounts(accounts)).toEqual([]);
  });

  it('should preserve account properties in the output', () => {
    const account = makeAccount({
      _id: 'vault-123',
      type: PaymentAccountType.Ethereum,
      title: 'My Vault',
      active: true,
    });
    const result = filterDirectPaymentAccounts([account]);
    expect(result[0]._id).toBe('vault-123');
    expect(result[0].title).toBe('My Vault');
    expect(result[0].active).toBe(true);
  });
});
