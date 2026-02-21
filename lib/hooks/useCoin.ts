import { formatEther, formatUnits, zeroAddress } from 'viem';
import { useEffect, useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useQuery as useGraphQLQuery } from '$lib/graphql/request';
import { useQuery as useReactQuery } from '@tanstack/react-query';

import { coinClient } from '$lib/graphql/request/instances';
import {
  ListLaunchpadGroupsDocument,
  type ListLaunchpadGroupsQuery,
  type ListLaunchpadGroupsQueryVariables
} from '$lib/graphql/generated/backend/graphql';
import {
  TradeVolumeDocument,
  PoolCreatedDocument,
  Order_By,
  MemecoinMetadataDocument,
  PoolSwapDocument,
  StakingManagerTokenDocument,
  StakingSummaryDocument,
  type PoolSwapQuery,
  type PoolSwapQueryVariables,
  type StakingManagerTokenQuery,
  type StakingManagerTokenQueryVariables,
  type StakingSummaryQuery,
  type StakingSummaryQueryVariables
} from '$lib/graphql/generated/coin/graphql';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { appKit } from '$lib/utils/appkit';
import { formatNumber } from '$lib/utils/number';
import { chainsMapAtom } from '$lib/jotai/chains';

type LaunchpadGroupItem = ListLaunchpadGroupsQuery['listLaunchpadGroups']['items'][number];

export function useLaunchpadGroup(spaceId: string) {
  const { data, loading } = useGraphQLQuery(ListLaunchpadGroupsDocument, {
    variables: { space: spaceId },
    skip: !spaceId
  });

  return {
    launchpadGroup: data?.listLaunchpadGroups?.items?.[0] ?? null,
    isLoading: loading,
  };
}

export function useGroup(chain: Chain, address: string, skip = false) {
  const [treasuryManagerAddress, setTreasuryManagerAddress] = useState<string | null>(null);
  const [isLoadingTreasuryManagerAddress, setIsLoadingTreasuryManagerAddress] = useState(!skip);
  const [launchpadGroup, setLaunchpadGroup] = useState<LaunchpadGroupItem | null>(null);

  useEffect(() => {
    if (skip) return;

    const fetchOwner = async () => {
      setIsLoadingTreasuryManagerAddress(true);
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const implementation = await flaunchClient.getImplementationAddress();

      if (implementation && implementation.toLowerCase() !== zeroAddress.toLowerCase()) {
        setTreasuryManagerAddress(implementation);
      }

      setIsLoadingTreasuryManagerAddress(false);
    };

    fetchOwner();
  }, [chain, address, skip]);

  const shouldSkipQuery = skip || !treasuryManagerAddress || treasuryManagerAddress.toLowerCase() === zeroAddress.toLowerCase();

  const { loading: isLoadingQuery } = useGraphQLQuery<
    ListLaunchpadGroupsQuery,
    ListLaunchpadGroupsQueryVariables
  >(
    ListLaunchpadGroupsDocument,
    {
      variables: treasuryManagerAddress ? { address: treasuryManagerAddress } : undefined,
      skip: shouldSkipQuery,
      onComplete: (data) => {
        if (data?.listLaunchpadGroups?.items && data.listLaunchpadGroups.items.length > 0) {
          const groupItem = data.listLaunchpadGroups.items[0] as LaunchpadGroupItem;
          setLaunchpadGroup(groupItem);
        }
      },
    }
  );

  const isLoading = !skip && (isLoadingTreasuryManagerAddress || isLoadingQuery);

  return {
    treasuryManagerAddress,
    launchpadGroup,
    isLoading,
  };
}

export function useOwner(chain: Chain, address: string) {
  const [owner, setOwner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      setIsLoading(true);
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const ownerAddress = await flaunchClient.getOwnerOf();

      setOwner(ownerAddress);
      setIsLoading(false);
    };

    fetchOwner();
  }, [chain, address]);

  return {
    owner,
    isLoadingOwner: isLoading,
  };
}

