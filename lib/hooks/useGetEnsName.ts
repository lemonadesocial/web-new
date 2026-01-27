'use client';
import React from 'react';
import * as ethers from 'ethers';
import { mainnet } from 'viem/chains';

export function useGetEns(wallet?: string) {
  const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    if (wallet) getEnsUsername(wallet).then();
  }, [wallet]);

  const getEnsUsername = async (wallet: string) => {
    const provider = new ethers.JsonRpcProvider(mainnet.rpcUrls.default.http[0]);
    // Use lookup to get ENS name from wallet address
    const ensName = await provider.lookupAddress(wallet);
    if (ensName) setUsername(`@${ensName}`);
  };

  return { username };
}
