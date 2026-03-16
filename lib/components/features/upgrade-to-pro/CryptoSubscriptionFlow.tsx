'use client';

import React from 'react';
import clsx from 'clsx';
import { formatUnits } from 'viem';

import { Button, modal, ModalContent } from '$lib/components/core';
import {
  type Space,
  type SubscriptionItemType,
  type SubscriptionCryptoPrice,
} from '$lib/graphql/generated/backend/graphql';
import {
  useCryptoSubscription,
  type CryptoSubscriptionStatus,
} from '$lib/hooks/useCryptoSubscription';
import { useAppKitAccount, appKit } from '$lib/utils/appkit';
import { getChain } from '$lib/utils/crypto';

interface CryptoSubscriptionFlowProps {
  space: Space;
  cryptoPrices: SubscriptionCryptoPrice[];
  items: SubscriptionItemType[];
  annual: boolean;
  onComplete?: () => void;
}

function StepIndicator({ stepStatus, label }: { stepStatus: 'pending' | 'active' | 'done' | 'error'; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center">
        {stepStatus === 'done' && (
          <i aria-hidden="true" className="icon-check-filled size-5 text-success-500" />
        )}
        {stepStatus === 'active' && (
          <i aria-hidden="true" className="icon-loader size-5 text-tertiary animate-spin" />
        )}
        {stepStatus === 'error' && (
          <i aria-hidden="true" className="icon-error size-5 text-danger-500" />
        )}
        {stepStatus === 'pending' && (
          <i aria-hidden="true" className="icon-circle-outline size-5 text-tertiary" />
        )}
      </div>
      <p className={clsx(
        'text-sm',
        stepStatus === 'active' && 'text-primary',
        stepStatus === 'done' && 'text-success-500',
        stepStatus === 'error' && 'text-danger-500',
        stepStatus === 'pending' && 'text-tertiary',
      )}>
        {label}
      </p>
    </div>
  );
}

function getStepStatus(
  step: 'approve' | 'pay' | 'confirm',
  flowStatus: CryptoSubscriptionStatus,
): 'pending' | 'active' | 'done' | 'error' {
  const statusMap: Record<string, Record<CryptoSubscriptionStatus, 'pending' | 'active' | 'done' | 'error'>> = {
    approve: {
      idle: 'pending',
      approving: 'active',
      paying: 'done',
      confirming: 'done',
      active: 'done',
      error: 'error',
    },
    pay: {
      idle: 'pending',
      approving: 'pending',
      paying: 'active',
      confirming: 'done',
      active: 'done',
      error: 'error',
    },
    confirm: {
      idle: 'pending',
      approving: 'pending',
      paying: 'pending',
      confirming: 'active',
      active: 'done',
      error: 'error',
    },
  };

  return statusMap[step][flowStatus];
}

function formatTokenAmount(amount: string, chainId: string, tokenAddress: string): string {
  const chain = getChain(chainId);
  const token = chain?.tokens?.find(
    (t) => t.contract?.toLowerCase() === tokenAddress.toLowerCase(),
  );
  const decimals = token?.decimals ?? 18;
  const symbol = token?.symbol ?? '';

  const value = formatUnits(BigInt(amount), decimals);
  return `${Number(value).toFixed(2)} ${symbol}`;
}

