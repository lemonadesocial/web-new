'use client';
import { useQuery } from '@tanstack/react-query';
import { createDrift } from '@gud/drift';
import { mainnet } from 'viem/chains';

import { usernameClient } from '$lib/graphql/request/instances';
import { TokenOwnerDocument } from '$lib/graphql/generated/username/graphql';
import { getFetchableUrl } from '$lib/utils/metadata';
import { useAppKitAccount } from '$lib/utils/appkit';

const FLUFFLE_CONTRACT_ADDRESS = '0x4E502Ab1Bb313B3C1311eb0D11B31a6B62988b86';

const ERC721_TOKEN_URI_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

async function fetchFluffleTokenUri(address: string) {
  const { data } = await usernameClient.query({
    query: TokenOwnerDocument,
    variables: {
      where: {
        owner: {
          _eq: address.toLowerCase(),
        },
        tokenAddress: {
          _eq: FLUFFLE_CONTRACT_ADDRESS.toLowerCase(),
        },
        chainId: {
          _eq: mainnet.id.toString(),
        },
      },
    },
    fetchPolicy: 'network-only',
  });

  if (data?.TokenOwner && data.TokenOwner.length > 0) {
    const firstToken = data.TokenOwner[0];
    const tokenId = firstToken.tokenId.toString();

    const drift = createDrift({
      rpcUrl: mainnet.rpcUrls.default.http[0],
    });

    const tokenUri = await drift.read({
      abi: ERC721_TOKEN_URI_ABI,
      address: FLUFFLE_CONTRACT_ADDRESS as `0x${string}`,
      fn: 'tokenURI',
      args: {
        tokenId: BigInt(tokenId),
      },
    });

    const fetchableUrl = getFetchableUrl(tokenUri as string);
    const response = await fetch(fetchableUrl.href);
    const metadata = await response.json();
    const name = metadata.name as string;
    const image = metadata.image as string;

    return {
      name,
      image,
      tokenId,
    };
  }

  return null;
}

export function useFluffle() {
  const { address } = useAppKitAccount();

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['fluffle', address],
    queryFn: () => fetchFluffleTokenUri('0x242c7f2279a3187279fd61605004a4b477b63a78'),
    enabled: !!address,
  });

  return { 
    data: data ? { name: data.name, image: data.image, tokenId: data.tokenId } : null,
    loading, 
    error 
  };
}

