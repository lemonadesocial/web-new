'use client';

import { useState } from 'react';

import { Button, drawer, toast, modal } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { formatWallet } from '$lib/utils/crypto';
import { EthereumAccount, NewPaymentAccount } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { useAtomValue } from 'jotai';
import { AddNetworkModal } from '$lib/components/features/event-manage/modals/AddNetworkModal';

interface VaultInfoDrawerProps {
  vaults: NewPaymentAccount[];
}

export function VaultInfoDrawer({
  vaults,
}: VaultInfoDrawerProps) {
  const vault = vaults[0];
  const chainsMap = useAtomValue(chainsMapAtom);

  const tokenBalances = [
    { symbol: 'ETH', amount: '3.2', icon: 'icon-ethereum' },
    { symbol: 'ETH', amount: '3.2', icon: 'icon-ethereum' },
    { symbol: 'USDC', amount: '23,273', icon: 'icon-usdc' },
    { symbol: 'USDC', amount: '23,273', icon: 'icon-usdc' },
    { symbol: 'USDT', amount: '3.2', icon: 'icon-usdt' },
  ];

  const networks = [
    { name: 'Ethereum', icon: 'icon-ethereum' },
    { name: 'Polygon', icon: 'icon-polygon' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText((vault.account_info as EthereumAccount).address)
      .then(() => {
        toast.success('Copied!');
      });
  };

  const handleAddNetwork = () => {
    modal.open(AddNetworkModal, {
      props: {
        vault
      },
    });
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left className="flex items-center gap-3">
          <p>Vault Info</p>
        </Pane.Header.Left>
      </Pane.Header.Root>

      <Pane.Content className="flex flex-col">
        <div className="p-4 space-y-3">
          <div className="size-12 rounded-full bg-primary/8 flex items-center justify-center">
            <i className="size-7 text-tertiary icon-account-balance" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold">{vault.title || 'Untitled Vault'}</h1>
            <div className="flex items-center gap-1">
              <p className="text-sm text-secondary">{formatWallet((vault.account_info as EthereumAccount).address)}</p>
              <i className="text-tertiary icon-copy size-5 cursor-pointer" onClick={handleCopy} />
            </div>
          </div>
        </div>

        <hr className="border-t border-divider" />

        <div className="flex-1 overflow-y-auto no-scrollbar p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              {vaults.map((vault, index) => {
                const network = (vault.account_info as EthereumAccount).network;
                const chain = chainsMap[network];

                return (
                  <div
                    key={index}
                    className="size-7 rounded-full border border-card-border flex items-center justify-center"
                  >
                    <img src={chain.logo_url} alt={chain.name} className="w-4" />
                  </div>
                )
              })}
              <div className="flex py-1 px-2.5 rounded-full border gap-1.5 items-center cursor-pointer" onClick={handleAddNetwork}>
                <i className="icon-plus size-4 text-secondary" />
                <p className="text-secondary text-sm">Add Network</p>
              </div>
            </div>
          </div>
        </div>
      </Pane.Content>
    </Pane.Root>
  );
}
