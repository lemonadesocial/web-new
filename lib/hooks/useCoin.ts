import { formatEther, formatUnits, zeroAddress } from 'viem';
import { useEffect, useState, useMemo } from 'react';
import { useQuery as useGraphQLQuery } from '$lib/graphql/request';
import { useQuery as useReactQuery } from '@tanstack/react-query';

import { coinClient } from '$lib/graphql/request/instances';
import {
  ListLaunchpadGroupsDocument,
  type ListLaunchpadGroupsQuery
} from '$lib/graphql/generated/backend/graphql';
import {
  TradeVolumeDocument, PoolCreatedDocument, Order_By, MemecoinMetadataDocument, PoolSwapDocument, type PoolSwap
} from '$lib/graphql/generated/coin/graphql';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { formatNumber } from '$lib/utils/number';

type LaunchpadGroupItem = ListLaunchpadGroupsQuery['listLaunchpadGroups']['items'][number];

export function useGroup(chain: Chain, address: string) {
  const [treasuryManagerAddress, setTreasuryManagerAddress] = useState<string | null>(null);
  const [isLoadingTreasuryManagerAddress, setIsLoadingTreasuryManagerAddress] = useState(true);
  const [launchpadGroup, setLaunchpadGroup] = useState<LaunchpadGroupItem | null>(null);

  useEffect(() => {
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
  }, [chain, address]);

  const shouldSkipQuery = !treasuryManagerAddress || treasuryManagerAddress.toLowerCase() === zeroAddress.toLowerCase();

  const { loading: isLoadingQuery } = useGraphQLQuery(
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

  const isLoading = isLoadingTreasuryManagerAddress || isLoadingQuery;

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

export function useTokenData(chain: Chain, address: string, tokenUri?: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['token-data', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      return flaunchClient.getTokenData(tokenUri);
    },
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
    enabled: !!chain && !!address,
  });

  const formattedAmount0 = data ? `${formatEther(data.amount0)} ETH` : null;
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

  const { data, loading } = useGraphQLQuery(
    TradeVolumeDocument,
    {
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
        limit: 1,
        offset: 0,
      },
    },
    coinClient,
  );

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
        console.log(usdcAmount)
        setRawVolumeUSDC(usdcAmount);

        const usdcValue = formatUnits(usdcAmount, 6);
        setFormattedVolumeUSDC(`$${formatNumber(Number(usdcValue)), true}`);
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
    isLoadingVolume: loading || isLoadingUSDC,
  };
}

export function useMarketCapChange(chain: Chain, address: string) {
  const { data, loading } = useGraphQLQuery(PoolCreatedDocument,
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
        orderBy: [
          {
            latestMarketCapETH: Order_By.Desc,
          },
        ],
        limit: 1,
        offset: 0,
      }
    },
    coinClient,
  );

  const pool = data?.PoolCreated?.[0];
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
    isLoadingMarketCapChange: loading,
  };
}

export function useHoldersCount(chain: Chain, address: string) {
  const { data, loading } = useGraphQLQuery(
    MemecoinMetadataDocument,
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

  const metadata = data?.MemecoinMetadata?.[0];
  const holdersCount = metadata?.holdersCount ? Number(metadata.holdersCount) : null;

  return {
    holdersCount,
    isLoadingHoldersCount: loading,
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
    enabled: !!chain && !!address,
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
    enabled: !!chain && !!address,
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
  priceUSDC: number;
  totalAmount0: bigint;
  totalAmount1: bigint;
};

export function usePoolSwapPriceTimeSeries(
  chain: Chain,
  address: string,
  timeRange?: {
    startTime?: Date | number;
    endTime?: Date | number;
  },
) {
  const { poolId, isEthToken0, isLoadingPoolInfo } = usePoolInfo(chain, address);

  const blockTimestampFilter = useMemo(() => {
    if (!timeRange) {
      return undefined;
    }

    const filter: { _gte?: string; _lte?: string } = {};

    if (timeRange.startTime !== undefined) {
      const startTimestamp = timeRange.startTime instanceof Date
        ? Math.floor(timeRange.startTime.getTime() / 1000)
        : Math.floor(timeRange.startTime / 1000);
      filter._gte = startTimestamp.toString();
    }

    if (timeRange.endTime !== undefined) {
      const endTimestamp = timeRange.endTime instanceof Date
        ? Math.floor(timeRange.endTime.getTime() / 1000)
        : Math.floor(timeRange.endTime / 1000);
      filter._lte = endTimestamp.toString();
    }

    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [timeRange]);

  const { data, loading } = useGraphQLQuery(
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
            limit: 10000,
          }
        : undefined,
      skip: !poolId || isLoadingPoolInfo,
      fetchPolicy: 'network-only',
    },
    coinClient,
  );

  const { rate: ethToUsdcRate } = useEthToUsdcRate(chain, address);

  const swaps = data?.PoolSwap || [];

  const priceTimeSeries = useMemo(() => {
    if (swaps.length === 0 || isEthToken0 === null) {
      return [];
    }

    const timeSeriesData: PriceTimeSeriesData[] = swaps
      .map((swap) => {
        const ispAmount0 = BigInt(swap.ispAmount0 || '0');
        const ispAmount1 = BigInt(swap.ispAmount1 || '0');
        const flAmount0 = BigInt(swap.flAmount0 || '0');
        const flAmount1 = BigInt(swap.flAmount1 || '0');
        const uniAmount0 = BigInt(swap.uniAmount0 || '0');
        const uniAmount1 = BigInt(swap.uniAmount1 || '0');
        const ispFee0 = BigInt(swap.ispFee0 || '0');
        const ispFee1 = BigInt(swap.ispFee1 || '0');
        const flFee0 = BigInt(swap.flFee0 || '0');
        const flFee1 = BigInt(swap.flFee1 || '0');
        const uniFee0 = BigInt(swap.uniFee0 || '0');
        const uniFee1 = BigInt(swap.uniFee1 || '0');

        const totalAmount0 = (ispAmount0 + flAmount0 + uniAmount0) - (ispFee0 + flFee0 + uniFee0);
        const totalAmount1 = (ispAmount1 + flAmount1 + uniAmount1) - (ispFee1 + flFee1 + uniFee1);

        const ethAmount = isEthToken0 ? totalAmount0 : totalAmount1;
        const tokenAmount = isEthToken0 ? totalAmount1 : totalAmount0;

        const ethAmountAbs = ethAmount < BigInt(0) ? -ethAmount : ethAmount;
        const tokenAmountAbs = tokenAmount < BigInt(0) ? -tokenAmount : tokenAmount;

        const timestamp = Number(swap.blockTimestamp) * 1000;
        const time = new Date(timestamp);

        let price = 0;
        let priceUSDC = 0;
        if (tokenAmountAbs !== BigInt(0)) {
          const ethValue = Number(formatEther(ethAmountAbs));
          const tokenValue = Number(formatEther(tokenAmountAbs));
          price = ethValue / tokenValue;
          
          if (ethToUsdcRate) {
            priceUSDC = price * ethToUsdcRate;
          }
        }

        return {
          time,
          timestamp,
          price,
          priceUSDC,
          totalAmount0,
          totalAmount1,
        };
      });

    return timeSeriesData;
  }, [swaps, isEthToken0, ethToUsdcRate]);

  return {
    data: priceTimeSeries,
    isLoading: isLoadingPoolInfo || loading,
  };
}
