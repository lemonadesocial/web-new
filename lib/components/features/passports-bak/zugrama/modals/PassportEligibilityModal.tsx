'use client';
import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';

import { useAppKitAccount, useAppKit } from '$lib/utils/appkit';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { SuccessModal } from '$lib/components/features/modals/SuccessModal';
import { Card, ModalContent } from '$lib/components/core';
import { formatWallet, ZugramaPassportContract } from '$lib/utils/crypto';
import { useClient } from '$lib/graphql/request';
import { CanMintPassportDocument, Chain, PassportProvider } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { PASSPORT_CHAIN_ID } from '../../utils';

async function checkPassportBalance(address: string, chain: Chain) {
  const contractAddress = chain.zugrama_passport_contract_address;

  if (!contractAddress) {
    return 0;
  }

  try {
    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = ZugramaPassportContract.attach(contractAddress).connect(provider) as ethers.Contract;
    const balance = await contract.getFunction('balanceOf')(address);
    return Number(balance);
  } catch (error) {
    console.error('Error checking passport balance:', error);
    return 0;
  }
}

export function PassportEligibilityModal({ onContinue }: { onContinue: () => void }) {
  const { address } = useAppKitAccount();
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[PASSPORT_CHAIN_ID];
  const { open } = useAppKit();
  const { client } = useClient();

  const [balanceData, setBalanceData] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [whitelistData, setWhitelistData] = useState<any>(null);
  const [whitelistLoading, setWhitelistLoading] = useState(false);

  useEffect(() => {
    if (!address || !chain) {
      return;
    }

    (async () => {
      setBalanceLoading(true);
      const balance = await checkPassportBalance(address, chain);
      setBalanceData(balance);
      setBalanceLoading(false);

      if (balance) return;

      setWhitelistLoading(true);
      const { data } = await client.query({
        query: CanMintPassportDocument,
        variables: {
          wallet: address,
          provider: PassportProvider.Zugrama,
        },
      });
      setWhitelistData(data);
      setWhitelistLoading(false);
    })();
  }, [address, chain, client]);

  if (balanceLoading) {
    return (
      <ConfirmTransaction
        title="Checking Your Access"
        description="We're checking if you already own a Zugrama Passport. This may take a moment."
      />
    );
  }

  if (balanceData) {
    return (
      <ModalContent>
        <div className="space-y-4">
          <div className="size-[56px] flex justify-center items-center rounded-full bg-warning-300/16">
            <i className="icon-error text-warning-300" />
          </div>
          <div className="space-y-2">
            <p className="text-lg">You Already Have a Passport</p>
            <p className="text-sm text-secondary">
              You already own a Zugrama Passport. Each wallet can only mint one passport.
            </p>
          </div>

          <Card.Root className="border-none bg-none">
            <Card.Content className="justify-between flex items-center py-2 px-3">
              <div className="flex gap-3">
                <i className="icon-wallet size-5 aspect-square text-tertiary" />
                {address && <p>{formatWallet(address!)}</p>}
              </div>
              <i
                className="icon-edit-sharp size-5 aspect-square text-quaternary hover:text-primary"
                onClick={() => open()}
              />
            </Card.Content>
          </Card.Root>
        </div>
      </ModalContent>
    );
  }

  if (whitelistLoading) {
    return (
      <ConfirmTransaction
        title="Checking Your Access"
        description="We're checking if you're on the Zugrama whitelist. This may take a moment."
      />
    );
  }

  if (whitelistData?.canMintPassport.can_mint) {
    return (
      <SuccessModal
        title="You're On The Whitelist!"
        description="You can now personalize your Zugrama Passport to make it truly yours before minting your on-chain identity."
        buttonText="Continue"
        onClose={onContinue}
      />
    );
  }

  return (
    <ModalContent>
      <div className="space-y-4">
        <div className="size-[56px] flex justify-center items-center rounded-full bg-warning-300/16">
          <i className="icon-error text-warning-300" />
        </div>
        <div className="space-y-2">
          <p className="text-lg">You're Not on the List Yet</p>
          <p className="text-sm text-secondary">
            You're not whitelisted to mint your Zugrama Passport yet. Register to the Zugrama Launch to secure your
            spot.
          </p>
        </div>

        <Card.Root className="border-none bg-none">
          <Card.Content className="justify-between flex items-center py-2 px-3">
            <div className="flex gap-3">
              <i className="icon-wallet size-5 aspect-square text-tertiary" />
              {address && <p>{formatWallet(address!)}</p>}
            </div>
            <i
              className="icon-edit-sharp size-5 aspect-square text-quaternary hover:text-primary"
              onClick={() => open()}
            />
          </Card.Content>
        </Card.Root>

        {/* <Button variant="secondary" className="w-full" onClick={() => window.open('/e/lemonheadslaunch', '_blank')}>
        View Event
      </Button> */}
      </div>
    </ModalContent>
  );
}
