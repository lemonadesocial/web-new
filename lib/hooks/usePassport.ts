import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';
import { LemonadePassportContract } from '$lib/utils/crypto';
import { LEMONHEAD_CHAIN_ID } from '$lib/components/features/lemonheads/mint/utils';

async function fetchPassportData(address: string, chainsMap: Record<string, Chain>) {
  const data = { tokenId: 0, image: '' };
  const chain = chainsMap[LEMONHEAD_CHAIN_ID];
  const contractAddress = chain?.lemonade_passport_contract_address as string | undefined;

  if (contractAddress) {
    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = LemonadePassportContract.attach(contractAddress).connect(provider) as ethers.Contract;

    const tokenId = await contract.getFunction('bounds')(address);
    data.tokenId = tokenId;
    if (tokenId > 0) {
      const tokenUri = await contract.getFunction('tokenURI')(tokenId);
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