export function useFees(chain: Chain, address: string) {
  const [formattedFees, setFormattedFees] = useState<string | null>(null);
  const [rawFees, setRawFees] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      setIsLoading(true);
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const ethAmount = await flaunchClient.getEarnedFees();
      const usdcAmount = await flaunchClient.getUSDCFromETH(ethAmount);
      setRawFees(usdcAmount);

      const usdcValue = formatUnits(usdcAmount, 6);
      setFormattedFees(`$${usdcValue}`);
      setIsLoading(false);
    };

    fetchFees();
  }, [chain, address]);

  return {
    formattedFees,
    rawFees,
    isLoadingFees: isLoading,
  };
}

export function useTreasuryValue(chain: Chain, address: string) {
  const [formattedTreasuryValue, setFormattedTreasuryValue] = useState<string | null>(null);
  const [rawTreasuryValue, setRawTreasuryValue] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTreasuryValue = async () => {
      setIsLoading(true);
      const flaunchClient = FlaunchClient.getInstance(chain, address);

      const treasuryValue = await flaunchClient.getTreasuryValue();
      setRawTreasuryValue(treasuryValue);

      const formattedValue = formatUnits(treasuryValue, 6);
      setFormattedTreasuryValue(`$${formattedValue}`);

      setIsLoading(false);
    };

    fetchTreasuryValue();
  }, [chain, address]);

  return {
    formattedTreasuryValue,
    rawTreasuryValue,
    isLoadingTreasuryValue: isLoading,
  };
}

export function useMarketCap(chain: Chain, address: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['market-cap', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      return flaunchClient.getMarketCap();
    },
    enabled: !!chain && !!address,
  });

  const formattedMarketCap = data ? `$${formatNumber(Number(formatUnits(data, 6)), true)}` : null;

  return {
    formattedMarketCap,
    rawMarketCap: data ?? null,
    isLoadingMarketCap: isLoading,
  };
}

export function useLiquidity(chain: Chain, address: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['liquidity', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      return flaunchClient.getLiquidity();
    },
    enabled: !!chain && !!address,
  });

  const formattedLiquidity = data ? `$${formatNumber(Number(formatUnits(data, 6)), true)}` : null;

  return {
    formattedLiquidity,
    rawLiquidity: data ?? null,
    isLoadingLiquidity: isLoading,
  };
}

export function useFairLaunch(chain: Chain, address: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['fair-launch', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      return flaunchClient.getFairLaunch();
    },
    enabled: !!chain && !!address,
  });

  const formattedUsdcValue = data ? `$${formatNumber(Number(formatUnits(data.usdcValue, 6)), true)}` : null;
  const formattedPercentage = data ? `${data.percentage.toFixed(2)}%` : null;

  return {
    info: data?.info ?? null,
    percentage: data?.percentage ?? null,
    formattedPercentage,
    usdcValue: data?.usdcValue ?? null,
    formattedUsdcValue,
    isLoadingFairLaunch: isLoading,
  };
}

export function useTokenData(chain: Chain | undefined, address: string | undefined, tokenUri?: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['token-data', chain?.chain_id, address],
    queryFn: async () => {
      if (!chain || !address) return null;
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      return flaunchClient.getTokenData(tokenUri);
    },
    enabled: !!chain && !!address,
  });

  return {
    tokenData: data ?? null,
    isLoadingTokenData: isLoading,
  };
}

export function useBuybackCharging(chain: Chain, address: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['buyback-charging', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      return flaunchClient.getBuybackCharging();
    },
  });

  const formattedAmount0 = data ? `${formatNumber(Number(formatEther(data.amount0)))} ETH` : null;
  const formattedAmount1 = data ? `${formatEther(data.amount1)} ETH` : null;
  const formattedThreshold = data ? `${formatEther(data.threshold)} ETH` : null;

  return {
    amount0: data?.amount0 ?? null,
    threshold: data?.threshold ?? null,
    progress: data?.progress ?? null,
    amount1: data?.amount1 ?? null,
    formattedAmount0,
    formattedAmount1,
    formattedThreshold,
    isLoadingBuybackCharging: isLoading,
  };
}

