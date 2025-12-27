'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import clsx from 'clsx';

import { useLaunchpadGroup, useStakingCoin, useTokenData, useMarketCap, useMarketCapChange, useBuybackCharging, useTokenIds } from "$lib/hooks/useCoin";
import { useSpace } from "$lib/hooks/useSpace";
import { CoinStats } from './CoinStats';
import { Chain, LaunchpadGroup, Space } from '$lib/graphql/generated/backend/graphql';
import { formatWallet } from '$lib/utils/crypto';
import { copy } from '$lib/utils/helpers';
import { communityAvatar } from '$lib/utils/community';
import { Button, Card, Skeleton, toast, Segment } from '$lib/components/core';
import { CoinCard } from '../coin/CoinCard';
import { CoinListTable } from '../coins/CoinList';
import { chainsMapAtom } from '$lib/jotai';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { SECONDS_PER_MONTH } from '$lib/services/token-launch-pad';
import { useQuery } from '$lib/graphql/request/hooks';
import { coinClient } from '$lib/graphql/request/instances';
import { PoolCreatedDocument, Order_By, PoolCreated_Bool_Exp } from '$lib/graphql/generated/coin/graphql';

export function CommunityLaunchpad() {
  const space = useSpace();

  const { launchpadGroup, isLoading } = useLaunchpadGroup(space?._id || '');
  const { stakingToken, chain, isLoading: isLoadingStakingToken } = useStakingCoin(space?._id || '');
  const { tokenIds, isLoading: isLoadingTokenIds } = useTokenIds(launchpadGroup?.address || '');

  const filter = useMemo<PoolCreated_Bool_Exp | undefined>(() => {
    if (!tokenIds || tokenIds.length === 0) {
      return undefined;
    }
    return {
      tokenId: {
        _in: tokenIds,
      },
    };
  }, [tokenIds]);

  if (isLoading || isLoadingStakingToken) return <div>Loading...</div>;

  if (!launchpadGroup) return null;

  return (
    <div className="flex flex-col gap-4">
      <CoinStats launchpadGroup={launchpadGroup as LaunchpadGroup} />
      <div className="grid grid-cols-[1fr_336px] gap-4">
        {
          stakingToken && chain && (
            <CommunityCoin stakingToken={stakingToken} chain={chain} />
          )
        }
        <div className="flex flex-col gap-4">
          <LaunchpadGroupCard launchpadGroup={launchpadGroup as any} space={space} stakingToken={stakingToken || undefined} chain={chain} />
          <LaunchpadSettingsInfo launchpadGroup={launchpadGroup as any} stakingToken={stakingToken} />
        </div>
      </div>
      {isLoadingTokenIds ? (
        <Skeleton className="h-[225px] w-[348px]" animate />
      ) : (
        <div className="p-4 rounded-md space-y-4 border border-card-border bg-card">
          <SubCoinsList filter={filter} />
        </div>
      )}
    </div>
  );
}

