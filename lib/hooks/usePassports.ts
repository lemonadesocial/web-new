import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { AbstractPassportContract } from '$lib/utils/crypto';
import { ContractAddressFieldMapping, PASSPORT_PROVIDER } from '$lib/components/features/passports/types';
import { usePassportChain } from './usePassportChain';

async function fetchPassportData(address: string, chain: Chain, provider: PASSPORT_PROVIDER) {
  const data = { tokenId: 0, image: '' };
  const contractKey = ContractAddressFieldMapping[provider];
  const contractAddress = contractKey
    ? (chain[contractKey as unknown as keyof Chain] as string | undefined)
    : undefined;

  if (contractAddress) {
    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = AbstractPassportContract.attach(contractAddress).connect(provider) as ethers.Contract;

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

export function usePassports(provider: PASSPORT_PROVIDER) {
  const { address } = useAppKitAccount();
  const chain = usePassportChain(provider);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['passport', address, chain, provider],
    queryFn: () => fetchPassportData(address!, chain!, provider),
    enabled: !!address && !!chain && !!provider,
  });

  return { data, loading, error };
}