export function useBidWallInfo(chain: Chain, address: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['bid-wall-info', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      return flaunchClient.getBidWallInfo();
    },
    enabled: !!chain && !!address,
  });

  const formattedCumulativeSwapFees = data ? `${formatEther(data.cumulativeSwapFees)} ETH` : null;
  const formattedAmount0 = data ? formatEther(data.amount0) : null;
  const formattedAmount1 = data ? formatEther(data.amount1) : null;
  const formattedPendingETH = data ? `${formatEther(data.pendingETH)} ETH` : null;

  return {
    cumulativeSwapFees: data?.cumulativeSwapFees ?? null,
    amount0: data?.amount0 ?? null,
    amount1: data?.amount1 ?? null,
    pendingETH: data?.pendingETH ?? null,
    formattedCumulativeSwapFees,
    formattedAmount0,
    formattedAmount1,
    formattedPendingETH,
    isLoadingBidWallInfo: isLoading,
  };
}

export function useVolume24h(chain: Chain, address: string) {
  const today = new Date().toISOString().split('T')[0];
  const [formattedVolumeUSDC, setFormattedVolumeUSDC] = useState<string | null>(null);
  const [rawVolumeUSDC, setRawVolumeUSDC] = useState<bigint | null>(null);
  const [isLoadingUSDC, setIsLoadingUSDC] = useState(false);

  const { data, isLoading } = useReactQuery({
    queryKey: ['volume-24h', chain.chain_id, address, today],
    queryFn: async () => {
      const { data } = await coinClient.query({
        query: TradeVolumeDocument,
        variables: {
          where: {
            memecoin: {
              _eq: address.toLowerCase(),
            },
            chainId: {
              _eq: Number(chain.chain_id),
            },
            date: {
              _eq: today,
            },
          },
          orderBy: [
            {
              volumeETH: Order_By.Desc,
            },
          ],
        },
      });

      return data;
    },
  });

  const volume = data?.TradeVolume?.[0];
  const rawVolume = volume?.volumeETH ? BigInt(volume.volumeETH || '0') : null;
  const formattedVolume = rawVolume ? `${formatNumber(Number(formatEther(rawVolume)))} ETH` : null;

  useEffect(() => {
    const convertToUSDC = async () => {
      if (!rawVolume) {
        setFormattedVolumeUSDC(null);
        setRawVolumeUSDC(null);
        setIsLoadingUSDC(false);
        return;
      }

      setIsLoadingUSDC(true);
      try {
        const flaunchClient = FlaunchClient.getInstance(chain, address);
        const usdcAmount = await flaunchClient.getUSDCFromETH(rawVolume);
        setRawVolumeUSDC(usdcAmount);

        const usdcValue = formatUnits(usdcAmount, 6);
        setFormattedVolumeUSDC(`$${formatNumber(Number(usdcValue), true)}`);
      } catch (error) {
        setFormattedVolumeUSDC(null);
        setRawVolumeUSDC(null);
      } finally {
        setIsLoadingUSDC(false);
      }
    };

    convertToUSDC();
  }, [rawVolume, chain, address]);

  return {
    formattedVolume,
    rawVolume,
    formattedVolumeUSDC,
    rawVolumeUSDC,
    isLoadingVolume: isLoading || isLoadingUSDC,
  };
}

export function usePool(chainId: string, address: string) {
  const { data, isLoading } = useReactQuery({
    queryKey: ['pool', chainId, address],
    queryFn: async () => {
      const result = await coinClient.query({
        query: PoolCreatedDocument,
        variables: {
          where: {
            memecoin: {
              _eq: address.toLowerCase(),
            },
            chainId: {
              _eq: Number(chainId),
            },
          },
        },
      });

      return result.data;
    },
  });

  const pool = data?.PoolCreated?.[0] ?? null;

  return {
    pool,
    isLoadingPool: isLoading,
  };
}

