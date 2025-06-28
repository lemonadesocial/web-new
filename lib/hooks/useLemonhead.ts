import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';
import ERC721 from '$lib/abis/ERC721.json';

import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';

const LEMONHEAD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LEMONHEAD_CONTRACT_ADDRESS;

export function useLemonhead() {
  const { address } = useAppKitAccount();
  const chainsMap = useAtomValue(chainsMapAtom);
  const [loading, setLoading] = useState(false);
  const [hasLemonhead, setHasLemonhead] = useState(false);

  useEffect(() => {
    const checkBalance = async () => {
      if (!address || !LEMONHEAD_CONTRACT_ADDRESS) return;

      const ethereumChain = Object.values(chainsMap).find(chain => 
        chain.platform === 'ethereum' && 
        (process.env.NEXT_PUBLIC_APP_ENV === 'production' ? chain.chain_id === '1' : chain.chain_id === '11155111')
      );

      if (!ethereumChain?.rpc_url) return;

      setLoading(true);

      try {
        const provider = new ethers.JsonRpcProvider(ethereumChain.rpc_url);
        const contract = new ethers.Contract(
          LEMONHEAD_CONTRACT_ADDRESS,
          ERC721,
          provider
        );

        const balanceResult = await contract.balanceOf(address);
        setHasLemonhead(balanceResult > 0);
      } finally {
        setLoading(false);
      }
    };

    checkBalance();
  }, [address, chainsMap]);

  return {
    hasLemonhead,
    loading,
  };
}
