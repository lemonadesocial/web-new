'use client';

import { useState, useEffect } from 'react';
import { getAddress, parseUnits, type Address, type EIP1193Provider } from 'viem';
import * as Sentry from '@sentry/nextjs';

import { Button, ModalContent, modal, toast } from '$lib/components/core';
import { useAppKitAccount, useAppKitProvider, appKit } from '$lib/utils/appkit';
import { createViemClients, isNativeToken, approveERC20Spender } from '$lib/utils/crypto';
import { formatError } from '$lib/utils/error';
import { RedEnvelopeClient } from '$lib/services/red-envelope';
import { ASSET_PREFIX, MEGAETH_CHAIN_ID } from '$lib/utils/constants';
import { RED_ENVELOPE_ADDRESS } from '$lib/services/red-envelope/client';
import { EnvelopeRow } from '../types';
import { getAsset } from '../utils';
import { RedEnvelopeAbi } from '$lib/abis/RedEnvelope';
type SealRedEnvelopesModalProps = {
  selectedRows: EnvelopeRow[];
  currencyDecimals: number;
  onComplete?: () => void;
};

type Step = 'confirm' | 'signing' | 'sealing' | 'success';

export function SealRedEnvelopesModal({ selectedRows, currencyDecimals, onComplete }: SealRedEnvelopesModalProps) {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<EIP1193Provider>('eip155');
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

  const handleSeal = async () => {
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

      const { walletClient, publicClient, account } = await createViemClients(MEGAETH_CHAIN_ID, walletProvider);

      const _seals = selectedRows.map((row) => {
        const recipientWallet = getAddress(row.recipient.trim());
        const amountWei = parseUnits(row.amount || '0', currencyDecimals);
        return {
          recipient: { wallet: recipientWallet, amount: amountWei },
          message: row.message ?? '',
          envelope: BigInt(row.token_id),
        };
      });

      const sumAmountWei = _seals.reduce(
        (acc, s) => acc + s.recipient.amount,
        0n
      );

      if (!isNativeToken(currencyAddress, MEGAETH_CHAIN_ID.toString())) {
        await approveERC20Spender({
          walletClient,
          tokenAddress: currencyAddress as Address,
          spender: RED_ENVELOPE_ADDRESS as Address,
          amount: sumAmountWei,
          account,
        });
      }

      const hash = await walletClient.writeContract({
        abi: RedEnvelopeAbi,
        address: RED_ENVELOPE_ADDRESS as Address,
        functionName: 'seal',
        args: [_seals],
        account
      });

      setStep('sealing');

      await publicClient.waitForTransactionReceipt({ hash });

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

  const uniqueRecipients = new Set(
    selectedRows.map((row) => row.recipient.trim().toLowerCase())
  ).size;
  const envelopeCount = selectedRows.length;
  const envelopeText = envelopeCount === 1 ? 'envelope' : 'envelopes';
  const recipientText = uniqueRecipients === 1 ? 'recipient' : 'recipients';

  if (step === 'sealing') {
    return (
      <div className="p-4 w-[340px] max-w-full">
        <div className="flex justify-end">
          <i aria-hidden="true" className="icon-loader animate-spin text-tertiary size-6" />
        </div>
        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/sending.png`}
              alt="Sealing envelopes"
              className="w-[197px] h-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <p className="text-center text-lg">On the Way...</p>
            <p className="text-sm text-secondary text-center">
              Your red envelopes are being delivered to your recipients.
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
            alt="Sealed envelopes"
            className="w-[185px] h-full object-contain"
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-center text-lg">Red Envelopes Sent!</p>
            <p className="text-sm text-secondary text-center">
              Your gifts have been sent. Now all that’s left is for them to open and receive your blessings.
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
          src={getAsset(selectedRows.length)}
          alt="Red envelopes"
          className="w-full max-w-[144px] h-auto object-contain"
        />
      </div>
      <div className="space-y-4 text-center">
        <div className="space-y-1.5">
          <p className="text-lg">Send Your Red Envelopes</p>
          <p className="text-sm text-secondary">
            You're about to send {envelopeCount} red {envelopeText} to {uniqueRecipients} {recipientText}. Confirm to seal and send your gifts.
          </p>
        </div>
        <Button variant="secondary" onClick={handleSeal} disabled={step === 'signing'} className="w-full">
          {step === 'signing' ? 'Waiting for Signature...' : 'Sign Transaction'}
        </Button>
      </div>
    </ModalContent>
  );
}
