import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { mainnet } from 'viem/chains';

import { useAppKitAccount } from '$lib/utils/appkit';
import { ERC721Contract } from '$lib/utils/crypto';

const FLUFFLE_CONTRACT_ADDRESS = '0x4E502Ab1Bb313B3C1311eb0D11B31a6B62988b86';

async function fetchFluffleData(address: string) {
  const data = { tokenId: 0, image: '', hasToken: false };

  try {
    const provider = new ethers.JsonRpcProvider(mainnet.rpcUrls.default.http[0]);
    const contract = ERC721Contract.attach(FLUFFLE_CONTRACT_ADDRESS).connect(provider) as ethers.Contract;

    const balance = await contract.getFunction('balanceOf')(address);
    console.log(balance)
    
    if (balance > 0) {
      // data.hasToken = true;
      // const tokenId = await contract.getFunction('tokenOfOwnerByIndex')(address, 0);
      // data.tokenId = Number(tokenId);
      
      // if (data.tokenId > 0) {
      //   const tokenUri = await contract.getFunction('tokenURI')(data.tokenId);
      //   const res = await fetch(tokenUri);
      //   const jsonData = await res.json();
      //   data.image = jsonData.image;
      // }
    }
  } catch (error) {
    console.error('Error fetching Fluffle data:', error);
  }

  return data;
}

export function useFluffle() {
  // const { address } = useAppKitAccount();
  const address = '0xc78042a8b84fd7446c05f24add517731c638fc5f';

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['fluffle', address],
    queryFn: () => fetchFluffleData(address!),
    enabled: !!address,
  });

  return { data, loading, error };
}

