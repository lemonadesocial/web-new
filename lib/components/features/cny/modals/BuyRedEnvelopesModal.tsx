'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eip1193Provider, ethers } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { Button, ModalContent, modal, toast } from '$lib/components/core';
import { useAppKitAccount, useAppKitProvider, appKit } from '$lib/utils/appkit';
import { checkBalanceSufficient, formatError, writeContract, approveERC20Spender, isNativeToken, RedEnvelopeContract } from '$lib/utils/crypto';
import { RedEnvelopeClient } from '$lib/services/red-envelope';
import { formatUnits } from 'ethers';
import { formatNumber } from '$lib/utils/number';
import { ASSET_PREFIX, MEGAETH_CHAIN_ID } from '$lib/utils/constants';
import { getAsset } from '../utils';
import { RED_ENVELOPE_ADDRESS } from '$lib/services/red-envelope/client';

type BuyRedEnvelopesModalProps = {
  pack: {
    quantity: number;
    price: bigint;
    decimals: number;
  };
  onComplete?: () => void;
};

type Step = 'confirm' | 'signing' | 'packing' | 'onTheWay' | 'ready';

export function BuyRedEnvelopesModal({ pack, onComplete }: BuyRedEnvelopesModalProps) {
  const router = useRouter();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const [step, setStep] = useState<Step>('confirm');
  const [currencyAddress, setCurrencyAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      const client = RedEnvelopeClient.getInstance();
      const currency = await client.getCurrency();
      setCurrencyAddress(currency);
    };

    fetchCurrency();
  }, []);

  const handlePurchase = async () => {
    if (!walletProvider || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!currencyAddress) {
      toast.error('Failed to load currency information');
      return;
    }

    try {
      setStep('signing');

      const isNative = isNativeToken(currencyAddress, MEGAETH_CHAIN_ID.toString());

      await checkBalanceSufficient(
        currencyAddress,
        MEGAETH_CHAIN_ID.toString(),
        pack.price,
        walletProvider as Eip1193Provider,
        address,
      );

      if (!isNative) {
        await approveERC20Spender(
          currencyAddress,
          RED_ENVELOPE_ADDRESS,
          pack.price,
          walletProvider as Eip1193Provider,
        );
      }

      const transaction = await writeContract(
        RedEnvelopeContract,
        RED_ENVELOPE_ADDRESS,
        walletProvider as Eip1193Provider,
        'buyEnvelopes',
        [BigInt(pack.quantity), address],
        { value: isNative ? pack.price : 0 },
      );

      setStep('packing');

      await transaction.wait();

      setStep('ready');
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          walletInfo: appKit.getWalletInfo(),
        },
      });
      toast.error(formatError(error));
      setStep('confirm');
    }
  };

  const handleSendEnvelopes = () => {
    modal.close();
    onComplete?.();
    router.push('/cny/send');
  };

  const handleDoItLater = () => {
    modal.close();
    onComplete?.();
  };

  const priceFormatted = formatUnits(pack.price, pack.decimals);
  const priceNumber = Number(priceFormatted);
  const quantityLabel = pack.quantity === 1 ? '1 envelope' : `${pack.quantity} envelopes`;

  if (step === 'packing') {
    return (
      <div className="p-4 w-[340px] max-w-full">
        <div className="flex justify-end">
          <i className="icon-loader animate-spin text-tertiary size-6" />
        </div>
        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/packing.png`}
              alt="Packing box"
              className="w-[184px] h-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <p className="text-center text-lg">Packing Your Red Envelopes</p>
            <p className="text-sm text-secondary text-center">
              We're carefully packing your red envelopes and getting them ready to go.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'ready') {
    return (
      <div className="p-4 w-[340px] max-w-full space-y-6">
        <div className="flex justify-center">
          <img
            src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/ready.png`}
            alt="Packing box"
            className="w-[232px] h-full object-contain"
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-center text-lg">Red Envelopes Are Ready</p>
            <p className="text-sm text-secondary text-center">
              Fill them with blessings and send good fortune to those you care about.
            </p>
          </div>
          <Button variant="secondary" className="w-full" onClick={handleSendEnvelopes}>
            Send Envelopes
          </Button>
          <p
          className="w-full text-tertiary text-center cursor-pointer"
          onClick={handleDoItLater}
        >
          Do It Later
        </p>
        </div>
      </div>
    );
  }

  return (
    <ModalContent onClose={() => modal.close()}>
      <div className="flex justify-center">
        <img
          src={getAsset(pack.quantity)}
          alt={quantityLabel}
          className="w-full max-w-[144px] h-auto object-contain"
        />
      </div>
      <div className="space-y-4 text-center">
        <div className="space-y-1.5">
          <p className="text-lg">Confirm Your Red Envelopes</p>
          <p className="text-sm text-secondary">
            You're about to purchase {pack.quantity} red envelopes for ${formatNumber(priceNumber)}. Confirm to complete the order and get them ready for gifting.
          </p>
        </div>
        <Button variant="secondary" onClick={handlePurchase} disabled={step === 'signing'} className="w-full">
          {step === 'signing' ? 'Waiting for Signature...' : 'Sign Transaction'}
        </Button>
      </div>
    </ModalContent>
  );
}
