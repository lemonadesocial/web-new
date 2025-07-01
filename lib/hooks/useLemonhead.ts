import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';

import ERC721 from '$lib/abis/ERC721.json';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';

async function fetchLemonheadBalance(address: string, chainsMap: Record<string, Chain>) {
  const ethereumChain = Object.values(chainsMap).find((chain: Chain) => 
    chain.platform === 'ethereum' && 
    (process.env.NEXT_PUBLIC_APP_ENV === 'production' ? chain.chain_id === '1' : chain.chain_id === '11155111')
  );

  if (!ethereumChain?.rpc_url || !ethereumChain?.lemonhead_contract_address) {
    return false;
  }

  const provider = new ethers.JsonRpcProvider(ethereumChain.rpc_url);
  const contract = new ethers.Contract(
    ethereumChain.lemonhead_contract_address,
    ERC721,
    provider
  );

  const balanceResult = await contract.balanceOf(address);
  return balanceResult > 0;
}

export function useLemonhead() {
  console.log('useLemonhead');
  const { address } = useAppKitAccount();
  const chainsMap = useAtomValue(chainsMapAtom);

  const { data: hasLemonhead = false, isLoading: loading, error } = useQuery({
    queryKey: ['lemonhead', address, chainsMap],
    queryFn: () => fetchLemonheadBalance(address!, chainsMap),
    enabled: !!address && !!chainsMap,
  });

  return {
    hasLemonhead,
    loading,
    error,
  };
}
