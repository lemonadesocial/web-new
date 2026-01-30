'use client';
import React from 'react';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { parseEther, formatEther } from 'ethers';
import { BrowserProvider, type Eip1193Provider, Interface } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { Button, Card, Skeleton, modal, toast } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import {
  PoolCreatedDocument,
  FairLaunchDocument,
  Order_By,
  type PoolCreated,
} from '$lib/graphql/generated/coin/graphql';
import { getCoinClient } from '$lib/graphql/request/instances';
import { chainsMapAtom } from '$lib/jotai/chains';
import { useListChainIds } from '$lib/hooks/useListChainIds';
import { useTokenData, useHoldersCount, useVolume24h } from '$lib/hooks/useCoin';
import { calculateMarketCapData } from '$lib/utils/coin';
import { formatWallet, formatError, getTransactionUrl } from '$lib/utils/crypto';
import { getTimeAgo } from '$lib/utils/date';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { appKit } from '$lib/utils/appkit';
import { ConnectWallet } from '../modals/ConnectWallet';
import { TxnConfirmedModal } from '../create-coin/TxnConfirmedModal';
import { ERC20 } from '$lib/abis/ERC20';
import { formatNumber } from '$lib/utils/number';

const QUICK_BUY_UNIT = parseEther('0.0001');

interface QuickBuyContextType {
  quickBuySize: bigint;
  isBuyingPool: (poolId: string) => boolean;
  incrementQuickBuy: () => void;
  decrementQuickBuy: () => void;
  handleQuickBuy: (pool: PoolCreated) => void;
}

const QuickBuyContext = React.createContext<QuickBuyContextType | undefined>(undefined);

export function useQuickBuy() {
  const context = React.useContext(QuickBuyContext);
  if (context === undefined) {
    throw new Error('useQuickBuy must be used within a QuickBuyProvider');
  }
  return context;
}

function QuickBuyProvider({ children }: { children: React.ReactNode }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const [quickBuySize, setQuickBuySize] = React.useState<bigint>(QUICK_BUY_UNIT);
  const [buyingPoolId, setBuyingPoolId] = React.useState<string | null>(null);

  const incrementQuickBuy = React.useCallback(() => {
    setQuickBuySize((prev) => prev + QUICK_BUY_UNIT);
  }, []);

  const decrementQuickBuy = React.useCallback(() => {
    setQuickBuySize((prev) => {
      const newSize = prev - QUICK_BUY_UNIT;
      return newSize < QUICK_BUY_UNIT ? QUICK_BUY_UNIT : newSize;
    });
  }, []);

  const executeBuy = React.useCallback(
    async (pool: PoolCreated) => {
      const chain = chainsMap[pool.chainId.toString()];
      if (!chain) {
        toast.error('Chain not found');
        return;
      }

      const walletProvider = appKit.getProvider('eip155');
      const userAddress = appKit.getAddress();

      if (!walletProvider || !userAddress) {
        toast.error("Wallet isn't fully connected yet. Please try again in a moment.");
        return;
      }

      try {
        setBuyingPoolId(pool.id);
        const provider = new BrowserProvider(walletProvider as Eip1193Provider);
        const signer = await provider.getSigner();
        const flaunchClient = FlaunchClient.getInstance(chain, pool.memecoin, signer);

        const txHash = await flaunchClient.buyCoin({
          buyAmount: quickBuySize,
          recipient: userAddress,
        });

        const receipt = await provider.waitForTransaction(txHash);

        let tokenAmount: string | null = null;

        if (receipt && userAddress) {
          const erc20Interface = new Interface(ERC20);
          const memecoinAddressLower = pool.memecoin.toLowerCase();
          const userAddressLower = userAddress.toLowerCase();

          for (const log of receipt.logs) {
            if (log.address.toLowerCase() !== memecoinAddressLower) continue;

            try {
              const parsedLog = erc20Interface.parseLog(log);
              if (parsedLog?.name === 'Transfer' && parsedLog.args.to.toLowerCase() === userAddressLower) {
                const value = parsedLog.args.value as bigint;
                tokenAmount = formatNumber(Number(formatEther(value)));
                break;
              }
            } catch {
              continue;
            }
          }
        }

        const buyAmountFormatted = formatEther(quickBuySize);
        const description = tokenAmount
          ? `${tokenAmount} tokens have been added to your wallet.`
          : `You have successfully purchased ${formatNumber(Number(buyAmountFormatted))} ETH worth of tokens.`;

        modal.open(TxnConfirmedModal, {
          props: {
            title: 'Purchase Complete',
            description,
            txUrl: getTransactionUrl(chain, txHash),
          },
        });
      } catch (error) {
        console.log(error);
        Sentry.captureException(error);
        toast.error(formatError(error));
      } finally {
        setBuyingPoolId(null);
      }
    },
    [quickBuySize, chainsMap],
  );

  const handleQuickBuy = React.useCallback(
    (pool: PoolCreated) => {
      const chain = chainsMap[pool.chainId.toString()];
      if (!chain) {
        toast.error('Chain not found');
        return;
      }

      modal.open(ConnectWallet, {
        props: {
          chain,
          onConnect: () => {
            executeBuy(pool);
          },
        },
      });
    },
    [executeBuy, chainsMap],
  );

  const isBuyingPool = React.useCallback(
    (poolId: string) => {
      return buyingPoolId === poolId;
    },
    [buyingPoolId],
  );

  const value = React.useMemo(
    () => ({
      quickBuySize,
      isBuyingPool,
      incrementQuickBuy,
      decrementQuickBuy,
      handleQuickBuy,
    }),
    [quickBuySize, isBuyingPool, incrementQuickBuy, decrementQuickBuy, handleQuickBuy],
  );

  return <QuickBuyContext.Provider value={value}>{children}</QuickBuyContext.Provider>;
}

