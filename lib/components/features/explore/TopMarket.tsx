'use client';
import React from 'react';
import { formatEther } from 'viem';
import { useAtomValue } from 'jotai';
import { useQuery } from '$lib/graphql/request/hooks';
import { coinClient } from '$lib/graphql/request/instances';
import {
  PoolCreatedDocument,
  type PoolCreatedQuery,
  type PoolCreatedQueryVariables,
  Order_By,
} from '$lib/graphql/generated/coin/graphql';
import { Card } from '$lib/components/core';
import { LemonheadLeaderBoardRank } from '../lemonheads/LemonheadLeaderBoardRank';
import { formatNumber } from '$lib/utils/number';
import { formatWallet } from '$lib/utils/crypto';
import { chainsMapAtom } from '$lib/jotai/chains';
import { useTokenData } from '$lib/hooks/useCoin';
import type { PoolCreated } from '$lib/graphql/generated/coin/graphql';
import clsx from 'clsx';

export function TopMarket() {
  const { data, loading } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        where: {
          latestMarketCapETH: {
            _is_null: false,
          },
        },
        orderBy: [
          {
            latestMarketCapETH: Order_By.Desc,
          },
        ],
        limit: 5,
        offset: 0,
      },
      fetchPolicy: 'network-only',
    },
    coinClient,
  );

  const pools = data?.PoolCreated || [];

  return (
    <Card.Root className="flex-1 w-full">
      <Card.Header className="border-b">
        <p>Top Market</p>
      </Card.Header>
      <Card.Content className="divide-y divide-(--color-divider) p-0">
        {loading && (
          <>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex gap-3 items-center px-4 py-3">
                <LemonheadLeaderBoardRank rank={idx + 1} className="size-6 text-primary" />
                <div className="size-10 aspect-square rounded-sm bg-gray-500 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-500 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-gray-500 rounded animate-pulse" />
                </div>
                <div className="text-right">
                  <div className="h-4 w-20 bg-gray-500 rounded animate-pulse mb-1" />
                  <div className="h-3 w-16 bg-gray-500 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </>
        )}
        {!loading && pools.length === 0 && (
          <div className="px-4 py-8 text-center text-tertiary">
            <p>No market cap data available</p>
          </div>
        )}
        {!loading &&
          pools.map((pool, idx) => (
            <TopMarketItem key={pool.id} pool={pool} rank={idx + 1} />
          ))}
      </Card.Content>
    </Card.Root>
  );
}

function TopMarketItem({ pool, rank }: { pool: PoolCreated; rank: number }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[pool.chainId.toString()];
  const { tokenData, isLoadingTokenData } = useTokenData(chain, pool.memecoin);

  const latestMarketCapETH = pool.latestMarketCapETH ? BigInt(pool.latestMarketCapETH) : BigInt(0);
  const previousMarketCapETH = pool.previousMarketCapETH ? BigInt(pool.previousMarketCapETH) : null;

  const formattedMarketCap = formatEther(latestMarketCapETH);
  const marketCapNumber = Number(formattedMarketCap);
  const formattedAmount = marketCapNumber > 0 ? `${formatNumber(marketCapNumber)} ETH` : '0 ETH';

  let percentageChange: number | null = null;
  if (previousMarketCapETH !== null && previousMarketCapETH > 0) {
    const latest = Number(latestMarketCapETH);
    const previous = Number(previousMarketCapETH);
    if (previous !== 0) {
      percentageChange = ((latest - previous) / previous) * 100;
    }
  }

  const displayName = tokenData?.name || formatWallet(pool.memecoin, 6);
  const displaySymbol = tokenData?.symbol || formatWallet(pool.memecoin, 4);

  return (
    <div className="flex gap-3 items-center px-4 py-3">
      <LemonheadLeaderBoardRank rank={rank} className="size-6 text-primary" />
      {tokenData?.metadata?.imageUrl ? (
        <img
          src={tokenData.metadata.imageUrl}
          alt={displayName}
          className="size-10 aspect-square rounded-sm object-cover"
        />
      ) : (
        <div className="size-10 aspect-square rounded-sm bg-gray-500" />
      )}
      <div className="flex-1">
        {isLoadingTokenData && chain ? (
          <>
            <div className="h-4 w-32 bg-gray-500 rounded animate-pulse mb-2" />
            <div className="h-3 w-24 bg-gray-500 rounded animate-pulse" />
          </>
        ) : (
          <>
            <p className="line-clamp-1">{displayName}</p>
            <p className="text-sm text-tertiary uppercase">{displaySymbol}</p>
          </>
        )}
      </div>
      <div className="text-right">
        <p>{formattedAmount}</p>
        {percentageChange !== null && (
          <p className={clsx('text-sm', percentageChange > 0 ? 'text-success-500' : 'text-danger-500')}>
            {percentageChange > 0 && '+'}
            {percentageChange.toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  );
}

