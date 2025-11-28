'use client';

import clsx from 'clsx';
import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { notFound } from 'next/navigation';

import { listChainsAtom } from '$lib/jotai';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { formatWallet } from '$lib/utils/crypto';
import { copy } from '$lib/utils/helpers';
import { Badge, Card, Skeleton, toast } from '$lib/components/core';

import { useFairLaunch, useFees, useGroup, useLiquidity, useMarketCap, useOwner, useTokenData, useTreasuryValue } from '$lib/hooks/useCoin';
import { RegistrationTransactions } from './RegistrationTransactions';
import { RegistrationHolders } from './RegistrationHolders';
import { RegistrationAvanced } from './RegistrationAvanced';
import { StatItem } from './StatItem';
import { SwapCoin } from './SwapCoin';
import { CoinDetail } from './CoinDetail';
import { BuybackCharging } from './BuybackCharging';

interface CoinPageProps {
  network: string;
  address: string;
}

export function CoinPage({ network, address }: CoinPageProps) {
  const listChains = useAtomValue(listChainsAtom);
  const chain = listChains.find((chain) => chain.code_name === network);

  if (!chain) return notFound();

  return (
    <>
      <div className="gap-4 items-start hidden md:flex">
        <div className="flex flex-col gap-4">
          <Stats chain={chain!} address={address} />
          <BuybackCharging />
          <Registration />
        </div>

        <div className="flex-col gap-4 max-w-[336px] w-full">
          <SwapCoin chain={chain} address={address} />
          <CoinInfo chain={chain} address={address} />
        </div>
      </div>

      <div className="md:hidden pt-4 pb-20">
        <CoinDetail chain={chain} address={address} />
      </div>
    </>
  );
}

function Stats({ chain, address }: { chain: Chain; address: string }) {
  const { launchpadGroup, implementationAddress, isLoading } = useGroup(chain, address);
  const { owner, isLoadingOwner } = useOwner(chain, address);
  const { formattedFees, isLoadingFees } = useFees(chain, address);
  const { formattedTreasuryValue, isLoadingTreasuryValue } = useTreasuryValue(chain, address);
  const { formattedMarketCap, isLoadingMarketCap } = useMarketCap(chain, address);
  const { formattedLiquidity, isLoadingLiquidity } = useLiquidity(chain, address);
  const { formattedPercentage, formattedUsdcValue, isLoadingFairLaunch } = useFairLaunch(chain, address);

  return (
    <div className="grid grid-cols-5 gap-3">
      <StatItem
        title="Owner"
        value={owner ? formatWallet(owner) : 'N/A'}
        loading={isLoadingOwner}
      />
      <StatItem
        title="Community"
        value={
          launchpadGroup && implementationAddress
            ? launchpadGroup?.name || formatWallet(implementationAddress)
            : 'N/A'
        }
        loading={isLoading}
      />
      <StatItem
        title="Fees Earned"
        value={formattedFees || 'N/A'}
        loading={isLoadingFees}
      />
      <StatItem
        title="Treasury"
        value={formattedTreasuryValue || 'N/A'}
        loading={isLoadingTreasuryValue}
      />
      <StatItem
        title="Volume (24h)"
        value="Coming Soon"
      />
      <StatItem
        title="Marketcap"
        value={formattedMarketCap || 'N/A'}
        loading={isLoadingMarketCap}
      />
      <StatItem
        title="Liquidity"
        value={formattedLiquidity || 'N/A'}
        loading={isLoadingLiquidity}
      />
      <StatItem
        title="Fair Launch"
        value={formattedPercentage && formattedUsdcValue ? `${formattedUsdcValue} / ${formattedPercentage}` : 'N/A'}
        loading={isLoadingFairLaunch}
      />
      <StatItem
        title="Holders"
        value="Coming Soon"
      />
    </div>
  );
}

