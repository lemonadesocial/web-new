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
import { formatNumber } from '$lib/utils/number';
import { chainsMapAtom } from '$lib/jotai/chains';
import { useRouter } from 'next/navigation';
import { useTokenData, useOwner, useGroup, useMarketCap, useLiquidity, useFees, useHoldersCount } from '$lib/hooks/useCoin';
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
              <div className="flex-[2.2] min-w-0">
                <p>Ticker</p>
              </div>
              <div className="flex-[1.44] min-w-0">
                <p>Contract Address</p>
              </div>
              <div className="flex-1 min-w-0">
                <p>Owner</p>
              </div>
              <div className="flex-[1.44] min-w-0">
                <p>Community</p>
              </div>
              <div className="flex-[0.96] min-w-0">
                <p>Marketcap</p>
              </div>
              <div className="flex-[0.72] min-w-0">
                <p>Buyback</p>
              </div>
              <div className="flex-[0.8] min-w-0">
                <p>Liquidity</p>
              </div>
              <div className="flex-[0.8] min-w-0">
                <p>Holders</p>
              </div>
              <div className="flex-[0.96] min-w-0">
                <p>Fees Earned</p>
              </div>
              <div className="w-20 flex-shrink-0 flex justify-end">
                <p></p>
              </div>
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
  const { tokenData } = useTokenData(chain, pool.memecoin, pool.tokenURI as string);
  const { owner } = useOwner(chain, pool.memecoin);
  const { launchpadGroup } = useGroup(chain, pool.memecoin);
  const { formattedMarketCap } = useMarketCap(chain, pool.memecoin);
  const { formattedLiquidity } = useLiquidity(chain, pool.memecoin);
  const { formattedFees } = useFees(chain, pool.memecoin);
  const { holdersCount } = useHoldersCount(chain.chain_id, pool.memecoin);

  const displayName = tokenData?.name || formatWallet(pool.memecoin, 6);
  const displaySymbol = tokenData?.symbol || formatWallet(pool.memecoin, 4);
  const displayOwner = owner ? formatWallet(owner) : 'N/A';
  const displayCommunity = launchpadGroup?.name || 'N/A';

  return (
    <CardTable.Row>
      <div
        className="flex items-center gap-4 text-tertiary px-4 py-3 cursor-pointer hover:bg-(--btn-tertiary)"
        onClick={() => router.push(`/coin/${chain.code_name}/${pool.memecoin}`)}
      >
        <div className="flex items-center gap-3 flex-[2.2] min-w-0">
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

        <div className="flex gap-2 items-center flex-[1.44] min-w-0">
          <p className="text-tertiary">{formatWallet(pool.memecoin, 6)}</p>
          <i 
            className="icon-copy size-4 aspect-square text-quaternary cursor-pointer"
            onClick={() => copy(pool.memecoin, () => toast.success('Copied address!'))}
          />
        </div>

        <div className="flex gap-2 items-center flex-1 min-w-0">
          <p>{displayOwner}</p>
        </div>

        <div className="flex gap-2 items-center flex-[1.44] min-w-0">
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

        <div className="flex-[0.96] min-w-0 text-accent-400">
          <p>{formattedMarketCap || 'N/A'}</p>
        </div>

        <div className="flex-[0.72] min-w-0">
          <p>-</p>
        </div>

        <div className="flex-[0.8] min-w-0">
          <p>{formattedLiquidity || 'N/A'}</p>
        </div>

        <div className="flex-[0.8] min-w-0 flex items-center gap-2">
          <i className="icon-user size-5 aspect-square" />
          <p>{holdersCount !== null ? formatNumber(holdersCount) : 'N/A'}</p>
        </div>

        <div className="flex-[0.96] min-w-0 text-success-500">
          <p>{formattedFees || 'N/A'}</p>
        </div>

        <div className="w-20 flex-shrink-0 flex justify-end">
          <Button 
            variant="tertiary-alt" 
            size="sm"
          >
            Buy
          </Button>
        </div>
      </div>
    </CardTable.Row>
  );
}