export function useMarketCapChange(chainId: string, address: string) {
  const { pool, isLoadingPool } = usePool(chainId, address);
  const latestMarketCapETH = pool?.latestMarketCapETH ?? null;
  const previousMarketCapETH = pool?.previousMarketCapETH ?? null;

  let percentageChange: number | null = null;

  if (latestMarketCapETH != null && previousMarketCapETH != null) {
    const latest = Number(latestMarketCapETH);
    const previous = Number(previousMarketCapETH);

    if (previous !== 0) {
      const change = ((latest - previous) / previous) * 100;
      percentageChange = change;
    }
  }

  return {
    latestMarketCapETH,
    previousMarketCapETH,
    latestMarketCapDate: pool?.latestMarketCapDate ?? null,
    previousMarketCapDate: pool?.previousMarketCapDate ?? null,
    percentageChange,
    isLoadingMarketCapChange: isLoadingPool,
  };
}

export function useHoldersCount(chainId: string, address: string) {
  const { data, isLoading } = useReactQuery({
    queryKey: ['holders-count', chainId, address],
    queryFn: async () => {
      const { data } = await coinClient.query({
        query: MemecoinMetadataDocument,
        variables: {
          where: {
            memecoin: {
              _eq: address.toLowerCase(),
            },
            chainId: {
              _eq: Number(chainId),
            },
          },
        },
      });

      return data;
    },
  });

  const metadata = data?.MemecoinMetadata?.[0];
  const holdersCount = metadata?.holdersCount ? Number(metadata.holdersCount) : null;

  return {
    holdersCount,
    isLoadingHoldersCount: isLoading,
  };
}

export function usePoolInfo(chain: Chain, address: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['pool-info', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const poolIdValue = await flaunchClient.getPoolId();

      const nativeToken = await flaunchClient.getLETHAddress();
      const isNativeToken0 = nativeToken.toLowerCase().localeCompare(address.toLowerCase()) <= 0;

      return {
        poolId: poolIdValue,
        isEthToken0: isNativeToken0,
      };
    },
  });

  return {
    poolId: data?.poolId ?? null,
    isEthToken0: data?.isEthToken0 ?? null,
    isLoadingPoolInfo: isLoading,
  };
}

export function useEthToUsdcRate(chain: Chain, address: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['eth-to-usdc-rate', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const oneEth = BigInt('1000000000000000000');
      const usdcAmount = await flaunchClient.getUSDCFromETH(oneEth);
      return Number(formatUnits(usdcAmount, 6));
    },
  });

  return {
    rate: data ?? null,
    isLoadingRate: isLoading,
  };
}

export type PriceTimeSeriesData = {
  time: Date;
  timestamp: number;
  price: number;
};

function getPoolSwapPriceSnapshot(params: {
  swap: PoolSwapQuery['PoolSwap'][number];
  isEthToken0: boolean;
}): number {
  const ispAmount0 = BigInt(String(params.swap.ispAmount0 ?? '0'));
  const ispAmount1 = BigInt(String(params.swap.ispAmount1 ?? '0'));
  const flAmount0 = BigInt(String(params.swap.flAmount0 ?? '0'));
  const flAmount1 = BigInt(String(params.swap.flAmount1 ?? '0'));
  const uniAmount0 = BigInt(String(params.swap.uniAmount0 ?? '0'));
  const uniAmount1 = BigInt(String(params.swap.uniAmount1 ?? '0'));
  const ispFee0 = BigInt(String(params.swap.ispFee0 ?? '0'));
  const ispFee1 = BigInt(String(params.swap.ispFee1 ?? '0'));
  const flFee0 = BigInt(String(params.swap.flFee0 ?? '0'));
  const flFee1 = BigInt(String(params.swap.flFee1 ?? '0'));
  const uniFee0 = BigInt(String(params.swap.uniFee0 ?? '0'));
  const uniFee1 = BigInt(String(params.swap.uniFee1 ?? '0'));

  const totalAmount0 = (ispAmount0 + flAmount0 + uniAmount0) - (ispFee0 + flFee0 + uniFee0);
  const totalAmount1 = (ispAmount1 + flAmount1 + uniAmount1) - (ispFee1 + flFee1 + uniFee1);

  const ethAmount = params.isEthToken0 ? totalAmount0 : totalAmount1;
  const tokenAmount = params.isEthToken0 ? totalAmount1 : totalAmount0;

  const ethAmountAbs = ethAmount < BigInt(0) ? -ethAmount : ethAmount;
  const tokenAmountAbs = tokenAmount < BigInt(0) ? -tokenAmount : tokenAmount;

  if (tokenAmountAbs === BigInt(0)) {
    return 0;
  }

  const ethValue = Number(formatEther(ethAmountAbs));
  const tokenValue = Number(formatEther(tokenAmountAbs));
  const price = ethValue / tokenValue;

  return price;
}

