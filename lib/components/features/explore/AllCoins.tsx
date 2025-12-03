'use client';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

import { Button } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { useQuery } from '$lib/graphql/request/hooks';
import { coinClient } from '$lib/graphql/request/instances';
import {
  PoolCreatedDocument,
  Order_By,
} from '$lib/graphql/generated/coin/graphql';
import { formatWallet } from '$lib/utils/crypto';
import { copy } from '$lib/utils/helpers';
import { chainsMapAtom } from '$lib/jotai/chains';
import { useRouter } from 'next/navigation';
import { useTokenData, useOwner, useGroup, useMarketCap, useLiquidity, useFees } from '$lib/hooks/useCoin';
import type { PoolCreated } from '$lib/graphql/generated/coin/graphql';
import { toast } from '$lib/components/core';

const LIMIT = 10;

export function AllCoins() {
  const [skip, setSkip] = useState(0);
  
  const { data, loading } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        orderBy: [
          {
            blockTimestamp: Order_By.Desc,
          },
        ],
        limit: LIMIT,
        offset: skip,
      },
      fetchPolicy: 'network-only',
    },
    coinClient,
  );

  const pools = data?.PoolCreated || [];
  const total = pools.length >= LIMIT ? (skip + LIMIT) + 1 : pools.length;

  return (
    <div className="flex flex-col gap-4 relative">
      <div className='flex justify-between items-center'>
        <p className="text-xl font-semibold">All Coins</p>
        <Button iconLeft="icon-plus" variant='secondary' size="sm">Create Coin</Button>
      </div>

      <div className="space-y-3">
        <div className="overflow-y-auto no-scrollbar rounded-md">
          <CardTable.Root loading={loading} data={pools} className="table">
            <CardTable.Header className="px-4 py-3">
              <p className="w-[220px]">Ticker</p>
              <p className="w-[144px]">Contract Address</p>
              <p className="w-[100px]">Owner</p>
              <p className="w-[144px]">Community</p>
              <p className="w-[96px]">Marketcap</p>
              <p className="w-[72px]">Buyback</p>
              <p className="w-[80px]">Liquidity</p>
              <p className="w-[80px]">Holders</p>
              <p className="w-[96px]">Fees Earned</p>
              <p className="w-[45px]"></p>
            </CardTable.Header>

            {pools.map((pool) => (
              <AllCoinsRow key={pool.id} pool={pool} />
            ))}
          </CardTable.Root>
        </div>
        {pools.length > 0 && (
          <CardTable.Pagination 
            limit={LIMIT} 
            skip={skip} 
            total={total}
            onNext={() => setSkip(skip + LIMIT)}
            onPrev={() => setSkip(Math.max(0, skip - LIMIT))}
          />
        )}
      </div>
    </div>
  );
}

function AllCoinsRow({ pool }: { pool: PoolCreated }) {
  const router = useRouter();
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[pool.chainId.toString()];
  const { tokenData } = useTokenData(chain, pool.memecoin);
  const { owner } = useOwner(chain, pool.memecoin);
  const { launchpadGroup } = useGroup(chain, pool.memecoin);
  const { formattedMarketCap } = useMarketCap(chain, pool.memecoin);
  const { formattedLiquidity } = useLiquidity(chain, pool.memecoin);
  const { formattedFees } = useFees(chain, pool.memecoin);

  const displayName = tokenData?.name || formatWallet(pool.memecoin, 6);
  const displaySymbol = tokenData?.symbol || formatWallet(pool.memecoin, 4);
  const displayOwner = owner ? formatWallet(owner) : 'N/A';
  const displayCommunity = launchpadGroup?.name || 'N/A';

  return (
    <CardTable.Row>
      <div className="flex items-center gap-4 text-tertiary px-4 py-3">
        <div className="flex items-center gap-3 w-[220px]">
          {tokenData?.metadata?.imageUrl ? (
            <img
              src={tokenData.metadata.imageUrl}
              alt={displayName}
              className="size-5 aspect-square rounded-xs object-cover"
            />
          ) : (
            <div className="size-5 aspect-square rounded-xs bg-gray-500" />
          )}
          <p className="uppercase text-primary whitespace-nowrap">{displaySymbol}</p>
          <p className="text-tertiary line-clamp-1 truncate whitespace-nowrap">{displayName}</p>
        </div>

        <div className="flex gap-2 items-center w-[144px]">
          <p className="text-tertiary">{formatWallet(pool.memecoin, 6)}</p>
          <i 
            className="icon-copy size-4 aspect-square text-quaternary cursor-pointer"
            onClick={() => copy(pool.memecoin, () => toast.success('Copied address!'))}
          />
        </div>

        <div className="flex gap-2 items-center w-[100px]">
          <p>{displayOwner}</p>
        </div>

        <div className="flex gap-2 items-center w-[144px]">
          {launchpadGroup?.cover_photo_url ? (
            <img
              src={launchpadGroup.cover_photo_url}
              alt={displayCommunity}
              className="size-5 aspect-square rounded-xs object-cover"
            />
          ) : (
            <div className="size-5 aspect-square rounded-xs bg-gray-500" />
          )}
          <p>{displayCommunity}</p>
        </div>

        <div className="w-[96px] text-accent-400">
          <p>{formattedMarketCap || 'N/A'}</p>
        </div>

        <div className="w-[72px]">
          <p>-</p>
        </div>

        <div className="w-[80px]">
          <p>{formattedLiquidity || 'N/A'}</p>
        </div>

        <div className="w-[80px] flex items-center gap-2">
          <i className="icon-user size-5 aspect-square" />
          <p>-</p>
        </div>

        <div className="w-[96px] text-success-500">
          <p>{formattedFees || 'N/A'}</p>
        </div>

        <Button 
          variant="tertiary-alt" 
          size="sm"
          onClick={() => router.push(`/coin/${chain.code_name}/${pool.memecoin}`)}
        >
          Buy
        </Button>
      </div>
    </CardTable.Row>
  );
}
