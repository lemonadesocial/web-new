'use client';

import React from 'react';
import { addMonths, addYears, format } from 'date-fns';

import { Button, Menu, MenuItem, modal } from '$lib/components/core';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
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
import {
  filterCryptoPricesForPeriod,
  getFirstCryptoPriceForPeriod,
  formatPlanTitle,
  formatTokenAmount,
  type WalletPlanOption,
} from './utils';
import { CryptoSubscriptionTransactionModal } from './CryptoSubscriptionTransactionModal';

interface CryptoSubscriptionFlowProps {
  space: Space;
  items: SubscriptionItemType[];
  annual: boolean;
  planOptions: WalletPlanOption[];
  onComplete?: (params: { planType: SubscriptionItemType; annual: boolean }) => void;
}

type CryptoPlanOption = WalletPlanOption;

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

function CryptoSubscriptionFlowContent({
  space,
  items,
  annual,
  planOptions,
  onComplete,
}: CryptoSubscriptionFlowProps) {
  const me = useMe();

  const initialSelectedPlanOption = React.useMemo(() => {
    const requestedPlanType = items[0];
    if (!requestedPlanType) return planOptions.find((option) => option.available) ?? planOptions[0] ?? null;

    return planOptions.find((option) => option.planType === requestedPlanType && option.available)
      ?? planOptions.find((option) => option.available)
      ?? planOptions[0]
      ?? null;
  }, [items, planOptions]);

  const [selectedPlanKey, setSelectedPlanKey] = React.useState<string | null>(
    initialSelectedPlanOption?.key ?? null,
  );
  const [selectedPrice, setSelectedPrice] = React.useState<SubscriptionCryptoPrice | null>(
    getFirstCryptoPriceForPeriod(
      initialSelectedPlanOption?.cryptoPrices ?? [],
      initialSelectedPlanOption?.annual ?? annual,
    ),
  );
  const { tokenMetadata: selectedTokenMeta } = useTokenMetadata(
    selectedPrice?.chain_id,
    selectedPrice?.token_address,
  );
  const [isSelectingPlan, setIsSelectingPlan] = React.useState(false);

  const selectedPlanOption = React.useMemo(() => {
    if (!planOptions.length) return null;

    return planOptions.find((option) => option.key === selectedPlanKey)
      ?? planOptions[0];
  }, [planOptions, selectedPlanKey]);

  const activeCryptoPrices = React.useMemo(() => {
    if (!selectedPlanOption) return [];

    return filterCryptoPricesForPeriod(selectedPlanOption.cryptoPrices, selectedPlanOption.annual);
  }, [selectedPlanOption]);

  React.useEffect(() => {
    if (!selectedPlanOption) return;

    setSelectedPlanKey((prev) => prev ?? selectedPlanOption.key);
    setSelectedPrice((prev) => {
      if (!prev) return getFirstCryptoPriceForPeriod(selectedPlanOption.cryptoPrices, selectedPlanOption.annual);

      const matchingPrice = activeCryptoPrices.find(
        (price) =>
          price.chain_id === prev.chain_id
          && price.token_address.toLowerCase() === prev.token_address.toLowerCase(),
      );

      return matchingPrice ?? getFirstCryptoPriceForPeriod(selectedPlanOption.cryptoPrices, selectedPlanOption.annual);
    });
  }, [activeCryptoPrices, selectedPlanOption]);

  React.useEffect(() => {
    if (!selectedPrice && activeCryptoPrices.length > 0) {
      setSelectedPrice(activeCryptoPrices[0]);
    }
  }, [activeCryptoPrices, selectedPrice]);

  const handleSelectPlan = (option: CryptoPlanOption) => {
    setSelectedPlanKey(option.key);
    setSelectedPrice(getFirstCryptoPriceForPeriod(option.cryptoPrices, option.annual));
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
              planTitle: planOption.title,
              onComplete,
            },
          });
        },
      },
    });
  };

  const selectedChain = selectedPrice ? getChain(selectedPrice.chain_id) : null;
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

      <div className="flex flex-col gap-8 overflow-auto md:overflow-visible md:w-93 p-4 md:p-0 pt-16 md:pt-0">
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
                      {selectedChain?.name || 'Network'}
                    </p>
                  </div>
                  <div className="p-2.5">
                    <i aria-hidden="true" className="icon-chevron-down size-5 text-quaternary" />
                  </div>
                </button>
              </Menu.Trigger>

              <Menu.Content className="w-full p-1 max-h-55 overflow-auto no-scrollbar">
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
                            {chain?.name || price.chain_id}
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

      <div className="px-4 pb-4 md:px-0 md:pb-0 md:w-85">
        <div className="overflow-hidden rounded-lg border border-card-border">
          <div className="space-y-2 p-4">
            <div className="flex items-center gap-3">
              <div className="size-13.5 overflow-hidden rounded-sm border border-card-border bg-tertiary">
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
              <div className="flex max-h-65 flex-col gap-2 overflow-y-auto pb-3 pr-1 no-scrollbar">
                {planOptions.map((option) => {
                  const optionPrice = getFirstCryptoPriceForPeriod(option.cryptoPrices, option.annual);
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
