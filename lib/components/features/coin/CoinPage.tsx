'use client';

import clsx from 'clsx';
import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

import { listChainsAtom } from '$lib/jotai';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { formatWallet, getAddressUrl } from '$lib/utils/crypto';
import { copy } from '$lib/utils/helpers';
import { formatNumber } from '$lib/utils/number';
import { Badge, Card, Skeleton, toast } from '$lib/components/core';

import { useFairLaunch, useFees, useGroup, useHoldersCount, useLiquidity, useMarketCap, useOwner, useTokenData, useTreasuryValue, useVolume24h } from '$lib/hooks/useCoin';
import { useQuery } from '$lib/graphql/request/hooks';
import { ItemsDocument } from '$lib/graphql/generated/backend/graphql';
import { PoolCreatedDocument, Order_By } from '$lib/graphql/generated/coin/graphql';
import { coinClient } from '$lib/graphql/request/instances';
import { CoinTransactions } from './CoinTransactions';
import { CoinHolders } from './CoinHolders';
import { CoinAdvanced } from './CoinAdvanced';
import { StatItem } from './StatItem';
import { SwapCoin } from './SwapCoin';
import { CoinDetail } from './CoinDetail';
import { BuybackCharging } from './BuybackCharging';
import { PriceChart } from './PriceChart';

interface CoinPageProps {
  network: string;
  address: string;
}

export function CoinPage({ network, address }: CoinPageProps) {
  const listChains = useAtomValue(listChainsAtom);
  const chain = listChains.find((chain) => chain.code_name === network);

  if (!chain) return notFound();

  return (
    <div className="max-w-[1256px] mx-auto">
      <div className="gap-4 items-start hidden md:flex">
        <div className="flex flex-col gap-4 w-full">
          <Stats chain={chain!} address={address} />
          <BuybackCharging chain={chain} address={address} />
          <PriceChart chain={chain} address={address} />
          <CoinTabs chain={chain} address={address} />
        </div>

        <div className="flex flex-col gap-4 max-w-[336px] w-full">
          <SwapCoin chain={chain} address={address} />
          <CoinInfo chain={chain} address={address} />
        </div>
      </div>

      <div className="md:hidden pt-4 pb-20">
        <CoinDetail chain={chain} address={address} />
      </div>
    </div>
  );
}

function Stats({ chain, address }: { chain: Chain; address: string }) {
  const { launchpadGroup, treasuryManagerAddress, isLoading } = useGroup(chain, address);
  const { owner, isLoadingOwner } = useOwner(chain, address);
  const { formattedFees, isLoadingFees } = useFees(chain, address);
  const { formattedTreasuryValue, isLoadingTreasuryValue } = useTreasuryValue(chain, address);
  const { formattedMarketCap, isLoadingMarketCap } = useMarketCap(chain, address);
  const { formattedLiquidity, isLoadingLiquidity } = useLiquidity(chain, address);
  const { formattedPercentage, formattedUsdcValue, isLoadingFairLaunch } = useFairLaunch(chain, address);
  const { formattedVolumeUSDC, isLoadingVolume } = useVolume24h(chain, address);
  const { holdersCount, isLoadingHoldersCount } = useHoldersCount(chain, address);

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
          launchpadGroup && treasuryManagerAddress
            ? launchpadGroup?.name || formatWallet(treasuryManagerAddress)
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
        value={formattedVolumeUSDC || 'N/A'}
        loading={isLoadingVolume}
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
        value={holdersCount !== null ? formatNumber(holdersCount) : 'N/A'}
        loading={isLoadingHoldersCount}
      />
    </div>
  );
}

