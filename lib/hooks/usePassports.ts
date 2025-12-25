import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';

import { Chain, PassportProvider } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';
import { AbstractPassportContract } from '$lib/utils/crypto';
import { LEMONHEAD_CHAIN_ID } from '$lib/components/features/lemonheads/mint/utils';
import { PASSPORT_CHAIN_ID } from '$lib/components/features/passports/utils';
import { PASSPORT_PROVIDER } from '$lib/components/features/passports/config';

const MAPPING_PASSPORT_PROVIDER = {
  mint: '',
  zugrama: '',
  'vinyl-nation': 'vinyl_nation_passport_contract_address',
  'festival-nation': 'festival_nation_passport_contract_address',
  'drip-nation': 'drip_nation_passport_contract_address',
};

async function fetchPassportData(address: string, chain: Chain, provider: PASSPORT_PROVIDER) {
  const data = { tokenId: 0, image: '' };
  const contractKey = MAPPING_PASSPORT_PROVIDER[provider];
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
