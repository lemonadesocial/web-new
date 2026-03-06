'use client';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { createPublicClient, http, type Address } from 'viem';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';
import { getViemChainConfig } from '$lib/utils/crypto';
import LemonadePassport from '$lib/abis/LemonadePassport.json';
import { LEMONHEAD_CHAIN_ID } from '$lib/components/features/lemonheads/mint/utils';

async function fetchPassportData(address: string, chainsMap: Record<string, Chain>) {
  const data = { tokenId: 0n, image: '' };
  const chain = chainsMap[LEMONHEAD_CHAIN_ID];
  const contractAddress = chain?.lemonade_passport_contract_address as string | undefined;

  if (chain && contractAddress) {
    const viemChain = getViemChainConfig(chain);
    const publicClient = createPublicClient({
      chain: viemChain,
      transport: http(chain.rpc_url),
    });

    const tokenId = await publicClient.readContract({
      abi: LemonadePassport.abi,
      address: contractAddress as Address,
      functionName: 'bounds',
      args: [address as Address],
    }) as bigint;

    data.tokenId = tokenId;

    if (tokenId > 0n) {
      const tokenUri = await publicClient.readContract({
        abi: LemonadePassport.abi,
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

export function usePassport() {
  const { address } = useAppKitAccount();
  const chainsMap = useAtomValue(chainsMapAtom);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['passport', address, chainsMap],
    queryFn: () => fetchPassportData(address!, chainsMap),
    enabled: !!address && !!chainsMap,
  });

  return { data, loading, error };
}
