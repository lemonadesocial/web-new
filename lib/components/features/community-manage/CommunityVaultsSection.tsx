'use client';

import React, { useMemo } from 'react';
import { debounce } from 'lodash';
import { Button, Card, InputField, modal, Skeleton, toast } from '$lib/components/core';
import { Space, NewPaymentAccount, NewPaymentProvider, PaymentAccountType } from '$lib/graphql/generated/backend/graphql';
import { CreateDirectVaultModal } from '$lib/components/features/modals/CreateDirectVaultModal';
import { useMutation } from '$lib/graphql/request';
import { AttachSpacePaymentAccountDocument } from '$lib/graphql/generated/backend/graphql';
import { useAtomValue } from 'jotai';
import { listChainsAtom } from '$lib/jotai';
import { groupPaymentAccounts } from '$lib/utils/payment';

const TYPE_LABEL: Record<string, string> = {
  [PaymentAccountType.Ethereum]: 'Direct',
  [PaymentAccountType.EthereumRelay]: 'Relay',
  [PaymentAccountType.EthereumEscrow]: 'Escrow',
  [PaymentAccountType.EthereumStake]: 'Stake',
  [PaymentAccountType.Digital]: 'Digital',
  [PaymentAccountType.Solana]: 'Solana',
};

function getNetwork(account: NewPaymentAccount): string | undefined {
  const info = account.account_info as { network?: string } | undefined;
  return info?.network;
}

export type CommunityVaultsSectionProps = {
  space: Space;
  items: NewPaymentAccount[];
  loading: boolean;
  refetch: () => void;
};

export function CommunityVaultsSection({ space, items, loading, refetch }: CommunityVaultsSectionProps) {
  const chains = useAtomValue(listChainsAtom);
  const [query, setQuery] = React.useState('');
  const [search, setSearch] = React.useState('');

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 400),
    []
  );

  React.useEffect(() => {
    debouncedSetSearch(query);
    return () => debouncedSetSearch.cancel();
  }, [query, debouncedSetSearch]);

  const [attachSpacePaymentAccount] = useMutation(AttachSpacePaymentAccountDocument, {
    onComplete: () => {
      toast.success('Vault added to community');
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleAddVault = () => {
    modal.open(CreateDirectVaultModal, {
      props: {
        onCreateVault(paymentAccount: NewPaymentAccount) {
          if (paymentAccount._id && space._id) {
            attachSpacePaymentAccount({
              variables: { space: space._id, paymentAccount: paymentAccount._id },
            });
          }
        },
      },
      className: 'overflow-visible',
    });
  };

  const vaultItems = items.filter((i) => i.provider !== NewPaymentProvider.Stripe);
  const filteredVaults = search.trim()
    ? vaultItems.filter((v) => v.title?.toLowerCase().includes(search.trim().toLowerCase()))
    : vaultItems;
  const groupedPaymentAccounts = groupPaymentAccounts(filteredVaults);
  const paymentAccountList = Object.values(groupedPaymentAccounts);
  const total = vaultItems.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold">Vaults ({total})</h2>
        <Button variant="secondary" size="sm" iconLeft="icon-plus" onClick={handleAddVault}>
          Add Vault
        </Button>
      </div>

      <InputField
        value={query}
        onChangeText={setQuery}
        iconLeft="icon-search"
        placeholder="Search"
      />

      <Card.Root className="w-full">
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[640px] gap-x-4"
            style={{ gridTemplateColumns: '1fr 80px 100px 70px 70px 70px' }}
          >
            <div
              className="grid gap-x-4 px-4 py-3 text-sm font-medium text-tertiary border-b border-(--color-divider)"
              style={{ gridColumn: '1 / -1', gridTemplateColumns: 'subgrid' }}
            >
              <span>Name</span>
              <span>Type</span>
              <span>Networks</span>
              <span>Admins</span>
              <span>Assets</span>
              <span>Events</span>
            </div>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid gap-x-4 items-center px-4 py-3 border-b border-(--color-divider)"
                  style={{ gridColumn: '1 / -1', gridTemplateColumns: 'subgrid' }}
                >
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-5 w-8" />
                </div>
              ))
            ) : (
              paymentAccountList.map((accounts) => {
                const account = accounts[0] as NewPaymentAccount;
                const network = getNetwork(account);
                const chain = chains?.find((c) => c.chain_id === network);
                const typeLabel = TYPE_LABEL[account.type] ?? account.type;
                return (
                  <div
                    key={account._id}
                    className="grid gap-x-4 items-center px-4 py-3 border-b border-(--color-divider) last:border-b-0"
                    style={{ gridColumn: '1 / -1', gridTemplateColumns: 'subgrid' }}
                  >
                    <span className="font-medium truncate">
                      {account.title || 'Unnamed vault'}
                      {accounts.length > 1 ? ` (${accounts.length})` : ''}
                    </span>
                    <span className="flex">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary/20 text-secondary">
                        {typeLabel}
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      {network ? (
                        chain?.logo_url ? (
                          <div className="size-6 rounded-full bg-tertiary/20 flex items-center justify-center overflow-hidden">
                            <img src={chain.logo_url} alt="" className="size-4" />
                          </div>
                        ) : (
                          <div className="size-6 rounded-full bg-[#627EEA]/20 flex items-center justify-center">
                            <i aria-hidden="true" className="icon-eth text-[10px] text-[#627EEA]" />
                          </div>
                        )
                      ) : (
                        <span className="text-xs text-tertiary">&mdash;</span>
                      )}
                    </div>
                    <div className="flex justify-center items-center gap-1 text-secondary">
                      <span className="text-sm">&mdash;</span>
                    </div>
                    <div className="flex justify-center items-center gap-1 text-secondary">
                      <span className="text-sm">&mdash;</span>
                    </div>
                    <div className="flex justify-center items-center gap-1 text-secondary">
                      <span className="text-sm">&mdash;</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {!loading && vaultItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <i aria-hidden="true" className="icon-wallet size-16 text-quaternary mb-4" />
            <p className="text-secondary font-medium">No vaults yet</p>
            <p className="text-sm text-tertiary mt-1">Create a direct vault to accept crypto payments for this community.</p>
            <Button variant="tertiary-alt" size="sm" iconLeft="icon-plus" className="mt-4" onClick={handleAddVault}>
              Add Vault
            </Button>
          </div>
        )}
      </Card.Root>
    </div>
  );
}
