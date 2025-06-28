import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';
import ERC721 from '$lib/abis/ERC721.json';
import { Chain } from '$lib/graphql/generated/backend/graphql';

import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';

const LEMONHEAD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LEMONHEAD_CONTRACT_ADDRESS;

async function fetchLemonheadBalance(address: string, chainsMap: Record<string, Chain>) {
  console.log('fetching lemonhead balance');

  if (!address || !LEMONHEAD_CONTRACT_ADDRESS) {
    return false;
  }

  const ethereumChain = Object.values(chainsMap).find((chain: Chain) => 
    chain.platform === 'ethereum' && 
    (process.env.NEXT_PUBLIC_APP_ENV === 'production' ? chain.chain_id === '1' : chain.chain_id === '11155111')
  );

  if (!ethereumChain?.rpc_url) {
    return false;
  }

  const provider = new ethers.JsonRpcProvider(ethereumChain.rpc_url);
  const contract = new ethers.Contract(
    LEMONHEAD_CONTRACT_ADDRESS,
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
