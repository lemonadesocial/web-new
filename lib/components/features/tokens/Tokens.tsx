'use client';
import React from 'react';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';

import { Button, Card, Skeleton } from '$lib/components/core';
import { RadialProgress } from '$lib/components/core/progess/radial';
import { useQuery } from '$lib/graphql/request';
import { PoolCreatedDocument, FairLaunchDocument, Order_By, type PoolCreated } from '$lib/graphql/generated/coin/graphql';
import { coinClient } from '$lib/graphql/request/instances';
import { chainsMapAtom } from '$lib/jotai/chains';
import { useTokenData, useHoldersCount, useVolume24h } from '$lib/hooks/useCoin';
import { calculateMarketCapData } from '$lib/utils/coin';
import { formatWallet } from '$lib/utils/crypto';
import { getTimeAgo } from '$lib/utils/date';

export function Tokens() {
  return (
    <div className="flex flex-col gap-3 max-sm:pb-28 py-4 md:max-h-[calc(100dvh-56px)]">
      <Toolbar />

      <div className="flex flex-col md:grid grid-cols-3 gap-4 flex-1 overflow-hidden">
        <NewTokensList />
        <GraduatingTokensList />
        <RecentlyGraduatedTokensList />
      </div>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <div className="text-sm flex gap-1 px-2.5 py-1.5 bg-(--btn-tertiary) w-fit rounded-sm">
          <p className="text-tertiary">Quick Buy Size:</p>
          <p className="text-secondary">0.0001 ETH</p>
        </div>
        <Button icon="icon-arrow-down rotate-180" size="sm" variant="tertiary-alt" />
        <Button icon="icon-arrow-down" size="sm" variant="tertiary-alt" />
      </div>

      <Button iconLeft="icon-plus" size="sm" variant="secondary" className="hidden md:block">
        Create Coin
      </Button>

      <Button icon="icon-plus" size="sm" variant="secondary" className="md:hidden">
        Create Coin
      </Button>
    </div>
  );
}

function NewTokensList() {
  const { data, loading } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        orderBy: [
          {
            blockTimestamp: Order_By.Desc,
          },
        ],
        limit: 10,
        offset: 0,
      },
    },
    coinClient,
  );

  const pools = data?.PoolCreated || [];

  return (
    <Card.Root className="flex flex-col flex-1 max-sm:max-h-[700px] h-full">
      <Card.Header>
        <p>New Tokens</p>
      </Card.Header>

      <div className="flex-1 overflow-auto no-scrollbar">
        <Card.Content>
          <div className="flex flex-col gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TokenCardSkeleton key={idx} />
              ))
            ) : (
              pools.map((pool) => (
                <TokenCard key={pool.id} pool={pool} />
              ))
            )}
          </div>
        </Card.Content>
      </div>
    </Card.Root>
  );
}

function GraduatingTokensList() {
  const { data: fairLaunchData, loading: loadingFairLaunch } = useQuery(
    FairLaunchDocument,
    {
      variables: {
        where: {
          closeAt: {
            _is_null: true,
          },
        },
        orderBy: [
          {
            endAt: Order_By.Asc,
          },
        ],
        limit: 10,
        offset: 0,
      },
    },
    coinClient,
  );

  const fairLaunches = fairLaunchData?.FairLaunch || [];
  const poolIds = fairLaunches.map((fl) => fl.poolId);

  const { data: poolsData, loading: loadingPools } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        where: {
          poolId: {
            _in: poolIds,
          },
        }
      },
      skip: poolIds.length === 0,
    },
    coinClient,
  );

  const pools = poolsData?.PoolCreated || [];
  const loading = loadingFairLaunch || loadingPools;

  const sortedPools = React.useMemo(() => {
    if (!pools.length || !fairLaunches.length) return pools;

    const poolMap = new Map(pools.map((pool) => [pool.poolId, pool]));

    return fairLaunches
      .map((fl) => poolMap.get(fl.poolId))
      .filter((pool): pool is PoolCreated => pool !== undefined);
  }, [pools, fairLaunches]);

  return (
    <Card.Root className="flex flex-col flex-1 max-sm:max-h-[700px] h-full">
      <Card.Header>
        <p>Graduating Tokens</p>
      </Card.Header>

      <div className="flex-1 overflow-auto no-scrollbar">
        <Card.Content>
          <div className="flex flex-col gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TokenCardSkeleton key={idx} />
              ))
            ) : (
              sortedPools.map((pool) => (
                <TokenCard key={pool.id} pool={pool} />
              ))
            )}
          </div>
        </Card.Content>
      </div>
    </Card.Root>
  );
}

