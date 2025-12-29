'use client';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import clsx from 'clsx';

import { Badge, Card, Divider } from '$lib/components/core';
import { useTokenData, useHoldersCount, useBuybackCharging } from '$lib/hooks/useCoin';
import { chainsMapAtom } from '$lib/jotai';
import { PoolCreated } from '$lib/graphql/generated/coin/graphql';
import { formatWallet } from '$lib/utils/crypto';
import { calculateMarketCapData } from '$lib/utils/coin';

export function CoinCard({ pool }: { pool: PoolCreated }) {
  const router = useRouter();
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[pool.chainId.toString()];
  const { tokenData } = useTokenData(chain, pool.memecoin, pool.tokenURI as string);
  const { holdersCount } = useHoldersCount(chain.chain_id, pool.memecoin);
  const { formattedAmount0, progress } = useBuybackCharging(chain, pool.memecoin);

  const { formattedAmount, percentageChange } = calculateMarketCapData(
    pool.latestMarketCapETH,
    pool.previousMarketCapETH,
  );

  const displaySymbol = tokenData?.symbol || formatWallet(pool.memecoin);
  const displayName = tokenData?.name || '';

  const handleClick = () => {
    router.push(`/coin/${chain.code_name}/${pool.memecoin}`);
  };

  const progressPercentage = progress !== null ? Math.min(100, Math.max(0, progress * 100)) : 0;

  return (
    <Card.Root className="flex-1 cursor-pointer" onClick={handleClick}>
      <Card.Content className="p-0">
        <div className="flex gap-4 p-4">
          <div className="w-[125px] h-[125px] rounded-sm bg-quaternary overflow-hidden flex-shrink-0 aspect-square">
            {tokenData?.metadata?.imageUrl ? (
              <img
                src={tokenData.metadata.imageUrl}
                alt={displaySymbol}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-quaternary" />
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div>
              <h3 className="text-xl font-semibold text-primary">${displaySymbol}</h3>
              {displayName && <p className="text-sm text-tertiary line-clamp-1">{displayName}</p>}
            </div>
            <div className="flex gap-1.5 items-end">
              <p className="text-lg text-accent-400">{formattedAmount}</p>
              {percentageChange !== null && (
                <p className={clsx('text-sm', percentageChange > 0 ? 'text-success-500' : 'text-danger-500')}>
                  {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(2)}%
                </p>
              )}
            </div>
            <Badge color="var(--color-tertiary)" className="flex items-center gap-1 w-fit">
              <i className="icon-user size-4" />
              <span className="text-xs">{holdersCount !== null ? holdersCount : 0}</span>
            </Badge>
          </div>
        </div>
        <Divider className="h-1" />
        <div className="px-4 py-3.5 space-y-3">
          <div className="flex justify-between">
            <p className="text-sm text-tertiary">Buyback Charging</p>
            <p className="text-sm text-alert-400">{formattedAmount0 || '0 ETH'}</p>
          </div>
          <div className="relative w-full h-2 rounded-full bg-quaternary overflow-hidden">
            <div
              className="h-full rounded-full bg-alert-400 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

