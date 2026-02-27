import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { createPublicClient, http, type Address } from 'viem';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';
import { getViemChainConfig } from '$lib/utils/crypto';
import { LEMONHEAD_CHAIN_ID } from '$lib/components/features/lemonheads/mint/utils';
import LemonheadNFT from '$lib/abis/LemonheadNFT.json';

async function fetchLemonheadData(address: string, chainsMap: Record<string, Chain>) {
  const data = { tokenId: 0, image: '', totalMinted: 0 };
  const chain = chainsMap[LEMONHEAD_CHAIN_ID];
  const contractAddress = chain?.lemonhead_contract_address;

  if (chain && contractAddress) {
    const publicClient = createPublicClient({
      chain: getViemChainConfig(chain),
      transport: http(chain.rpc_url),
    });

    const tokenId = await publicClient.readContract({
      abi: LemonheadNFT.abi,
      address: contractAddress as Address,
      functionName: 'bounds',
      args: [address as Address],
    }) as number;
    data.tokenId = tokenId;
    if (tokenId > 0) {
      const tokenUri = await publicClient.readContract({
        abi: LemonheadNFT.abi,
        address: contractAddress as Address,
        functionName: 'tokenURI',
        args: [BigInt(tokenId)],
      }) as string;
      const res = await fetch(tokenUri);
      const jsonData = await res.json();
      data.image = jsonData.image;
    }

    const totalMinted = await publicClient.readContract({
      abi: LemonheadNFT.abi,
      address: contractAddress as Address,
      functionName: 'tokenId',
    }) as number;
    data.totalMinted = totalMinted;
  }

  return data;
}

export function useLemonhead() {
  const { address } = useAppKitAccount();
  const chainsMap = useAtomValue(chainsMapAtom);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['lemonhead', address, chainsMap],
    queryFn: () => fetchLemonheadData(address!, chainsMap),
    enabled: !!address && !!chainsMap,
  });

  return { data, loading, error };
}
