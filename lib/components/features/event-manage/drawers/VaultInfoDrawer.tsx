'use client';
import { useAtomValue } from 'jotai';

import { toast, modal, Button } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { formatWallet } from '$lib/utils/crypto';
import { EthereumAccount, NewPaymentAccount, PaymentAccountType } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { AddNetworkModal } from '$lib/components/features/event-manage/modals/AddNetworkModal';
import { ClaimFundsModal } from '$lib/components/features/event-manage/modals/ClaimFundsModal';
import { PaymentNetwork } from '$lib/components/features/event-manage/common/PaymentNetwork';

interface VaultInfoDrawerProps {
  vaults: NewPaymentAccount[];
}

export function VaultInfoDrawer({
  vaults,
}: VaultInfoDrawerProps) {
  const vault = vaults[0];
  const chainsMap = useAtomValue(chainsMapAtom);

  const vaultsByAddress = vaults.reduce((acc, vault) => {
    const address = (vault.account_info as EthereumAccount).address;
    if (!acc[address]) {
      acc[address] = [];
    }
    acc[address].push(vault);
    return acc;
  }, {} as Record<string, NewPaymentAccount[]>);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
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

  const handleClaimFunds = () => {
    modal.open(ClaimFundsModal, {
      props: {
        vaults,
        onClose: () => modal.close()
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
            <div className="space-y-2">
              {Object.entries(vaultsByAddress).map(([address, addressVaults]) => {
                const isSingleEntry = addressVaults.length === 1;
                const networkName = isSingleEntry ? chainsMap[(addressVaults[0].account_info as EthereumAccount).network]?.name : null;

                return (
                  <div key={address} className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {addressVaults.map((vault, index) => (
                        <PaymentNetwork key={index} vault={vault} />
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      {isSingleEntry && networkName && (
                        <p className="text-sm text-secondary">{networkName}:</p>
                      )}
                      <p className="text-sm text-secondary">{formatWallet(address)}</p>
                      <i className="text-tertiary icon-copy size-5 cursor-pointer" onClick={() => handleCopy(address)} />
                    </div>
                  </div>
                );
              })}
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
                    <img src={chain.logo_url || ''} alt={chain.name} className="w-4" />
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

       {
         vault.type === PaymentAccountType.EthereumRelay && (
           <Pane.Footer className="border-t px-4 py-3">
             <Button type="button" variant="secondary" onClick={handleClaimFunds}>
               Claim Funds
             </Button>
           </Pane.Footer>
         )
       }
    </Pane.Root>
  );
}