function CoinTabs({ chain, address }: { chain: Chain; address: string }) {
  const tabs: Record<string, React.ReactElement> = {
    transactions: <CoinTransactions chain={chain} address={address} />,
    holders: <CoinHolders chain={chain} address={address} />,
    advanced: <CoinAdvanced chain={chain} address={address} />,
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
  const { formattedMarketCap, isLoadingMarketCap } = useMarketCap(chain, address);

  const { data } = useQuery(ItemsDocument,
    {
      variables: { address, limit: 1 },
    },
  );

  const { data: poolData } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        where: {
          memecoin: {
            _eq: address.toLowerCase(),
          },
          chainId: {
            _eq: Number(chain.chain_id),
          },
        },
        limit: 1,
        offset: 0,
      },
    },
    coinClient,
  );

  const launchpadCoin = data?.listLaunchpadCoins?.items?.[0] || null;
  const pool = poolData?.PoolCreated?.[0];
  const launchDate = pool?.blockTimestamp
    ? format(new Date(Number(pool.blockTimestamp) * 1000), 'MMMM d, yyyy')
    : null;

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

  const addressUrl = getAddressUrl(chain, address);

  return (
    <Card.Root className="w-full">
      <Card.Content className="p-0 divide-y divide-(--color-divider)">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex gap-3">
            {tokenData.metadata?.imageUrl ? (
              <img
                src={tokenData.metadata.imageUrl}
                alt={tokenData.name}
                className="size-[76px] aspect-square rounded-sm object-cover"
              />
            ) : (
              <div className="size-[76px] aspect-square rounded-sm bg-gray-500" />
            )}

            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-3">
                <div className="flex-1">
                  <p>${tokenData.symbol}</p>
                  <p className="line-clamp-1 text-tertiary text-sm">{tokenData.name}</p>
                </div>
                <div className="text-right">
                  {isLoadingMarketCap ? (
                    <Skeleton className="h-5 w-20" animate />
                  ) : (
                    formattedMarketCap && <p className="text-accent-400">{formattedMarketCap}</p>
                  )}
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

          {tokenData.metadata?.description && (
            <p>{tokenData.metadata.description}</p>
          )}

          <div className="flex justify-between items-center text-tertiary [&_a]:hover:text-primary [&_a]:cursor-pointer">
            {(launchpadCoin?.website || launchpadCoin?.handle_telegram || launchpadCoin?.handle_twitter) && (
              <div className="flex gap-3">
                {launchpadCoin?.website && (
                  <a
                    href={launchpadCoin.website.startsWith('http') ? launchpadCoin.website : `https://${launchpadCoin.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="size-5 aspect-square icon-globe" />
                  </a>
                )}
                {launchpadCoin?.handle_telegram && (
                  <a
                    href={launchpadCoin.handle_telegram.startsWith('http') ? launchpadCoin.handle_telegram : `https://t.me/${launchpadCoin.handle_telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="size-5 aspect-square icon-telegram" />
                  </a>
                )}
                {launchpadCoin?.handle_twitter && (
                  <a
                    href={launchpadCoin.handle_twitter.startsWith('http') ? launchpadCoin.handle_twitter : `https://x.com/${launchpadCoin.handle_twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="size-5 aspect-square icon-twitter" />
                  </a>
                )}
              </div>
            )}

            {
              addressUrl && (
                <a href={addressUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  {chain.block_explorer_icon_url ? (
                    <img src={chain.block_explorer_icon_url} alt="Block explorer" className="size-5 aspect-square" />
                  ) : (
                    <i className="size-5 aspect-square icon-basescan-fill" />
                  )}
                </a>
              )
            }
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
            <p className="line-clamp-1 truncate">{pool?.paramsCreator ? formatWallet(pool.paramsCreator) : 'N/A'}</p>
          </div>
        </div>

        {
          launchDate && (
            <div className="p-4 flex gap-4 justify-between text-sm text-tertiary">
            <p className="whitespace-nowrap">Launched on Lemonade</p>
            <p className="whitespace-nowrap">{launchDate}</p>
          </div>
          )
        }
      </Card.Content>
    </Card.Root>
  );
}