function CommunityCoin({ stakingToken, chain }: { stakingToken: string; chain: Chain }) {
  const router = useRouter();
  const { tokenData, isLoadingTokenData } = useTokenData(chain, stakingToken);
  const { formattedMarketCap, isLoadingMarketCap } = useMarketCap(chain, stakingToken);
  const { percentageChange, isLoadingMarketCapChange } = useMarketCapChange(chain.chain_id, stakingToken);
  const { formattedAmount0, progress, isLoadingBuybackCharging } = useBuybackCharging(chain, stakingToken);

  if (isLoadingTokenData) {
    return (
      <div className="relative rounded-md outline-1 outline-card-border overflow-hidden">
        <div className="py-2.5 px-4 border-b border-card-border">
          <Skeleton className="h-4 w-32" animate />
        </div>
        <div className="p-18 grid grid-cols-2 gap-14">
          <Skeleton className="size-full aspect-square rounded-lg" animate />
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" animate />
              <Skeleton className="h-4 w-64" animate />
              <Skeleton className="h-4 w-full" animate />
              <Skeleton className="h-5 w-32" animate />
              <Skeleton className="h-12 w-full" animate />
            </div>
            <Skeleton className="h-10 w-full" animate />
          </div>
        </div>
      </div>
    );
  }

  if (!tokenData) return null;

  const handleBuyClick = () => {
    router.push(`/coin/${chain.code_name}/${stakingToken}`);
  };

  const imageUrl = tokenData.metadata?.imageUrl || '';

  return (
    <div
      className="relative rounded-md outline-1 outline-card-border overflow-hidden -z-10"
      style={imageUrl
        ? {
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundColor: ' rgba(255, 255, 255, 0.04)',
        } : undefined
      }
    >
      <div className="absolute w-full h-full rounded-md inset-0 bg-overlay-secondary backdrop-blur-[24px] -z-10" />

      <div className="py-2.5 px-4 border-b border-card-border">
        <p className="text-secondary text-sm">Community Coin</p>
      </div>

      <div className="p-18 grid grid-cols-2 gap-14">
        <img src={imageUrl} className="size-full aspect-square rounded-lg object-cover" />
        <div className="space-y-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-2xl font-semibold">{tokenData.name}</h3>
              <div className="flex gap-1 text-tertiary items-center">
                <p>{tokenData.name} &middot;</p>
                <p>{formatWallet(stakingToken)}</p>
                <i
                  className="icon-copy size-4.5 aspect-square"
                  onClick={() => copy(stakingToken, () => toast.success('Copied address!'))}
                />
              </div>
            </div>
            <p className="text-secondary line-clamp-2">{tokenData.metadata?.description}</p>
            <div className="flex gap-1.5 items-baseline">
              {isLoadingMarketCap ? (
                <Skeleton className="h-5 w-20" animate />
              ) : (
                formattedMarketCap && <p className="text-accent-400 text-xl">{formattedMarketCap}</p>
              )}
              {isLoadingMarketCapChange ? (
                <Skeleton className="h-4 w-16" animate />
              ) : (
                percentageChange !== null && (
                  <p className={clsx('text-sm', percentageChange > 0 ? 'text-success-500' : 'text-danger-500')}>
                    {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(2)}%
                  </p>
                )
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-tertiary">Buyback Charging</p>
                {isLoadingBuybackCharging ? (
                  <Skeleton className="h-4 w-16" animate />
                ) : (
                  <p className="text-sm text-alert-400">{formattedAmount0 || '0 ETH'}</p>
                )}
              </div>
              <div className="relative w-full h-2 rounded-full bg-quaternary overflow-hidden">
                <div
                  className="h-full rounded-full bg-alert-400 transition-all duration-300"
                  style={{ width: `${progress !== null ? Math.min(100, Math.max(0, progress * 100)) : 0}%` }}
                />
              </div>
            </div>
          </div>

          <Button variant="secondary" onClick={handleBuyClick} size="lg">
            Buy {tokenData.symbol}
          </Button>
        </div>
      </div>
    </div>
  );
}

function LaunchpadGroupCard({ launchpadGroup, space, stakingToken, chain }: { launchpadGroup: LaunchpadGroup; space?: Space | null; stakingToken?: string; chain?: Chain }) {
  const router = useRouter();
  const { tokenData } = chain && stakingToken ? useTokenData(chain, stakingToken) : { tokenData: null };

  const handleJoinClick = () => {
    if (space) {
      router.push(`/s/${space.slug || space._id}`);
    }
  };

  const tokenSymbol = tokenData?.symbol || '';

  return (
    <div className="rounded-md bg-card border-card-border flex flex-col gap-4 p-4">
      <div className="flex justify-between items-start">
        <img
          src={launchpadGroup.cover_photo_url || communityAvatar(space || undefined)}
          alt={launchpadGroup.name}
          className="size-12 aspect-square rounded-sm object-cover"
        />

        {tokenSymbol && (
          <div className="flex h-6 px-2 items-center rounded-full bg-primary/8">
            {tokenData?.metadata?.imageUrl && (
              <img
                src={tokenData.metadata.imageUrl}
                alt={tokenSymbol}
                className="size-4 rounded-full object-cover"
              />
            )}
            <p className="text-xs text-tertiary">{tokenSymbol}</p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{launchpadGroup.name}</h3>
        {launchpadGroup.description && (
          <p className="text-sm text-tertiary line-clamp-2">{launchpadGroup.description}</p>
        )}
      </div>
      <Button variant="secondary" size="sm" onClick={handleJoinClick} className="w-full">
        Join Community
      </Button>
    </div>
  );
}

function LaunchpadSettingsInfo({ launchpadGroup, stakingToken }: { launchpadGroup: LaunchpadGroup; stakingToken?: string | null }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[launchpadGroup.chain_id];
  
  const [ownerShare, setOwnerShare] = useState<bigint | null>(null);
  const [creatorShare, setCreatorShare] = useState<bigint | null>(null);
  const [minStakeDuration, setMinStakeDuration] = useState<bigint | null>(null);
  const [stakingTokenSymbol, setStakingTokenSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chain) return;

    const fetchData = async () => {
      setIsLoading(true);
      const client = StakingManagerClient.getInstance(chain, launchpadGroup.address);
      
      const [owner, creator, duration] = await Promise.all([
        client.getOwnerShare().catch(() => null),
        client.getCreatorShare().catch(() => null),
        client.getMinStakeDuration().catch(() => null),
      ]);

      setOwnerShare(owner);
      setCreatorShare(creator);
      setMinStakeDuration(duration);

      if (stakingToken) {
        const flaunchClient = FlaunchClient.getInstance(chain, stakingToken);
        const tokenData = await flaunchClient.getTokenData().catch(() => null);
        if (tokenData) {
          setStakingTokenSymbol(tokenData.symbol);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [chain, launchpadGroup.address, stakingToken]);

  const ownerSharePercent = ownerShare ? Number(ownerShare) / 100000 : 0;
  const creatorSharePercent = creatorShare ? Number(creatorShare) / 100000 : 0;
  const memberSharePercent = 100 - ownerSharePercent - creatorSharePercent;

  const minStakeDurationMonths = minStakeDuration ? Number(minStakeDuration) / SECONDS_PER_MONTH : null;

  return (
    <div className="rounded-md bg-card border-card-border flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-tertiary">Fee Breakdown</p>
        <div className="flex w-full h-2 rounded-full overflow-hidden bg-card-border gap-0.5">
          {creatorSharePercent > 0 && (
            <div
              className="h-full bg-alert-400"
              style={{ width: `${creatorSharePercent}%` }}
            />
          )}
          {memberSharePercent > 0 && (
            <div
              className="h-full bg-accent-400"
              style={{ width: `${memberSharePercent}%` }}
            />
          )}
          {ownerSharePercent > 0 && (
            <div
              className="h-full bg-warning-300"
              style={{ width: `${ownerSharePercent}%` }}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {creatorSharePercent > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-alert-400" />
              <p className="text-alert-400">Coin Creators {Math.round(creatorSharePercent)}%</p>
            </div>
          )}
          {memberSharePercent > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-accent-400" />
              <p className="text-accent-400">Members {Math.round(memberSharePercent)}%</p>
            </div>
          )}
          {ownerSharePercent > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-warning-300" />
              <p className="text-warning-300">Community Owner {Math.round(ownerSharePercent)}%</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-tertiary">Membership Requirements</p>
        {isLoading ? (
          <Skeleton className="h-5 w-32" animate />
        ) : minStakeDurationMonths ? (
          <p className="text-sm font-semibold">{Math.round(minStakeDurationMonths)} months</p>
        ) : (
          <p className="text-sm text-tertiary">N/A</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-tertiary">Community Address</p>
        {isLoading ? (
          <Skeleton className="h-5 w-full" animate />
        ) : (
          <div className="flex items-center gap-1">
            <p className="text-sm">{formatWallet(launchpadGroup.address)}</p>
            <i
              className="icon-copy size-4 text-tertiary hover:text-primary cursor-pointer"
              onClick={() => copy(launchpadGroup.address, () => toast.success('Copied address!'))}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-tertiary">
          Staking Coin {stakingTokenSymbol ? `(${stakingTokenSymbol})` : ''}
        </p>
        {isLoading ? (
          <Skeleton className="h-5 w-full" animate />
        ) : stakingToken ? (
          <div className="flex items-center gap-1">
            <p className="text-sm">{formatWallet(stakingToken)}</p>
            <i
              className="icon-copy size-4 text-tertiary hover:text-primary cursor-pointer"
              onClick={() => copy(stakingToken, () => toast.success('Copied address!'))}
            />
          </div>
        ) : (
          <p className="text-sm text-tertiary">N/A</p>
        )}
      </div>
    </div>
  );
}

function SubCoinsList({ filter }: { filter?: PoolCreated_Bool_Exp }) {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const { data, loading } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        orderBy: [
          {
            blockTimestamp: Order_By.Desc,
          },
        ],
        where: filter,
      },
    },
    coinClient,
  );

  const pools = data?.PoolCreated || [];

  if (!filter || pools.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <p className="text-lg">Sub Coins</p>
        <Segment
          size="sm"
          selected={viewMode}
          onSelect={(item) => setViewMode(item.value as 'card' | 'list')}
          items={[
            { value: 'card', icon: 'icon-view-agenda-outline' },
            { value: 'list', icon: 'icon-list-bulleted' },
          ]}
        />
      </div>
      {viewMode === 'list' ? (
        <CoinListTable pools={pools} loading={loading} hiddenColumns={['buy', 'community']} />
      ) : (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card.Root key={i} className="flex-1">
                  <Card.Content className="p-0">
                    <div className="flex gap-4 p-4">
                      <Skeleton className="w-[118px] h-[118px] rounded-sm" animate />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-6 w-24" animate />
                        <Skeleton className="h-4 w-32" animate />
                        <Skeleton className="h-5 w-20" animate />
                      </div>
                    </div>
                  </Card.Content>
                </Card.Root>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pools.map((pool) => (
                <CoinCard key={pool.id} pool={pool} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
