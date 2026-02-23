'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { useAppKitAccount, useAppKit } from '$lib/utils/appkit';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { SuccessModal } from '$lib/components/features/modals/SuccessModal';
import { Card, ModalContent } from '$lib/components/core';
import { AbstractPassportContract, formatWallet, ZugramaPassportContract } from '$lib/utils/crypto';
import { useClient } from '$lib/graphql/request';
import { CanMintPassportDocument, Chain, PassportProvider } from '$lib/graphql/generated/backend/graphql';
import { ContractAddressFieldMapping, PASSPORT_PROVIDER } from '../../types';
import { usePassportChain } from '$lib/hooks/usePassportChain';

async function checkPassportBalance(provider: PASSPORT_PROVIDER, address: string, chain: Chain) {
  const field = ContractAddressFieldMapping[provider] as keyof Chain;
  const contractAddress = chain[field] as string;

  if (!contractAddress) {
    return 0;
  }

  try {
    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = AbstractPassportContract.attach(contractAddress).connect(provider) as ethers.Contract;
    const balance = await contract.getFunction('balanceOf')(address);
    return Number(balance);
  } catch (error) {
    Sentry.captureException(error);
    return 0;
  }
}

export function CheckWhiteListModal({
  provider,
  passportTitle,
  onContinue,
}: {
  provider: PASSPORT_PROVIDER;
  passportTitle: string;
  onContinue: () => void;
}) {
  const { address } = useAppKitAccount();
  const chain = usePassportChain(provider);
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
      const balance = await checkPassportBalance(provider, address, chain);
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
        description={`We're checking if you already own a ${passportTitle} Passport. This may take a moment.`}
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
              You already own a {passportTitle} Passport. Each wallet can only mint one passport.
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
        description={`We're checking if you're on the ${passportTitle} whitelist. This may take a moment.`}
      />
    );
  }

  if (whitelistData?.canMintPassport.can_mint) {
    return (
      <SuccessModal
        title="You're On The Whitelist!"
        description={`You can now personalize your ${passportTitle} Passport to make it truly yours before minting your on-chain identity.`}
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
            You're not whitelisted to mint your {passportTitle} Passport yet. Register to the {passportTitle} Launch to
            secure your spot.
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