export function usePoolSwapPriceTimeSeries(
  chain: Chain,
  address: string,
  filter?: {
    timeRange?: {
      startTime?: Date | number;
      endTime?: Date | number;
    };
    limit?: number;
  },
) {
  const { poolId, isEthToken0, isLoadingPoolInfo } = usePoolInfo(chain, address);
  const timeRange = filter?.timeRange;
  const limit = filter?.limit ?? 10000;

  const blockTimestampFilter = useMemo(() => {
    if (!timeRange) {
      return undefined;
    }

    const timestampFilter: { _gte?: string; _lte?: string } = {};

    if (timeRange.startTime !== undefined) {
      const startTimestamp = timeRange.startTime instanceof Date
        ? Math.floor(timeRange.startTime.getTime() / 1000)
        : Math.floor(timeRange.startTime / 1000);
      timestampFilter._gte = startTimestamp.toString();
    }

    if (timeRange.endTime !== undefined) {
      const endTimestamp = timeRange.endTime instanceof Date
        ? Math.floor(timeRange.endTime.getTime() / 1000)
        : Math.floor(timeRange.endTime / 1000);
      timestampFilter._lte = endTimestamp.toString();
    }

    return Object.keys(timestampFilter).length > 0 ? timestampFilter : undefined;
  }, [timeRange]);

  const { data, loading } = useGraphQLQuery<PoolSwapQuery, PoolSwapQueryVariables>(
    PoolSwapDocument,
    {
      variables: poolId
        ? {
          where: {
            poolId: {
              _eq: poolId,
            },
            chainId: {
              _eq: Number(chain.chain_id),
            },
            ...(blockTimestampFilter && {
              blockTimestamp: blockTimestampFilter,
            }),
          },
          orderBy: {
            blockTimestamp: Order_By.Asc,
          },
          limit,
        }
        : undefined,
      skip: !poolId || isLoadingPoolInfo,
      fetchPolicy: 'network-only',
    },
    coinClient,
  );

  const swaps = data?.PoolSwap || [];

  const shouldFetchLatestSwaps = Boolean(
    timeRange && poolId && !isLoadingPoolInfo && swaps.length < 2,
  );

  const { data: latestSwapsData, loading: latestSwapsLoading } = useGraphQLQuery<
    PoolSwapQuery,
    PoolSwapQueryVariables
  >(
    PoolSwapDocument,
    {
      variables: poolId
        ? {
          where: {
            poolId: {
              _eq: poolId,
            },
            chainId: {
              _eq: Number(chain.chain_id),
            },
          },
          orderBy: {
            blockTimestamp: Order_By.Desc,
          },
          limit: 2,
        }
        : undefined,
      skip: !shouldFetchLatestSwaps,
      fetchPolicy: 'network-only',
    },
    coinClient,
  );

  const priceTimeSeries = useMemo(() => {
    if (isEthToken0 === null) {
      return [];
    }

    if (swaps.length < 2) {
      if (!timeRange) {
        return [];
      }

      const latestSwap = swaps[swaps.length - 1] ?? latestSwapsData?.PoolSwap?.[0];
      const secondLatestSwap = latestSwapsData?.PoolSwap?.[1];

      if (!latestSwap) {
        return [];
      }

      const startTimestampMs = timeRange.startTime instanceof Date
        ? timeRange.startTime.getTime()
        : timeRange.startTime;
      const endTimestampMs = timeRange.endTime instanceof Date ? timeRange.endTime.getTime() : timeRange.endTime;

      if (startTimestampMs === undefined || endTimestampMs === undefined) {
        return [];
      }

      const startSwap = swaps.length === 0 ? (secondLatestSwap ?? latestSwap) : (secondLatestSwap ?? swaps[0]);
      const startPrice = getPoolSwapPriceSnapshot({ swap: startSwap, isEthToken0 });
      const endPrice = getPoolSwapPriceSnapshot({ swap: latestSwap, isEthToken0 });

      return [
        {
          time: new Date(startTimestampMs),
          timestamp: startTimestampMs,
          price: startPrice,
        },
        {
          time: new Date(endTimestampMs),
          timestamp: endTimestampMs,
          price: endPrice,
        },
      ];
    }

    const timeSeriesData: PriceTimeSeriesData[] = swaps
      .map((swap) => {
        const timestamp = Number(swap.blockTimestamp) * 1000;
        const time = new Date(timestamp);

        const price = getPoolSwapPriceSnapshot({
          swap,
          isEthToken0,
        });

        return {
          time,
          timestamp,
          price,
        };
      });

    return timeSeriesData;
  }, [swaps, isEthToken0, latestSwapsData, timeRange, limit]);

  return {
    data: priceTimeSeries,
    isLoading: isLoadingPoolInfo || loading || latestSwapsLoading,
  };
}

