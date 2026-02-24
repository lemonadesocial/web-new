'use client';
import { useAtomValue } from 'jotai';

import { ModalContent, Button, modal } from '$lib/components/core';
import { EthereumAccount, NewPaymentAccount } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { ClaimDetailsModal } from './ClaimDetailsModal';

interface ClaimFundsModalProps {
  vaults: NewPaymentAccount[];
  onClose: () => void;
}

export function ClaimFundsModal({ vaults, onClose }: ClaimFundsModalProps) {
  const chainsMap = useAtomValue(chainsMapAtom);

  const handleChainSelect = (vault: NewPaymentAccount) => {
    modal.open(ClaimDetailsModal, {
      props: {
        vault,
        onClose: () => modal.close()
      },
    });
  };

  return (
    <ModalContent
      onClose={onClose}
      icon="icon-money-bag"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div>
            <p className="text-lg">Claim Funds</p>
            <p className="text-lg text-tertiary">Events Vault</p>
          </div>
          <p className="text-sm text-secondary">Select the chain you want to claim from.</p>
        </div>

        <div className="space-y-3">
          {vaults.map((vault) => {
            const network = (vault.account_info as EthereumAccount).network;
            const chain = chainsMap[network];
            if (!chain) return null;

            return (
                <div
                  key={vault._id}
                  className="flex items-center py-1.5 px-3 rounded-sm bg-primary/8 cursor-pointer gap-3"
                  onClick={() => handleChainSelect(vault)}
                >
                <img src={chain.logo_url || ''} alt={chain.name} className="size-5" />
                <div className="flex-1">
                  <p>{chain.name}</p>
                  <p className="text-sm text-tertiary">{vault.account_info.currencies.length} assets</p>
                </div>
                <i className="icon-chevron-right text-tertiary size-5" />
              </div>
            );
          })}
        </div>
      </div>
    </ModalContent>
  );
}