export function Tokens() {
  return (
    <QuickBuyProvider>
      <div className="pt-6 px-8 max-sm:px-4 pb-20 flex flex-col gap-3 md:max-h-[calc(100dvh-56px)]">
        <Toolbar />

        <div className="flex flex-col md:grid grid-cols-3 gap-4 flex-1 overflow-hidden">
          <NewTokensList />
          <GraduatingTokensList />
          <RecentlyGraduatedTokensList />
        </div>
      </div>
    </QuickBuyProvider>
  );
}

function Toolbar() {
  const router = useRouter();
  const { quickBuySize, incrementQuickBuy, decrementQuickBuy } = useQuickBuy();

  const handleCreateCoin = () => {
    router.push('/create/coin');
  };

  const formattedSize = formatEther(quickBuySize);
  const isAtMinimum = quickBuySize === QUICK_BUY_UNIT;

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <div className="text-sm flex gap-1 px-2.5 py-1.5 bg-(--btn-tertiary) w-fit rounded-sm">
          <p className="text-tertiary">Quick Buy Size:</p>
          <p className="text-secondary w-[75px] text-right">{formattedSize} ETH</p>
        </div>
        <Button icon="icon-arrow-down rotate-180" size="sm" variant="tertiary-alt" onClick={incrementQuickBuy} />
        <Button
          icon="icon-arrow-down"
          size="sm"
          variant="tertiary-alt"
          onClick={decrementQuickBuy}
          disabled={isAtMinimum}
        />
      </div>

      <Button iconLeft="icon-plus" size="sm" variant="secondary" className="hidden md:block" onClick={handleCreateCoin}>
        Create Coin
      </Button>

      <Button icon="icon-plus" size="sm" variant="secondary" className="md:hidden" onClick={handleCreateCoin}>
        Create Coin
      </Button>
    </div>
  );
}

function NewTokensList() {
  const chainIds = useListChainIds();
  const { data, loading } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        where: {
          chainId: {
            _in: chainIds,
          },
        },
        orderBy: [
          {
            blockTimestamp: Order_By.Desc,
          },
        ],
        limit: 10,
        offset: 0,
      },
      skip: chainIds.length === 0,
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
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => <TokenCardSkeleton key={idx} />)
              : pools.map((pool) => <TokenCard key={pool.id} pool={pool} />)}
          </div>
        </Card.Content>
      </div>
    </Card.Root>
  );
}

const coinClient = getCoinClient();

function GraduatingTokensList() {
  const chainIds = useListChainIds();
  const { data: fairLaunchData, loading: loadingFairLaunch } = useQuery(
    FairLaunchDocument,
    {
      variables: {
        where: {
          chainId: {
            _in: chainIds,
          },
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

    return fairLaunches.map((fl) => poolMap.get(fl.poolId)).filter((pool): pool is PoolCreated => pool !== undefined);
  }, [pools, fairLaunches]);

  return (
    <Card.Root className="flex flex-col flex-1 max-sm:max-h-[700px] h-full">
      <Card.Header>
        <p>Graduating Tokens</p>
      </Card.Header>

      <div className="flex-1 overflow-auto no-scrollbar">
        <Card.Content>
          <div className="flex flex-col gap-2">
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => <TokenCardSkeleton key={idx} />)
              : sortedPools.map((pool) => <TokenCard key={pool.id} pool={pool} />)}
          </div>
        </Card.Content>
      </div>
    </Card.Root>
  );
}

function RecentlyGraduatedTokensList() {
  const chainIds = useListChainIds();
  const { data: fairLaunchData, loading: loadingFairLaunch } = useQuery(
    FairLaunchDocument,
    {
      variables: {
        where: {
          chainId: {
            _in: chainIds,
          },
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

    return fairLaunches.map((fl) => poolMap.get(fl.poolId)).filter((pool): pool is PoolCreated => pool !== undefined);
  }, [pools, fairLaunches]);

  return (
    <Card.Root className="flex flex-col flex-1 max-sm:max-h-[700px] h-full">
      <Card.Header>
        <p>Recently Graduated</p>
      </Card.Header>

      <div className="flex-1 overflow-auto no-scrollbar">
        <Card.Content>
          <div className="flex flex-col gap-2">
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => <TokenCardSkeleton key={idx} />)
              : sortedPools.map((pool) => <TokenCard key={pool.id} pool={pool} />)}
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
  const { handleQuickBuy, isBuyingPool } = useQuickBuy();
  const isBuying = isBuyingPool(pool.id);

  const chain = chainsMap[pool.chainId.toString()];
  const { tokenData, isLoadingTokenData } = useTokenData(chain, pool.memecoin, pool.tokenURI as string);
  const { holdersCount, isLoadingHoldersCount } = useHoldersCount(chain.chain_id, pool.memecoin);
  const { formattedVolumeUSDC, isLoadingVolume } = useVolume24h(chain, pool.memecoin);

  const { formattedAmount } = calculateMarketCapData(pool.latestMarketCapETH, pool.previousMarketCapETH);

  const timestamp = Number(pool.blockTimestamp) * 1000;
  const timeAgo = getTimeAgo(timestamp);
  const displaySymbol = tokenData?.symbol || formatWallet(pool.memecoin, 4);

  const handleClick = () => {
    router.push(`/coin/${chain.code_name}/${pool.memecoin}`);
  };

  const onQuickBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleQuickBuy(pool);
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
                <img src={tokenData.metadata.imageUrl} alt={displaySymbol} className="w-full h-full object-cover" />
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
                <Button variant="tertiary-alt" size="sm" onClick={onQuickBuyClick} loading={isBuying}>
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