function RecentlyGraduatedTokensList() {
  const { data: fairLaunchData, loading: loadingFairLaunch } = useQuery(
    FairLaunchDocument,
    {
      variables: {
        where: {
          closeAt: {
            _is_null: false,
          },
        },
        orderBy: [
          {
            closeAt: Order_By.Desc,
          },
        ],
        limit: 10,
        offset: 0,
      },
    },
    coinClient,
  );

  const fairLaunches = fairLaunchData?.FairLaunch || [];
  const poolIds = fairLaunches.map((fl) => fl.poolId);

  const { data: poolsData, loading: loadingPools } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        where: {
          poolId: {
            _in: poolIds,
          },
        },
      },
      skip: poolIds.length === 0,
    },
    coinClient,
  );

  const pools = poolsData?.PoolCreated || [];
  const loading = loadingFairLaunch || loadingPools;

  const sortedPools = React.useMemo(() => {
    if (!pools.length || !fairLaunches.length) return pools;

    const poolMap = new Map(pools.map((pool) => [pool.poolId, pool]));

    return fairLaunches
      .map((fl) => poolMap.get(fl.poolId))
      .filter((pool): pool is PoolCreated => pool !== undefined);
  }, [pools, fairLaunches]);

  return (
    <Card.Root className="flex flex-col flex-1 max-sm:max-h-[700px] h-full">
      <Card.Header>
        <p>Recently Graduated</p>
      </Card.Header>

      <div className="flex-1 overflow-auto no-scrollbar">
        <Card.Content>
          <div className="flex flex-col gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TokenCardSkeleton key={idx} />
              ))
            ) : (
              sortedPools.map((pool) => (
                <TokenCard key={pool.id} pool={pool} />
              ))
            )}
          </div>
        </Card.Content>
      </div>
    </Card.Root>
  );
}

function TokenCardSkeleton() {
  return (
    <Card.Root>
      <Card.Content className="py-3">
        <div className="flex gap-4">
          <Skeleton className="size-[114px] aspect-square rounded-sm" animate />
          <div className="text-tertiary text-sm w-full">
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-5 w-20 mb-1" animate />
                  <Skeleton className="h-4 w-24" animate />
                </div>
                <Skeleton className="size-10 rounded-full" animate />
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-16" animate />
                  <Skeleton className="h-4 w-16" animate />
                  <Skeleton className="h-4 w-12" animate />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" animate />
              </div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

function TokenCard({ pool }: { pool: PoolCreated }) {
  const router = useRouter();
  const chainsMap = useAtomValue(chainsMapAtom);

  const chain = chainsMap[pool.chainId.toString()];
  const { tokenData, isLoadingTokenData } = useTokenData(chain, pool.memecoin, pool.tokenURI as string);
  const { holdersCount, isLoadingHoldersCount } = useHoldersCount(chain, pool.memecoin);
  const { formattedVolumeUSDC, isLoadingVolume } = useVolume24h(chain, pool.memecoin);

  const { formattedAmount } = calculateMarketCapData(
    pool.latestMarketCapETH,
    pool.previousMarketCapETH,
  );

  const timestamp = Number(pool.blockTimestamp) * 1000;
  const timeAgo = getTimeAgo(timestamp);
  const displaySymbol = tokenData?.symbol || formatWallet(pool.memecoin, 4);

  const handleClick = () => {
    router.push(`/coin/${chain.code_name}/${pool.memecoin}`);
  };

  return (
    <Card.Root className="cursor-pointer" onClick={handleClick}>
      <Card.Content className="py-3">
        <div className="flex gap-4">
          {isLoadingTokenData ? (
            <Skeleton className="size-[114px] aspect-square rounded-sm" animate />
          ) : (
            <div className="h-[114px] max-w-[114px] w-full rounded-sm bg-gray-300 overflow-hidden">
              {tokenData?.metadata?.imageUrl && (
                <img
                  src={tokenData.metadata.imageUrl}
                  alt={displaySymbol}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
          <div className="text-tertiary text-sm w-full">
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between">
                <div>
                  <div className="flex gap-1 items-end">
                    <p className="text-base text-primary">{displaySymbol}</p>
                    <p className="text-sm">{timeAgo}</p>
                  </div>
                  <div className="flex gap-1.5 items-center text-sm">
                    <p className="text-tertiary">{formatWallet(pool.memecoin)}</p>
                    <i className="icon-copy size-3.5 aspect-square text-quaternary" />
                  </div>
                </div>

                {/* <RadialProgress value={50} label="1" size="size-10" color="text-blue-400" /> */}
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <p>MC: {formattedAmount}</p>
                  {isLoadingVolume ? (
                    <Skeleton className="h-4 w-16" animate />
                  ) : (
                    <p>VOL: {formattedVolumeUSDC || 'N/A'}</p>
                  )}
                  <div className="flex gap-2 items-center">
                    <i className="icon-user-group-outline size-4" />
                    {isLoadingHoldersCount ? (
                      <Skeleton className="h-4 w-8" animate />
                    ) : (
                      <p className="text-secondary">{holdersCount || 0}</p>
                    )}
                  </div>
                </div>
                <Button variant="tertiary-alt" size="sm" onClick={(e) => e.stopPropagation()}>
                  Quick Buy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
