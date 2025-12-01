import { formatEther, formatUnits, zeroAddress } from 'viem';
import { useEffect, useState } from 'react';
import { useQuery as useGraphQLQuery } from '$lib/graphql/request';
import { useQuery as useReactQuery } from '@tanstack/react-query';
import { coinClient } from '$lib/graphql/request/instances';

import {
  ListLaunchpadGroupsDocument,
  type ListLaunchpadGroupsQuery,
  type ListLaunchpadGroupsQueryVariables,
} from '$lib/graphql/generated/backend/graphql';
import {
  TradeVolumeDocument,
  type TradeVolumeQuery,
  type TradeVolumeQueryVariables,
  PoolCreatedDocument,
  type PoolCreatedQuery,
  type PoolCreatedQueryVariables,
  Order_By,
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

  const { loading: isLoadingQuery } = useGraphQLQuery<ListLaunchpadGroupsQuery, ListLaunchpadGroupsQueryVariables>(
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
      setFormattedFees(`${usdcValue} USDC`);
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
      setFormattedTreasuryValue(`${formattedValue} USDC`);
      
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

  const formattedMarketCap = data ? `${formatNumber(Number(formatUnits(data, 6)))} USDC` : null;

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

  const formattedLiquidity = data ? `${formatNumber(Number(formatUnits(data, 6)))} USDC` : null;

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

  const formattedUsdcValue = data ? `${formatNumber(Number(formatUnits(data.usdcValue, 6)))} USDC` : null;
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

export function useTokenData(chain: Chain, address: string) {
  const {
    data,
    isLoading,
  } = useReactQuery({
    queryKey: ['token-data', chain.chain_id, address],
    queryFn: async () => {
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      return flaunchClient.getTokenData();
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
      fetchPolicy: 'network-only',
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
        setRawVolumeUSDC(usdcAmount);

        const usdcValue = formatUnits(usdcAmount, 6);
        setFormattedVolumeUSDC(`${formatNumber(Number(usdcValue))} USDC`);
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
  const {
    data,
    loading,
  } = useGraphQLQuery<PoolCreatedQuery, PoolCreatedQueryVariables>(
    PoolCreatedDocument,
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
      },
      fetchPolicy: 'network-only',
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
