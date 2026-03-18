'use client';

import React from 'react';

import { Button, modal } from '$lib/components/core';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { ErrorModal } from '$lib/components/features/modals/ErrorModal';
import { SignTransactionModal } from '$lib/components/features/modals/SignTransaction';
import {
  type Space,
  type SubscriptionItemType,
  type SubscriptionCryptoPrice,
} from '$lib/graphql/generated/backend/graphql';
import { useTokenMetadata } from '$lib/hooks/useTokenMetadata';
import { getChain } from '$lib/utils/crypto';
import { useCryptoSubscription } from './hooks';
import { formatTokenAmount, getProcessingMessage } from './utils';
import { ASSET_PREFIX } from '$lib/utils/constants';

interface CryptoSubscriptionTransactionModalProps {
  space: Space;
  selectedPrice: SubscriptionCryptoPrice;
  items: SubscriptionItemType[];
  annual: boolean;
  planTitle: string;
  onComplete?: (params: { planType: SubscriptionItemType; annual: boolean }) => void;
}

function CryptoSubscriptionSuccessModal({
  planTitle,
  spaceTitle,
  txUrl,
}: {
  planTitle: string;
  spaceTitle: string;
  txUrl?: string;
}) {
  return (
    <div className="relative size-full w-[340px] max-w-full overflow-hidden rounded-lg border border-card-border bg-overlay-primary shadow-[0px_4px_8px_0px_rgba(0,0,0,0.32)]">
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[240px] bg-gradient-to-b from-[rgba(166,132,255,0)] to-[rgba(166,132,255,0.16)]" />

      <div className="relative flex flex-col">
        <div className="flex justify-center px-4 pb-8 pt-12">
          <div className="size-[132px] overflow-hidden rounded-full shadow-[0px_4px_8px_0px_rgba(0,0,0,0.32)]">
            <img src={`${ASSET_PREFIX}/assets/images/crypto-success.png`} alt="Payment successful" className="size-full rounded-full object-cover" />
          </div>
        </div>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium">You&apos;re All Set!</p>
            <p className="text-sm text-secondary">
              Your {planTitle} plan is now active. {spaceTitle} has been upgraded and all features are unlocked.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              className="h-10 flex-1 justify-center"
              variant="tertiary-alt"
              disabled={!txUrl}
              onClick={() => {
                if (txUrl) window.open(txUrl);
              }}
            >
              View txn.
            </Button>
            <Button
              className="h-10 flex-1 justify-center"
              variant="secondary"
              onClick={() => {
                modal.close(); // close the success modal
                modal.close(); // close the transaction modal
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CryptoSubscriptionTransactionModal({
  space,
  selectedPrice,
  items,
  annual,
  planTitle,
  onComplete,
}: CryptoSubscriptionTransactionModalProps) {
  const { status, txHash, createCryptoSubscription, reset } = useCryptoSubscription({ space });

  const chain = getChain(selectedPrice.chain_id);
  const chainName = chain?.name ?? selectedPrice.chain_id;
  const txUrl = txHash && chain?.block_explorer_url ? `${chain.block_explorer_url}/tx/${txHash}` : undefined;
  const { tokenMetadata } = useTokenMetadata(selectedPrice.chain_id, selectedPrice.token_address);
  const amountStr = annual ? selectedPrice.amount_annual : selectedPrice.amount;
  const amountText = formatTokenAmount(amountStr, tokenMetadata);
  const planType = items[0];

  const handleSign = () => {
    void createCryptoSubscription(
      selectedPrice.chain_id,
      selectedPrice.token_address,
      items,
      annual,
      () => {
        if (!planType) return;
        onComplete?.({ planType, annual });
      },
    );
  };

  if (status === 'idle') {
    return (
      <SignTransactionModal
        title="Confirm Payment"
        description={`Please sign the transaction to pay ${amountText} on ${chainName}. An approval step may appear first.`}
        onSign={handleSign}
        onClose={() => modal.close()}
      />
    );
  }

  if (status === 'error') {
    return (
      <ErrorModal
        title="Payment Failed"
        message="Payment failed. Please try again."
        onRetry={reset}
        onClose={() => modal.close()}
      />
    );
  }

  if (status === 'success') {
    return (
      <CryptoSubscriptionSuccessModal
        planTitle={planTitle}
        spaceTitle={space.title}
        txUrl={txUrl}
      />
    );
  }

  return (
    <ConfirmTransaction
      title="Processing Payment"
      description={getProcessingMessage(status)}
    />
  );
}

export { CryptoSubscriptionTransactionModal };
