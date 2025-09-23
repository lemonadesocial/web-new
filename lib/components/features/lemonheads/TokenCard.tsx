'use client';
import React from 'react';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { LEMONHEAD_CHAIN_ID } from '$lib/components/features/lemonheads/mint/utils';
import { LemonheadNFTContract } from '$lib/utils/crypto';
import { Skeleton } from '$lib/components/core';

interface TokenCardProps {
  tokenId: string;
}

interface TokenData {
  image: string;
}

async function fetchTokenData(tokenId: string, chainsMap: Record<string, Chain>): Promise<TokenData | null> {
  try {
    const chain = chainsMap[LEMONHEAD_CHAIN_ID];
    const contractAddress = chain?.lemonhead_contract_address;

    if (!contractAddress) {
      return null;
    }

    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = LemonheadNFTContract.attach(contractAddress).connect(provider) as ethers.Contract;

    const tokenUri = await contract.getFunction('tokenURI')(tokenId);
    const res = await fetch(tokenUri);
    const jsonData = await res.json();

    if (!jsonData.image) {
      return null;
    }

    return { image: jsonData.image };
  } catch (error) {
    return null;
  }
}

export function TokenCard({ tokenId }: TokenCardProps) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const [data, setData] = React.useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!tokenId || !chainsMap[LEMONHEAD_CHAIN_ID]) {
      setIsLoading(false);
      return;
    }

    const loadTokenData = async () => {
      setIsLoading(true);
      const result = await fetchTokenData(tokenId, chainsMap);
      setData(result);
      setIsLoading(false);
    };

    loadTokenData();
  }, [tokenId, chainsMap]);

  if (isLoading) {
    return <Skeleton className="min-w-60 h-60 rounded-none animate-skeleton" />;
  }

  if (!data?.image) {
    return null;
  }

  return (
    <img
      src={data.image}
      alt={`Lemonhead #${tokenId}`}
      className="min-w-60 h-60 object-cover"
      loading="lazy"
    />
  );
}
