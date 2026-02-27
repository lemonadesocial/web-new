import { describe, it, expect } from 'vitest';
import { groupPaymentAccounts } from '$lib/utils/payment';
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

describe('groupPaymentAccounts', () => {
  it('should return empty object for null input', () => {
    expect(groupPaymentAccounts(null)).toEqual({});
  });

  it('should return empty object for undefined input', () => {
    expect(groupPaymentAccounts(undefined)).toEqual({});
  });

  it('should return empty object for empty array', () => {
    expect(groupPaymentAccounts([])).toEqual({});
  });

  it('should group accounts by title', () => {
    const accounts = [
      makeAccount({ _id: '1', title: 'Vault A' }),
      makeAccount({ _id: '2', title: 'Vault B' }),
      makeAccount({ _id: '3', title: 'Vault A' }),
    ];

    const result = groupPaymentAccounts(accounts);
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['Vault A']).toHaveLength(2);
    expect(result['Vault B']).toHaveLength(1);
  });

  it('should use _id as key when title is empty', () => {
    const accounts = [
      makeAccount({ _id: 'id-1', title: '' }),
      makeAccount({ _id: 'id-2', title: '' }),
    ];

    const result = groupPaymentAccounts(accounts);
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['id-1']).toHaveLength(1);
    expect(result['id-2']).toHaveLength(1);
  });

  it('should handle single account', () => {
    const accounts = [makeAccount({ _id: '1', title: 'Solo Vault' })];
    const result = groupPaymentAccounts(accounts);
    expect(Object.keys(result)).toHaveLength(1);
    expect(result['Solo Vault']).toHaveLength(1);
  });

  it('should preserve account data in groups', () => {
    const account = makeAccount({
      _id: 'vault-123',
      title: 'My Vault',
      type: PaymentAccountType.EthereumRelay,
    });
    const result = groupPaymentAccounts([account]);
    expect(result['My Vault'][0]._id).toBe('vault-123');
    expect(result['My Vault'][0].type).toBe(PaymentAccountType.EthereumRelay);
  });
});