function CryptoSubscriptionFlowContent({
  space,
  cryptoPrices,
  items,
  annual,
  onComplete,
}: CryptoSubscriptionFlowProps) {
  const { isConnected } = useAppKitAccount();
  const [selectedPrice, setSelectedPrice] = React.useState<SubscriptionCryptoPrice | null>(null);

  const { status, createCryptoSubscription, reset } = useCryptoSubscription({
    space,
    onSuccess: () => {
      onComplete?.();
      // Close modal after a brief delay so user sees the success state
      setTimeout(() => modal.close(), 1500);
    },
    onError: () => {
      // Error is handled by the hook (toast + status)
    },
  });

  const isProcessing = status !== 'idle' && status !== 'error' && status !== 'active';

  const handleConnectWallet = () => {
    appKit.open();
  };

  const handleSelectAndPay = (price: SubscriptionCryptoPrice) => {
    setSelectedPrice(price);
    createCryptoSubscription(
      price.chain_id,
      price.token_address,
      items,
      annual,
    );
  };

  const handleRetry = () => {
    reset();
    setSelectedPrice(null);
  };

  // Step 1: Connect wallet
  if (!isConnected) {
    return (
      <ModalContent title="Pay with Crypto" onClose={() => modal.close()}>
        <div className="flex flex-col gap-4">
          <p className="text-tertiary text-sm">Connect your wallet to pay for your subscription with stablecoins.</p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      </ModalContent>
    );
  }

  // Step 3: Processing flow (after selection)
  if (selectedPrice && status !== 'idle') {
    const chain = getChain(selectedPrice.chain_id);
    const chainName = chain?.name ?? selectedPrice.chain_id;
    const amountStr = annual ? selectedPrice.amount_annual : selectedPrice.amount;

    return (
      <ModalContent
        title="Processing Payment"
        onClose={status === 'error' || status === 'active' ? () => modal.close() : undefined}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-tertiary">
              {formatTokenAmount(amountStr, selectedPrice.chain_id, selectedPrice.token_address)} on {chainName}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <StepIndicator
              stepStatus={getStepStatus('approve', status)}
              label="Approve token spending"
            />
            <StepIndicator
              stepStatus={getStepStatus('pay', status)}
              label="Send payment"
            />
            <StepIndicator
              stepStatus={getStepStatus('confirm', status)}
              label="Waiting for confirmation"
            />
          </div>

          {status === 'active' && (
            <div className="flex items-center gap-2 p-3 rounded-sm bg-success-500/10">
              <i aria-hidden="true" className="icon-check-filled size-5 text-success-500" />
              <p className="text-sm text-success-500">Subscription activated!</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 p-3 rounded-sm bg-danger-500/10">
                <i aria-hidden="true" className="icon-error size-5 text-danger-500" />
                <p className="text-sm text-danger-500">Payment failed. Please try again.</p>
              </div>
              <Button variant="secondary" onClick={handleRetry}>Try Again</Button>
            </div>
          )}
        </div>
      </ModalContent>
    );
  }

  // Step 2: Select chain/token
  return (
    <ModalContent title="Select Payment Token" onClose={() => modal.close()}>
      <div className="flex flex-col gap-3">
        <p className="text-tertiary text-sm">Choose which token and chain to pay with.</p>
        {cryptoPrices.map((price) => {
          const chain = getChain(price.chain_id);
          const chainName = chain?.name ?? price.chain_id;
          const token = chain?.tokens?.find(
            (t) => t.contract?.toLowerCase() === price.token_address.toLowerCase(),
          );
          const tokenSymbol = token?.symbol ?? 'Token';
          const amountStr = annual ? price.amount_annual : price.amount;

          return (
            <button
              key={`${price.chain_id}-${price.token_address}`}
              type="button"
              disabled={isProcessing}
              className="flex items-center justify-between p-3 rounded-sm border border-card-border hover:bg-overlay-primary/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSelectAndPay(price)}
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">{tokenSymbol}</p>
                <p className="text-xs text-tertiary">{chainName}</p>
              </div>
              <p className="text-sm">
                {formatTokenAmount(amountStr, price.chain_id, price.token_address)}
              </p>
            </button>
          );
        })}
      </div>
    </ModalContent>
  );
}

export function openCryptoSubscriptionModal(props: CryptoSubscriptionFlowProps) {
  modal.open(CryptoSubscriptionFlowContent, {
    props,
    dismissible: false,
    className: 'w-[400px] max-w-full',
  });
}
