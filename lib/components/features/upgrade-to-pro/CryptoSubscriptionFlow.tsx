'use client';

import React from 'react';
import { addMonths, addYears, format } from 'date-fns';

import { Button, Menu, MenuItem, modal } from '$lib/components/core';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { ErrorModal } from '$lib/components/features/modals/ErrorModal';
import { SignTransactionModal } from '$lib/components/features/modals/SignTransaction';
import { SuccessModal } from '$lib/components/features/modals/SuccessModal';
import {
  type Space,
  type SubscriptionItemType,
  type SubscriptionCryptoPrice,
} from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';
import { useTokenMetadata } from '$lib/hooks/useTokenMetadata';
import { communityAvatar } from '$lib/utils/community';
import { getChain } from '$lib/utils/crypto';
import { userAvatar } from '$lib/utils/user';
import { useCryptoSubscription } from './hooks';
import {
  formatPlanTitle,
  formatTokenAmount,
  getProcessingMessage,
  getTokenSymbol,
  type WalletPlanOption,
} from './utils';

interface CryptoSubscriptionFlowProps {
  space: Space;
  cryptoPrices: SubscriptionCryptoPrice[];
  items: SubscriptionItemType[];
  annual: boolean;
  planOptions?: WalletPlanOption[];
  onComplete?: () => void;
}

type CryptoPlanOption = WalletPlanOption;

interface CryptoSubscriptionTransactionModalProps {
  space: Space;
  selectedPrice: SubscriptionCryptoPrice;
  items: SubscriptionItemType[];
  annual: boolean;
  onComplete?: () => void;
}

function TokenSymbolText({ chainId, tokenAddress }: { chainId: string; tokenAddress: string }) {
  const { tokenMetadata } = useTokenMetadata(chainId, tokenAddress);

  return <>{getTokenSymbol(tokenMetadata)}</>;
}

function TokenAmountText({
  amount,
  chainId,
  tokenAddress,
}: {
  amount: string;
  chainId: string;
  tokenAddress: string;
}) {
  const { tokenMetadata } = useTokenMetadata(chainId, tokenAddress);

  return <>{formatTokenAmount(amount, tokenMetadata)}</>;
}

