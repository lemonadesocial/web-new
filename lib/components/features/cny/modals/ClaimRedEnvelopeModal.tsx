'use client';

import { useState } from 'react';
import { formatUnits } from 'ethers';
import { Eip1193Provider } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { Button, ModalContent, modal, toast } from '$lib/components/core';
import { useAppKitAccount, useAppKitProvider, appKit } from '$lib/utils/appkit';
import { formatError, writeContract, RedEnvelopeContract } from '$lib/utils/crypto';
import { RED_ENVELOPE_ADDRESS } from '$lib/services/red-envelope/client';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { formatNumber } from '$lib/utils/number';
import { formatWallet } from '$lib/utils/crypto';

import type { Envelope } from '$lib/graphql/generated/coin/graphql';

type ClaimRedEnvelopeModalProps = {
  envelope: Envelope;
  decimals: number;
  symbol: string;
  onComplete?: () => void;
};

type Step = 'entry' | 'confirm' | 'signing' | 'claiming' | 'success';

export function ClaimRedEnvelopeModal({
  envelope,
  decimals,
  symbol,
  onComplete,
}: ClaimRedEnvelopeModalProps) {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const [step, setStep] = useState<Step>('entry');

  const ownerDisplay = formatWallet(envelope.owner);
  const amount = envelope.amount
    ? formatNumber(Number(formatUnits(envelope.amount, decimals)))
    : '—';
  const amountLabel = envelope.amount
    ? `${amount} ${symbol}`
    : '—';
  const hasMessage = Boolean(envelope.message?.trim());

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
        [BigInt(envelope.token_id)],
      );

      setStep('claiming');

      await transaction.wait();

      setStep('success');
    } catch (error: unknown) {
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
          <i aria-hidden="true" className="icon-loader animate-spin text-tertiary size-6" />
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
            src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/sent.png`}
            alt="Claimed envelope"
            className="w-[232px] h-full object-contain"
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-center text-lg">Gift Claimed!</p>
            <p className="text-sm text-secondary text-center">
              {amountLabel} has been added to your wallet. May it bring you good fortune.
            </p>
          </div>
          <Button variant="secondary" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'entry') {
    return (
      <ModalContent onClose={() => modal.close()} className="w-[480px]">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStep('confirm')}
          onKeyDown={(e) => e.key === 'Enter' && setStep('confirm')}
          className="flex flex-col items-center gap-4 cursor-pointer"
        >
          <div className="relative flex justify-center">
            <img
              src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/unclaimed.png`}
              alt="Red Envelope"
              className="w-[240px] h-auto object-contain"
            />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-lg">Red Envelope from {ownerDisplay}</p>
            <p className="text-sm text-secondary">Tap to open and see what's inside.</p>
          </div>
        </div>
      </ModalContent>
    );
  }

  const description = hasMessage
    ? `You've received ${amountLabel} from ${ownerDisplay} as a gift of good fortune, along with their personal wishes for you.`
    : `You've received ${amountLabel} from ${ownerDisplay} as a gift of good fortune.`;

  return (
    <ModalContent onClose={() => modal.close()} className="w-[480px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex justify-center">
          <img
            src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/red-envelope.png`}
            alt="Red Envelope"
            className="w-[300px] h-auto object-contain"
          />
          {envelope.amount && (
            <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex justify-center items-center gap-2 py-4 px-5 rounded-full border bg-woodsmoke-950/64 backdrop-blur-[12px]">
              <p className="text-2xl">${amount}</p>
            </div>
          )}
        </div>

        {hasMessage && (
          <div className="relative flex justify-center">
            <div className="flex justify-center items-center gap-2 py-2 px-3 rounded-md bg-[var(--btn-secondary)] relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-full before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-[var(--btn-secondary)]">
              <p className="text-[var(--btn-secondary-content)]">{envelope.message}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 text-center w-full">
          <p className="text-lg">A Gift for You</p>
          <p className="text-sm text-secondary">{description}</p>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleClaim}
          disabled={step === 'signing'}
        >
          {step === 'signing' ? 'Waiting for Signature...' : 'Claim'}
        </Button>
      </div>
    </ModalContent>
  );
}
