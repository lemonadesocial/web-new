'use client';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';

import { useQuery } from '$lib/graphql/request/hooks';
import { coinClient } from '$lib/graphql/request/instances';
import { TradeVolumeDocument, Order_By } from '$lib/graphql/generated/coin/graphql';
import { Card } from '$lib/components/core';
import { LemonheadLeaderBoardRank } from '../lemonheads/LemonheadLeaderBoardRank';
import { formatWallet } from '$lib/utils/crypto';
import { chainsMapAtom } from '$lib/jotai/chains';
import { useTokenData } from '$lib/hooks/useCoin';
import type { TradeVolume } from '$lib/graphql/generated/coin/graphql';
import { TopEmptyComp } from './TopEmptyComp';

export function TopTrades() {
  const today = new Date().toISOString().split('T')[0];

  const { data, loading } = useQuery(
    TradeVolumeDocument,
    {
      variables: {
        where: {
          date: {
            _eq: today,
          },
        },
        orderBy: [
          {
            tradeCount: Order_By.Desc,
          },
        ],
        limit: 5,
        offset: 0,
      },
      fetchPolicy: 'network-only',
    },
    coinClient,
  );

  const volumes = data?.TradeVolume || [];

  return (
    <Card.Root className="flex flex-col flex-1 w-full">
      <Card.Header className="border-b">
        <p>Most Trades (24h)</p>
      </Card.Header>
      <Card.Content className="flex-1 divide-y divide-(--color-divider) p-0">
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
                  <div className="h-4 w-20 bg-gray-500 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </>
        )}
        {!loading && volumes.length === 0 && (
          <TopEmptyComp
            icon="icon-arrow-up-down-line"
            title="No trades yet"
            subtitle="Coins with the most trades in the last 24 hours will appear here."
          />
        )}
        {!loading && volumes.map((volume, idx) => <TopTradesItem key={volume.id} volume={volume} rank={idx + 1} />)}
      </Card.Content>
    </Card.Root>
  );
}

function TopTradesItem({ volume, rank }: { volume: TradeVolume; rank: number }) {
  const router = useRouter();
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[volume.chainId.toString()];
  const { tokenData, isLoadingTokenData } = useTokenData(chain, volume.memecoin);

  const tradeCount = volume.tradeCount ? Number(volume.tradeCount) : 0;
  const formattedAmount = tradeCount.toString();

  const displayName = tokenData?.name || formatWallet(volume.memecoin, 6);
  const displaySymbol = tokenData?.symbol || formatWallet(volume.memecoin, 4);

  return (
    <div
      className="flex gap-3 items-center px-4 py-3 cursor-pointer hover:bg-(--btn-tertiary)"
      onClick={() => router.push(`/coin/${chain.code_name}/${volume.memecoin}`)}
    >
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
      </div>
    </div>
  );
}
