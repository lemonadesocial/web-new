import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';

import ERC721 from '$lib/abis/ERC721.json';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';
import { LEMONHEAD_CHAIN_ID } from '$lib/components/features/lemonheads/utils';
import { LemonheadNFTContract } from '$lib/utils/crypto';

async function fetchLemonheadData(address: string, chainsMap: Record<string, Chain>) {
  const data = { tokenId: 0, image: '', totalMinted: 0 };
  const chain = chainsMap[LEMONHEAD_CHAIN_ID];
  const contractAddress = chain?.lemonhead_contract_address;

  if (contractAddress) {
    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = LemonheadNFTContract.attach(contractAddress).connect(provider) as ethers.Contract;

    const tokenId = await contract.getFunction('bounds')(address);
    data.tokenId = tokenId;
    if (tokenId > 0) {
      const tokenUri = await contract.getFunction('tokenURI')(tokenId);
      const res = await fetch(tokenUri);
      const jsonData = await res.json();
      data.image = jsonData.image;
    }

    const totalMinted = await contract.getFunction('tokenId')();
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
