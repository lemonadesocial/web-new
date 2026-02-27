import * as React from 'react';
import { createPublicClient, custom, type EIP1193Provider } from 'viem';
import { useAtomValue as useJotaiAtomValue } from "jotai";

import { useAppKitNetwork, useAppKitProvider } from '$lib/utils/appkit';
import { getViemChainConfig } from '$lib/utils/crypto';
import { useMutation } from '$lib/graphql/request';
import { UpdatePaymentDocument } from "$lib/graphql/generated/backend/graphql";
import { chainsMapAtom } from "$lib/jotai";

import { registrationModal } from "../store";
import { PaymentProcessingModal } from './PaymentProcessingModal';
import { ErrorModal } from '../../modals/ErrorModal';

interface VerifyingTransactionModalProps {
  paymentId: string;
  txHash: string;
  hasJoinRequest: boolean;
  paymentSecret?: string;
}

export function VerifyingTransactionModal({
  paymentId,
  paymentSecret,
  txHash,
  hasJoinRequest
}: VerifyingTransactionModalProps) {
  const { chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider('eip155');
  const chainsMap = useJotaiAtomValue(chainsMapAtom);

  const [confirmationTime, setConfirmationTime] = React.useState<number | null>(null);
  const [countdown, setCountdown] = React.useState<number | null>(null);
  const [error, setError] = React.useState('');

  const chain = chainId ? chainsMap[chainId.toString()] : undefined;

  const [handleUpdatePayment] = useMutation(UpdatePaymentDocument);

  React.useEffect(() => {
    if (!confirmationTime) return;

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        const newCountdown = (prevCountdown || confirmationTime) - 1;
        if (newCountdown === 0) {
          clearInterval(interval);
        }
        return newCountdown;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [confirmationTime]);

  const waitAndUpdatePayment = async () => {
    if (!walletProvider) throw new Error('Cannot get Web3Provider');
    if (!txHash) throw new Error('Invalid transaction hash');
    if (!chain) throw new Error('Chain not configured');

    const viemChain = getViemChainConfig(chain);
    const publicClient = createPublicClient({
      chain: viemChain,
      transport: custom(walletProvider as EIP1193Provider),
    });

    const transaction = await publicClient.getTransaction({ hash: txHash as `0x${string}` });

    if (!transaction) throw new Error('Unable to get transaction');

    const safeConfirmations = chain?.safe_confirmations || 3;
    const blockTime = chain?.block_time || 15;
    setConfirmationTime(safeConfirmations * blockTime);

    try {
      await publicClient.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
        confirmations: safeConfirmations,
      });
    } catch {
      await new Promise(resolve => setTimeout(resolve, blockTime * 1000));
      await publicClient.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
        confirmations: safeConfirmations,
      });
    }

    await handleUpdatePayment({
      variables: {
        input: {
          _id: paymentId,
          payment_secret: paymentSecret,
        }
      }
    });

    registrationModal.close();

    registrationModal.open(PaymentProcessingModal, {
      props: {
        paymentId,
        paymentSecret,
        hasJoinRequest
      },
      dismissible: false
    });
  };

  const handleRetry = () => {
    setError('');
    waitAndUpdatePayment().catch(e => {
      setError(e instanceof Error ? e.message : 'Please try again');
    });
  };

  React.useEffect(() => {
    handleRetry();
  }, []);

  if (error) return (
    <ErrorModal
      title="Failed to get confirmation"
      message={error}
      onRetry={handleRetry}
      onClose={() => registrationModal.close()}
    />
  );

  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
        {
          !!(countdown && countdown > 0) ? (
            <p className="text-lg text-tertiary">{countdown}</p>
          ) : (
            <i aria-hidden="true" className="icon-loader animate-spin" />
          )
        }
      </div>
      <div className="space-y-2">
        <p className="text-lg">Verifying Transaction</p>
        <p className="text-sm text-secondary">
          Almost there! We&apos;re confirming your transaction and finalizing your ticket. Thank you for your patience!
        </p>
      </div>
    </div>
  );
}
