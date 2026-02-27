'use client';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { createPublicClient, http, type Address } from 'viem';
import { getViemChainConfig } from '$lib/utils/crypto';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import MusicNft from '$lib/abis/MusicNft.json';

type Data = {
  totalMinted?: number;
  owner?: string;
};

async function fetchMusicNftData(contractAddress: string, chain: Chain) {
  const data: Data = { totalMinted: 0, owner: undefined };

  if (contractAddress) {
    const publicClient = createPublicClient({
      chain: getViemChainConfig(chain),
      transport: http(chain.rpc_url),
    });

    const owner = await publicClient.readContract({
      abi: MusicNft.abi,
      address: contractAddress as Address,
      functionName: 'owner',
    }) as string;
    data.owner = owner;

    const nextTokenId = await publicClient.readContract({
      abi: MusicNft.abi,
      address: contractAddress as Address,
      functionName: 'nextTokenId',
    }) as bigint;
    data.totalMinted = Number(nextTokenId) > 0 ? Number(nextTokenId) - 1 : 0;
  }

  return data;
}

export function useMusicNft({ network_id, contractAddress }: { network_id?: string; contractAddress?: string | null }) {
  const chainsMap = useAtomValue(chainsMapAtom);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['music_nft', contractAddress],
    queryFn: () => fetchMusicNftData(contractAddress!, chainsMap[network_id!]),
    enabled: !!chainsMap && !!network_id && !!contractAddress,
  });

  return { data, loading, error };
}