export function useTokenIds(stakingManagerAddress: string) {
  const { data, isLoading } = useReactQuery({
    queryKey: ['staking-manager-tokens', stakingManagerAddress],
    queryFn: async () => {
      if (!stakingManagerAddress) {
        return null;
      }

      const { data } = await coinClient.query<
        StakingManagerTokenQuery,
        StakingManagerTokenQueryVariables
      >({
        query: StakingManagerTokenDocument,
        variables: {
          where: {
            stakingManagerAddress: {
              _eq: stakingManagerAddress.toLowerCase(),
            },
          },
        },
      });

      return data;
    },
    enabled: !!stakingManagerAddress,
  });

  const tokenIds = useMemo(() => {
    if (!data?.StakingManagerToken) {
      return [];
    }
    return data.StakingManagerToken.map((token) => Number(token.tokenId));
  }, [data]);

  return {
    tokenIds,
    isLoading,
  };
}

export function useStakingAPR(chain: Chain, stakingManagerAddress: string) {
  const [apr, setApr] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const dateEnd = today.toISOString().split('T')[0];
  const dateStart = weekAgo.toISOString().split('T')[0];

  const { data: summaryData, isLoading: isLoadingSummary } = useReactQuery({
    queryKey: ['staking-summary', stakingManagerAddress, dateStart, dateEnd],
    queryFn: async () => {
      const { data } = await coinClient.query<
        StakingSummaryQuery,
        StakingSummaryQueryVariables
      >({
        query: StakingSummaryDocument,
        variables: {
          where: {
            stakingManagerAddress: { _eq: stakingManagerAddress.toLowerCase() },
            date: { _in: [dateStart, dateEnd] },
          },
        },
      });

      return data;
    },
  });

  useEffect(() => {
    if (isLoadingSummary) return;

    const calculateAPR = async () => {
      setIsLoading(true);

      const summaries = summaryData?.StakingSummary || [];
      if (summaries.length < 2) {
        setApr(0);
        setIsLoading(false);
        return;
      }

      const sorted = [...summaries].sort((a, b) => a.date.localeCompare(b.date));
      const summary1 = sorted[0];
      const summary2 = sorted[sorted.length - 1];

      const totalDeposited1 = BigInt(summary1.totalDeposited || '0');
      const totalDeposited2 = BigInt(summary2.totalDeposited || '0');
      const avgToken = (totalDeposited1 + totalDeposited2) / BigInt(2);

      if (avgToken === BigInt(0)) {
        setApr(0);
        setIsLoading(false);
        return;
      }

      const client = StakingManagerClient.getInstance(chain, stakingManagerAddress);

      let marketCap: bigint;
      try {
        marketCap = await client.getStakingTokenMarketCap(avgToken);
      } catch {
        setApr(0);
        setIsLoading(false);
        return;
      }

      if (marketCap === BigInt(0)) {
        setApr(0);
        setIsLoading(false);
        return;
      }

      const totalFees1 = BigInt(summary1.totalFees || '0');
      const totalFees2 = BigInt(summary2.totalFees || '0');
      const deltaFee = totalFees2 - totalFees1;

      const expectedFee = deltaFee * BigInt(52);
      const aprValue = (expectedFee * BigInt(100)) / marketCap;

      setApr(Number(aprValue));
      setIsLoading(false);
    };

    calculateAPR();
  }, [chain, stakingManagerAddress, summaryData, isLoadingSummary]);

  return {
    apr,
    isLoading: isLoading || isLoadingSummary,
  };
}

