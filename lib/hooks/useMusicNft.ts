import { Chain } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { MusicNftContract } from '$lib/utils/crypto';
import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useAtomValue } from 'jotai';

type Data = {
  totalMinted?: number;
  owner?: string;
};

async function fetchMusicNftData(contractAddress: string, chain: Chain) {
  const data: Data = { totalMinted: 0, owner: undefined };

  if (contractAddress) {
    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = MusicNftContract.attach(contractAddress).connect(provider) as ethers.Contract;

    const owner = await contract.getFunction('owner')();
    data.owner = owner;

    const nextTokenId = await contract.getFunction('nextTokenId')();
    // // NOTE: nextTokenId should minus 1
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
    queryFn: () => fetchMusicNftData(contractAddress as string, chainsMap[network_id as string]),
    enabled: !!chainsMap && !!network_id && !!contractAddress,
  });

  return { data, loading, error };
}
