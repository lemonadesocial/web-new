import { formatEther, formatUnits, zeroAddress } from 'viem';
import { useEffect, useState } from 'react';
import { useQuery as useGraphQLQuery } from '$lib/graphql/request';
import { useQuery as useReactQuery } from '@tanstack/react-query';

import {
  ListLaunchpadGroupsDocument,
  type ListLaunchpadGroupsQuery,
  type ListLaunchpadGroupsQueryVariables,
} from '$lib/graphql/generated/backend/graphql';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { formatNumber } from '$lib/utils/number';

type LaunchpadGroupItem = ListLaunchpadGroupsQuery['listLaunchpadGroups']['items'][number];

export function useGroup(chain: Chain, address: string) {
  const [implementationAddress, setImplementationAddress] = useState<string | null>(null);
  const [isLoadingOwner, setIsLoadingOwner] = useState(true);
  const [launchpadGroup, setLaunchpadGroup] = useState<LaunchpadGroupItem | null>(null);

  useEffect(() => {
    const fetchOwner = async () => {
      setIsLoadingOwner(true);
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const owner = await flaunchClient.getOwnerOf();

      if (owner && owner.toLowerCase() !== zeroAddress.toLowerCase()) {
        setImplementationAddress(owner);
      }

      setIsLoadingOwner(false);
    };

    fetchOwner();
  }, [chain, address]);

  const shouldSkipQuery = !implementationAddress || implementationAddress.toLowerCase() === zeroAddress.toLowerCase();

  const { loading: isLoadingQuery } = useGraphQLQuery<ListLaunchpadGroupsQuery, ListLaunchpadGroupsQueryVariables>(
    ListLaunchpadGroupsDocument,
    {
      variables: implementationAddress ? { address: implementationAddress } : undefined,
      skip: shouldSkipQuery,
      onComplete: (data) => {
        if (data?.listLaunchpadGroups?.items && data.listLaunchpadGroups.items.length > 0) {
          const groupItem = data.listLaunchpadGroups.items[0] as LaunchpadGroupItem;
          setLaunchpadGroup(groupItem);
        }
      },
    }
  );

  const isLoading = isLoadingOwner || isLoadingQuery;

  return {
    implementationAddress,
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
      const usdcAmount = await flaunchClient.getEarnedFees();
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

  const formattedCurrent = data ? `${formatEther(data.current)} ETH` : null;
  const formattedThreshold = data ? `${formatEther(data.threshold)} ETH` : null;

  return {
    current: data?.current ?? null,
    threshold: data?.threshold ?? null,
    progress: data?.progress ?? null,
    formattedCurrent,
    formattedThreshold,
    isLoadingBuybackCharging: isLoading,
  };
}
