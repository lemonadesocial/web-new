'use client';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { createPublicClient, http, type Address } from 'viem';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';
import { getViemChainConfig } from '$lib/utils/crypto';
import { PASSPORT_CHAIN_ID } from '$lib/components/features/passports/utils';
import { ContractAddressFieldMapping, PASSPORT_PROVIDER } from '$lib/components/features/passports/types';
import AbstractPassport from '$lib/abis/AbstractPassport.json';

async function fetchPassportData(address: string, chain: Chain, provider: PASSPORT_PROVIDER) {
  const data = { tokenId: 0n, image: '' };
  const contractKey = ContractAddressFieldMapping[provider];
  const contractAddress = contractKey
    ? (chain[contractKey] as string | undefined)
    : undefined;

  if (chain && contractAddress) {
    const viemChain = getViemChainConfig(chain);
    const publicClient = createPublicClient({
      chain: viemChain,
      transport: http(chain.rpc_url),
    });

    const tokenId = await publicClient.readContract({
      abi: AbstractPassport.abi,
      address: contractAddress as Address,
      functionName: 'bounds',
      args: [address as Address],
    }) as bigint;

    data.tokenId = tokenId;

    if (tokenId > 0n) {
      const tokenUri = await publicClient.readContract({
        abi: AbstractPassport.abi,
        address: contractAddress as Address,
        functionName: 'tokenURI',
        args: [tokenId],
      }) as string;

      const res = await fetch(tokenUri);
      const jsonData = await res.json();
      data.image = jsonData.image;
    }
  }

  return data;
}

export function usePassports(provider: PASSPORT_PROVIDER) {
  const { address } = useAppKitAccount();
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[PASSPORT_CHAIN_ID];

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['passport', address, chainsMap],
    queryFn: () => fetchPassportData(address!, chain, provider),
    enabled: !!address && !!chain && !!provider,
  });

  return { data, loading, error };
}
