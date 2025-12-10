import { Chain } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { MusicNftContract } from '$lib/utils/crypto';
import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useAtomValue } from 'jotai';

async function fetchMusicNftData(address: string, chain: Chain) {
  const data = { totalMinted: 0 };
  const contractAddress = chain?.lemonhead_contract_address;

  if (contractAddress) {
    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = MusicNftContract.attach(contractAddress).connect(provider) as ethers.Contract;

    const nextTokenId = await contract.getFunction('nextTokenId')(address);
    // NOTE: nextTokenId should minus 1
    data.totalMinted = nextTokenId > 0 ? nextTokenId - 1 : 0;
  }

  return data;
}

export function useMusicNft({ network_id }: { network_id?: string }) {
  const { address } = useAppKitAccount();
  const chainsMap = useAtomValue(chainsMapAtom);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['music_nft', address, chainsMap],
    queryFn: () => fetchMusicNftData(address!, chainsMap[network_id!]),
    enabled: !!address && !!chainsMap && !!network_id,
  });

  return { data, loading, error };
}