function Registration() {
  const tabs: Record<string, React.ReactElement> = {
    transactions: <RegistrationTransactions />,
    holders: <RegistrationHolders />,
    advanced: <RegistrationAvanced />,
  };

  const [selected, setSelected] = useState('transactions');
  return (
    <Card.Root>
      <Card.Content className="p-0">
        <ul className="flex gap-4 overflow-auto px-4 pt-1 border-b text-tertiary h-[42px]">
          {Object.entries(tabs).map(([key, _]) => (
            <li
              key={key}
              className={clsx(
                'pb-2.5 cursor-pointer hover:text-primary',
                key === selected && 'border-b-2 border-primary text-primary',
              )}
              onClick={() => setSelected(key)}
            >
              <p className="capitalize">{key}</p>
            </li>
          ))}
        </ul>
        <div className="p-4">{tabs[selected]}</div>
      </Card.Content>
    </Card.Root>
  );
}

function CoinInfo({ chain, address }: { chain: Chain; address: string }) {
  const { tokenData, isLoadingTokenData } = useTokenData(chain, address);
  const { launchpadGroup } = useGroup(chain, address);

  if (isLoadingTokenData) {
    return (
      <Card.Root className="w-full">
        <Card.Content className="p-4 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="size-[76px] rounded-sm" animate />
            <Skeleton className="h-5 w-32 rounded-md" animate />
          </div>
          <Skeleton className="h-15 w-full rounded-md" animate />
          <Skeleton className="h-4 w-3/4 rounded-md" animate />
          <Skeleton className="h-4 w-fullrounded-md" animate />
        </Card.Content>
      </Card.Root>
    );
  }

  if (!tokenData) return null;

  return (
    <Card.Root className="w-full">
      <Card.Content className="p-0 divide-y divide-(--color-divider)">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex gap-3">
            <div className="size-[76px] aspect-square rounded-sm bg-gray-500" />

            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-3">
                <div className="flex-1">
                  <p>${tokenData.symbol}</p>
                  <p className="line-clamp-1 text-tertiary text-sm">{tokenData.name}</p>
                </div>
                <div className="text-right">
                  {/* <p className="text-accent-400">$683.17K</p> */}
                  {/* <p className={clsx('text-sm', percent > 0 ? 'text-success-500' : 'text-danger-500')}>+6.28%</p> */}
                </div>
              </div>
              <Badge className="text-tertiary bg-quaternary flex gap-1">
                <p className="text-xs">{formatWallet(address)}</p>
                <i
                  className="icon-copy size-4 aspect-square"
                  onClick={() => copy(address, () => toast.success('Copied address!'))}
                />
              </Badge>
            </div>
          </div>

          <p>
            Introducing Lemonade Stable Dollar, the ultimate cryptocurrency designed for seamless transactions and
            vibrant community engagement.
          </p>

          <div className="flex justify-between items-center text-tertiary [&_i]:hover:text-primary [&_i]:cursor-pointer">
            <div className="flex gap-3">
              <i className="size-5 aspect-square icon-globe" />
              <i className="size-5 aspect-square icon-instagram" />
              <i className="size-5 aspect-square icon-telegram" />
              <i className="size-5 aspect-square icon-tiktok" />
              <i className="size-5 aspect-square icon-twitter" />
              <i className="size-5 aspect-square icon-youtube-outline" />
            </div>

            <div className="flex gap-3">
              <i className="size-5 aspect-square icon-basescan-fill" />
              <i className="size-5 aspect-square icon-dexscreener-fill" />
            </div>
          </div>
        </div>

        {launchpadGroup && (
          <div className="p-4 flex gap-10 items-center text-sm text-tertiary">
            <p className="flex-1">Community</p>
            <div className="flex gap-1.5 items-center overflow-hidden">
              <div className="size-4 aspect-square rounded-xs bg-gray-500" />
              <p className="line-clamp-1 truncate">{launchpadGroup.name}</p>
            </div>
          </div>
        )}

        <div className="p-4 flex gap-10 items-center text-sm text-tertiary">
          <p className="flex-1">Creator</p>
          <div className="flex gap-1.5 items-center overflow-hidden">
            <p className="line-clamp-1 truncate">johndoe.eth</p>
          </div>
        </div>

        <div className="p-4 flex gap-10 items-center text-sm text-tertiary">
          <p className="flex-1">Launched on Lemonade</p>
          <div className="flex gap-1.5 items-center overflow-hidden">
            <p className="line-clamp-1 truncate">July 29, 2023</p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