function CryptoSubscriptionTransactionModal({
  space,
  selectedPrice,
  items,
  annual,
  onComplete,
}: CryptoSubscriptionTransactionModalProps) {
  const { status, createCryptoSubscription, reset } = useCryptoSubscription({
    space,
    onSuccess: () => {
      onComplete?.();
      setTimeout(() => modal.close(), 1500);
    },
    onError: () => {
      // Error is handled by the hook (toast + status)
    },
  });

  const chain = getChain(selectedPrice.chain_id);
  const chainName = chain?.name ?? selectedPrice.chain_id;
  const { tokenMetadata } = useTokenMetadata(selectedPrice.chain_id, selectedPrice.token_address);
  const amountStr = annual ? selectedPrice.amount_annual : selectedPrice.amount;
  const amountText = formatTokenAmount(amountStr, tokenMetadata);

  const handleSign = () => {
    void createCryptoSubscription(
      selectedPrice.chain_id,
      selectedPrice.token_address,
      items,
      annual,
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

  if (status === 'active') {
    return (
      <SuccessModal
        title="Subscription Activated!"
        description={`${amountText} on ${chainName} has been confirmed.`}
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

function CryptoSubscriptionFlowContent({
  space,
  cryptoPrices,
  items,
  annual,
  planOptions,
  onComplete,
}: CryptoSubscriptionFlowProps) {
  const me = useMe();
  const normalizedPlanOptions = React.useMemo<CryptoPlanOption[]>(() => {
    if (planOptions?.length) {
      return planOptions;
    }

    const item = items[0];
    if (!item || !cryptoPrices.length) return [];

    return [{
      key: item,
      planType: item,
      title: formatPlanTitle(item),
      annual,
      cryptoPrices,
      available: cryptoPrices.length > 0,
    }];
  }, [annual, cryptoPrices, items, planOptions]);

  const initialSelectedPlanOption = React.useMemo(() => {
    const requestedPlanType = items[0];
    if (!requestedPlanType) return normalizedPlanOptions[0] ?? null;

    return normalizedPlanOptions.find((option) => option.planType === requestedPlanType)
      ?? normalizedPlanOptions[0]
      ?? null;
  }, [items, normalizedPlanOptions]);

  const [selectedPlanKey, setSelectedPlanKey] = React.useState<string | null>(
    initialSelectedPlanOption?.key ?? null,
  );
  const [selectedPrice, setSelectedPrice] = React.useState<SubscriptionCryptoPrice | null>(
    initialSelectedPlanOption?.cryptoPrices[0] ?? null,
  );
  const { tokenMetadata: selectedTokenMeta } = useTokenMetadata(
    selectedPrice?.chain_id,
    selectedPrice?.token_address,
  );
  const [isSelectingPlan, setIsSelectingPlan] = React.useState(false);

  const selectedPlanOption = React.useMemo(() => {
    if (!normalizedPlanOptions.length) return null;

    return normalizedPlanOptions.find((option) => option.key === selectedPlanKey)
      ?? normalizedPlanOptions[0];
  }, [normalizedPlanOptions, selectedPlanKey]);

  const activeCryptoPrices = selectedPlanOption?.cryptoPrices ?? [];

  React.useEffect(() => {
    if (!selectedPlanOption) return;

    setSelectedPlanKey((prev) => prev ?? selectedPlanOption.key);
    setSelectedPrice((prev) => {
      if (!prev) return selectedPlanOption.cryptoPrices[0] ?? null;

      const matchingPrice = selectedPlanOption.cryptoPrices.find(
        (price) =>
          price.chain_id === prev.chain_id
          && price.token_address.toLowerCase() === prev.token_address.toLowerCase(),
      );

      return matchingPrice ?? selectedPlanOption.cryptoPrices[0] ?? null;
    });
  }, [selectedPlanOption]);

  React.useEffect(() => {
    if (!selectedPrice && activeCryptoPrices.length > 0) {
      setSelectedPrice(activeCryptoPrices[0]);
    }
  }, [activeCryptoPrices, selectedPrice]);

  const handleSelectPlan = (option: CryptoPlanOption) => {
    setSelectedPlanKey(option.key);
    setSelectedPrice(option.cryptoPrices[0] ?? null);
  };

  const handleOpenConnectWallet = () => {
    const price = selectedPrice;
    const planOption = selectedPlanOption;
    const planType = planOption?.planType;

    if (!price || !planOption || !planType || !planOption.available) return;

    const chain = getChain(price.chain_id);

    modal.open(ConnectWallet, {
      props: {
        chain,
        onConnect: () => {
          modal.open(CryptoSubscriptionTransactionModal, {
            props: {
              space,
              selectedPrice: price,
              items: [planType],
              annual: planOption.annual,
              onComplete,
            },
          });
        },
      },
    });
  };

  // Step 2: Select chain/token
  const selectedChain = selectedPrice ? getChain(selectedPrice.chain_id) : null;
  const selectedTokenSymbol = selectedPrice
    ? getTokenSymbol(selectedTokenMeta)
    : 'Token';
  const amountStr = selectedPrice
    ? ((selectedPlanOption?.annual ?? annual) ? selectedPrice.amount_annual : selectedPrice.amount)
    : '0';
  const total = selectedPrice
    ? formatTokenAmount(amountStr, selectedTokenMeta)
    : '--';
  const planTitle = selectedPlanOption?.title ?? formatPlanTitle(items[0]);
  const selectedPlanLabel = planTitle.replace(/^Lemonade\s+/i, '');
  const isAnnualPlan = selectedPlanOption?.annual ?? annual;
  const renewalDate = format(
    isAnnualPlan ? addYears(new Date(), 1) : addMonths(new Date(), 1),
    'MMM d, yyyy',
  );
  const followerCount = Number(space.followers_count ?? 0).toLocaleString('en-US');

  return (
    <div className="h-dvh overflow-auto w-screen bg-background/80 [backdrop-filter:var(--backdrop-filter)] flex flex-col-reverse justify-end md:justify-center md:flex-row md:pt-24 md:gap-12">
      <div className="absolute right-4 top-4">
        <Button
          variant="tertiary-alt"
          icon="icon-x"
          className="rounded-full"
          onClick={() => modal.close()}
          size="sm"
        >
          Close
        </Button>
      </div>

      <div className="flex flex-col gap-8 overflow-auto md:overflow-visible md:w-[372px] p-4 md:p-0 pt-16 md:pt-0">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Your Info</h3>
          <div className="flex items-center gap-3">
            <img
              src={userAvatar(me)}
              alt={me?.name || 'User avatar'}
              className="size-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{me?.name || 'Lemonade User'}</p>
                <i aria-hidden="true" className="icon-edit-outline-sharp size-4 text-tertiary" />
              </div>
              <p className="text-sm text-secondary">{me?.email || ''}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Payment</h3>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-secondary">Preferred Network</p>
            <Menu.Root placement="bottom-start" withFlip>
              <Menu.Trigger>
                <button
                  type="button"
                  className="flex w-full items-center overflow-hidden rounded-sm bg-(--btn-tertiary)"
                >
                  <div className="flex flex-1 items-center gap-2.5 px-3.5 py-2">
                    {selectedChain?.logo_url ? (
                      <img src={selectedChain.logo_url} className="size-5" alt={selectedChain.name} />
                    ) : (
                      <i aria-hidden="true" className="icon-wallet size-5 text-tertiary" />
                    )}
                    <p className="flex-1 text-left">
                      {selectedChain?.name || 'Network'} {selectedTokenSymbol ? `• ${selectedTokenSymbol}` : ''}
                    </p>
                  </div>
                  <div className="p-2.5">
                    <i aria-hidden="true" className="icon-chevron-down size-5 text-quaternary" />
                  </div>
                </button>
              </Menu.Trigger>

              <Menu.Content className="w-full p-1 max-h-[220px] overflow-auto no-scrollbar">
                {({ toggle }) => (
                  <>
                    {activeCryptoPrices.map((price) => {
                      const chain = getChain(price.chain_id);

                      return (
                        <MenuItem
                          key={`${price.chain_id}-${price.token_address}`}
                          className="max-w-full"
                          iconLeft={chain?.logo_url ? <img src={chain.logo_url} className="size-5" /> : 'icon-wallet'}
                          iconRight={
                            selectedPrice?.chain_id === price.chain_id
                            && selectedPrice?.token_address.toLowerCase() === price.token_address.toLowerCase()
                              ? 'icon-done'
                              : undefined
                          }
                          onClick={() => {
                            setSelectedPrice(price);
                            toggle();
                          }}
                        >
                          <p className="flex-1 truncate">
                            {chain?.name || price.chain_id} • <TokenSymbolText chainId={price.chain_id} tokenAddress={price.token_address} />
                          </p>
                        </MenuItem>
                      );
                    })}
                  </>
                )}
              </Menu.Content>
            </Menu.Root>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleOpenConnectWallet}
              disabled={!selectedPrice || !selectedPlanOption?.available}
            >
              Pay with Wallet
            </Button>
            <p className="text-center text-sm text-tertiary">
              Doesn&apos;t auto-renew. Renew manually before {renewalDate} to keep your access.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 md:px-0 md:pb-0 md:w-[340px]">
        <div className="overflow-hidden rounded-lg border border-card-border">
          <div className="space-y-2 p-4">
            <div className="flex items-center gap-3">
              <div className="size-[54px] overflow-hidden rounded-sm border border-card-border bg-tertiary">
                <img
                  src={communityAvatar(space)}
                  alt={space.title}
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-md">{space.title}</p>
                <p className="text-sm text-tertiary">{followerCount} subscribers</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <p className="text-tertiary">Plan</p>
              <button
                type="button"
                className={[
                  'inline-flex items-center gap-2 text-md font-medium',
                  isSelectingPlan ? 'text-accent-500' : 'text-primary',
                ].join(' ')}
                onClick={() => setIsSelectingPlan((prev) => !prev)}
              >
                <span>{isSelectingPlan ? 'Done' : selectedPlanLabel}</span>
                {!isSelectingPlan && <i aria-hidden="true" className="icon-chevron-right size-5 text-quaternary" />}
              </button>
            </div>

            {isSelectingPlan && (
              <div className="flex max-h-[260px] flex-col gap-2 overflow-y-auto pb-3 pr-1 no-scrollbar">
                {normalizedPlanOptions.map((option) => {
                  const optionPrice = option.cryptoPrices[0];
                  const isSelected = selectedPlanOption?.key === option.key;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      className={[
                        'w-full rounded-sm px-3 py-2 text-left',
                        !option.available && 'opacity-70',
                        isSelected ? 'bg-background border border-white' : 'bg-(--btn-tertiary) border border-transparent',
                      ].join(' ')}
                      onClick={() => handleSelectPlan(option)}
                    >
                      <p className={isSelected ? 'text-primary' : 'text-secondary'}>{option.title}</p>
                      <p className={isSelected ? 'text-primary' : 'text-secondary'}>
                        {optionPrice ? (
                          <TokenAmountText
                            amount={option.annual ? optionPrice.amount_annual : optionPrice.amount}
                            chainId={optionPrice.chain_id}
                            tokenAddress={optionPrice.token_address}
                          />
                        ) : 'Unavailable'}
                      </p>
                      {isSelected && option.description && (
                        <p className="mt-1 text-sm text-secondary">{option.description}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-card-border px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-tertiary">Total</p>
              <p className="text-right text-xl font-semibold font-title">{total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function openCryptoSubscriptionModal(props: CryptoSubscriptionFlowProps) {
  modal.open(CryptoSubscriptionFlowContent, {
    props,
    dismissible: false,
    skipBaseClassName: true,
  });
}