export function useStakingTVL(chain: Chain, stakingManagerAddress: string) {
  const [formattedTVL, setFormattedTVL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTVL = async () => {
      setIsLoading(true);

      const stakingClient = StakingManagerClient.getInstance(chain, stakingManagerAddress);
      const totalDeposited = await stakingClient.getTotalDeposited();
      const stakingToken = await stakingClient.getStakingToken();

      const ethValue = await stakingClient.getStakingTokenMarketCap(totalDeposited);

      const flaunchClient = FlaunchClient.getInstance(chain, stakingToken);
      const usdcValue = await flaunchClient.getUSDCFromETH(ethValue);

      const formattedValue = formatUnits(usdcValue, 6);
      setFormattedTVL(`$${formattedValue}`);
      setIsLoading(false);
    };

    fetchTVL().catch(() => {
      setFormattedTVL(null);
      setIsLoading(false);
    });
  }, [chain, stakingManagerAddress]);

  return {
    tvl: formattedTVL,
    isLoading,
  };
}

export function useStakingCoin(spaceId: string) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const { launchpadGroup, isLoading: isLoadingLaunchpadGroup } = useLaunchpadGroup(spaceId);

  const chain = launchpadGroup?.chain_id ? chainsMap[launchpadGroup.chain_id] : undefined;

  const { data: stakingToken, isLoading: isLoadingStakingToken } = useReactQuery({
    queryKey: ['staking-coin', spaceId, launchpadGroup?.address],
    queryFn: async () => {
      if (!chain || !launchpadGroup?.address) {
        return null;
      }

      const stakingClient = StakingManagerClient.getInstance(chain, launchpadGroup.address);
      return stakingClient.getStakingToken();
    },
    enabled: !!chain && !!launchpadGroup?.address,
  });

  return {
    stakingToken: stakingToken ?? null,
    chain,
    isLoading: isLoadingLaunchpadGroup || isLoadingStakingToken,
  };
}

export function useClaimableAmount(chain: Chain, stakingManagerAddress: string, stakingToken: string) {
  const [claimableUSDC, setClaimableUSDC] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClaimableAmount = async () => {
      setIsLoading(true);
      const userAddress = appKit.getAddress();
      if (!userAddress) {
        setClaimableUSDC(null);
        setIsLoading(false);
        return;
      }

      const stakingClient = StakingManagerClient.getInstance(chain, stakingManagerAddress);
      const ethBalance = await stakingClient.balances(userAddress).catch((error) => {
        console.error('Failed to fetch staking balance:', error);
        return 0n;
      });

      if (ethBalance === 0n) {
        setClaimableUSDC('$0.00');
        setIsLoading(false);
        return;
      }

      const flaunchClient = FlaunchClient.getInstance(chain, stakingToken);
      const usdcAmount = await flaunchClient.getUSDCFromETH(ethBalance).catch((error) => {
        console.error('Failed to convert ETH to USDC:', error);
        return 0n;
      });
      const usdcValue = formatUnits(usdcAmount, 6);
      setClaimableUSDC(`$${Number(usdcValue).toFixed(2)}`);
      setIsLoading(false);
    };

    fetchClaimableAmount();
  }, [chain, stakingManagerAddress, stakingToken]);

  return {
    claimableUSDC,
    isLoading,
  };
}
