'use client';
import { useQuery } from '@tanstack/react-query';
import { createPublicClient, custom, formatEther, formatUnits, http, type EIP1193Provider } from 'viem';

import { useAppKitAccount, useAppKitProvider, useAppKitNetwork } from '$lib/utils/appkit';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { useAtomValue } from 'jotai';
import ERC20 from '$lib/abis/ERC20.json';
import { getViemChainConfig } from '$lib/utils/crypto';
import { useTokenData } from './useCoin';

async function fetchBalance(address: string, walletProvider: EIP1193Provider, chain: Chain) {
  if (!walletProvider || !address || !chain) {
    return { raw: BigInt(0), formatted: '0' };
  }

  const viemChain = getViemChainConfig(chain);
  const publicClient = createPublicClient({
    chain: viemChain,
    transport: custom(walletProvider),
  });
  const balance = await publicClient.getBalance({ address: address as `0x${string}` });

  return {
    raw: balance,
    formatted: formatEther(balance),
  };
}

export function useBalance() {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const { chainId } = useAppKitNetwork();
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainId ? chainsMap[chainId.toString()] : undefined;

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['balance', address, chainId],
    queryFn: () => fetchBalance(address!, walletProvider as EIP1193Provider, chain!),
    enabled: !!address && !!walletProvider && !!chain,
  });

  return {
    balance: data?.raw ?? BigInt(0),
    formattedBalance: data?.formatted ?? '0',
    loading,
    error,
  };
}

async function fetchTokenBalance({
  address,
  tokenAddress,
  chain,
  decimals,
}: {
  address: string;
  tokenAddress: string;
  chain: Chain;
  decimals: number;
}) {
  if (!chain.rpc_url) {
    return { raw: BigInt(0), formatted: '0' };
  }

  const viemChain = getViemChainConfig(chain);
  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(chain.rpc_url),
  });
  const raw = await publicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20 as never,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  return {
    raw: BigInt(raw.toString()),
    formatted: formatUnits(raw, decimals),
  };
}

export function useTokenBalance(chain: Chain | undefined, tokenAddress: string | undefined) {
  const { address } = useAppKitAccount();
  const { tokenData } = useTokenData(chain, tokenAddress);

  const decimals = tokenData?.decimals;

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['token-balance', chain?.chain_id, address, tokenAddress, decimals],
    queryFn: () =>
      fetchTokenBalance({
        address: address!,
        tokenAddress: tokenAddress!,
        chain: chain!,
        decimals: Number(decimals),
      }),
    enabled: !!chain && !!tokenAddress && !!decimals && !!address,
  });

  return {
    balance: data?.raw ?? BigInt(0),
    formattedBalance: data?.formatted ?? '0',
    loading,
    error,
  };
}
