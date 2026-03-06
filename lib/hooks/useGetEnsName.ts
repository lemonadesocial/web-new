'use client';
import React from 'react';
import { createPublicClient, http, type Address } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(mainnet.rpcUrls.default.http[0]),
});

export function useGetEns(wallet?: string) {
  const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    if (wallet) getEnsUsername(wallet).then();
  }, [wallet]);

  const getEnsUsername = async (wallet: string) => {
    const ensName = await publicClient.getEnsName({ address: wallet as Address });
    if (ensName) setUsername(`@${ensName}`);
  };

  return { username };
}
