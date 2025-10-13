import { useEffect } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ethers } from 'ethers';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { chainsMapAtom } from '$lib/jotai';
import { LemonheadNFTContract } from '$lib/utils/crypto';
import { LEMONHEAD_CHAIN_ID } from '$lib/components/features/lemonheads/mint/utils';

type LemonheadData = {
  tokenId: number;
  image: string;
  totalMinted: number;
};

const lemonheadDataAtom = atom<LemonheadData | null>(null);
const lemonheadLoadingAtom = atom<boolean>(false);
const lemonheadErrorAtom = atom<Error | null>(null);

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
  
  const [data, setData] = useAtom(lemonheadDataAtom);
  const [loading, setLoading] = useAtom(lemonheadLoadingAtom);
  const setError = useSetAtom(lemonheadErrorAtom);

  useEffect(() => {
    if (!address || !chainsMap[LEMONHEAD_CHAIN_ID]) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    fetchLemonheadData(address, chainsMap)
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address, chainsMap[LEMONHEAD_CHAIN_ID]?.chain_id]);

  return { data, loading };
}
