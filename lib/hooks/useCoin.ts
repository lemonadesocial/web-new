import { useEffect, useState } from 'react';
import { useQuery } from '$lib/graphql/request';
import {
  ListLaunchpadGroupsDocument,
  type ListLaunchpadGroupsQuery,
  type ListLaunchpadGroupsQueryVariables,
} from '$lib/graphql/generated/backend/graphql';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { useTokenBalance } from '$lib/hooks/useBalance';
import { formatUnits, zeroAddress } from 'viem';

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

  const { loading: isLoadingQuery } = useQuery<ListLaunchpadGroupsQuery, ListLaunchpadGroupsQueryVariables>(
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

export function useTokenData(chain: Chain, address: string) {
  const [tokenData, setTokenData] = useState<{ name: string; symbol: string; tokenURI: string; decimals: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokenData = async () => {
      setIsLoading(true);
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const data = await flaunchClient.getTokenData();

      setTokenData(data);
      setIsLoading(false);
    };

    fetchTokenData();
  }, [chain, address]);

  return {
    tokenData,
    isLoadingTokenData: isLoading,
  };
}

export function useCoinTokenBalance(chain: Chain, address: string) {
  const { tokenData, isLoadingTokenData } = useTokenData(chain, address);

  const {
    balance,
    formattedBalance,
    loading,
    error,
  } = useTokenBalance({
    chain,
    tokenAddress: address,
    decimals: tokenData?.decimals ?? 18,
  });

  return {
    balance,
    formattedBalance,
    loading: loading || isLoadingTokenData,
    error,
  };
}


