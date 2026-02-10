'use client';

import { useState } from 'react';
import { Eip1193Provider } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { Button, ModalContent, modal, toast } from '$lib/components/core';
import { useAppKitAccount, useAppKitProvider, appKit } from '$lib/utils/appkit';
import { formatError, writeContract, RedEnvelopeContract } from '$lib/utils/crypto';
import { RED_ENVELOPE_ADDRESS } from '$lib/services/red-envelope/client';
import { ASSET_PREFIX } from '$lib/utils/constants';

type ClaimRedEnvelopeModalProps = {
  envelopeId: bigint | number | string;
  onComplete?: () => void;
};

type Step = 'confirm' | 'signing' | 'claiming' | 'success';

export function ClaimRedEnvelopeModal({ envelopeId, onComplete }: ClaimRedEnvelopeModalProps) {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const [step, setStep] = useState<Step>('confirm');

  const handleClaim = async () => {
    if (!walletProvider || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setStep('signing');

      const transaction = await writeContract(
        RedEnvelopeContract,
        RED_ENVELOPE_ADDRESS,
        walletProvider as Eip1193Provider,
        'claim',
        [BigInt(envelopeId)],
      );

      setStep('claiming');

      await transaction.wait();

      setStep('success');
    } catch (error: any) {
      console.log(error);
      Sentry.captureException(error, {
        extra: {
          walletInfo: appKit.getWalletInfo(),
        },
      });
      toast.error(formatError(error));
      setStep('confirm');
    }
  };

  const handleClose = () => {
    modal.close();
    onComplete?.();
  };

  if (step === 'claiming') {
    return (
      <div className="p-4 w-[340px] max-w-full">
        <div className="flex justify-end">
          <i className="icon-loader animate-spin text-tertiary size-6" />
        </div>
        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/packing.png`}
              alt="Claiming envelope"
              className="w-[184px] h-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <p className="text-center text-lg">Claiming Your Red Envelope</p>
            <p className="text-sm text-secondary text-center">
              Processing your claim. Please wait while we confirm your red envelope.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="p-4 w-[340px] max-w-full space-y-6">
        <div className="flex justify-center">
          <img
            src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/ready.png`}
            alt="Claimed envelope"
            className="w-[232px] h-full object-contain"
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-center text-lg">Red Envelope Claimed</p>
            <p className="text-sm text-secondary text-center">
              Congratulations! Your red envelope has been successfully claimed.
            </p>
          </div>
          <Button variant="secondary" onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ModalContent onClose={() => modal.close()}>
      <div className="flex justify-center">
        <img
          src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/packing.png`}
          alt="Red envelope"
          className="w-full max-w-[144px] h-auto object-contain"
        />
      </div>
      <div className="space-y-4 text-center">
        <div className="space-y-1.5">
          <p className="text-lg">Claim Your Red Envelope</p>
          <p className="text-sm text-secondary">
            You're about to claim red envelope #{envelopeId.toString()}. Confirm to complete the claim and receive your gift.
          </p>
        </div>
        <Button variant="secondary" onClick={handleClaim} disabled={step === 'signing'} className="w-full">
          {step === 'signing' ? 'Waiting for Signature...' : 'Sign Transaction'}
        </Button>
      </div>
    </ModalContent>
  );
}
