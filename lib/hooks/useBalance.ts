'use client';
import { useQuery } from '@tanstack/react-query';
import { BrowserProvider, Contract, JsonRpcProvider, type Eip1193Provider, formatEther, formatUnits } from 'ethers';

import { useAppKitAccount, useAppKitProvider } from '$lib/utils/appkit';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import ERC20 from '$lib/abis/ERC20.json';
import { useTokenData } from './useCoin';

async function fetchBalance(address: string, walletProvider: Eip1193Provider) {
  if (!walletProvider || !address) {
    return { raw: BigInt(0), formatted: '0' };
  }

  const provider = new BrowserProvider(walletProvider);
  const balance = await provider.getBalance(address);

  return {
    raw: balance,
    formatted: formatEther(balance),
  };
}

export function useBalance() {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['balance', address],
    queryFn: () => fetchBalance(address!, walletProvider as Eip1193Provider) ,
    enabled: !!address && !!walletProvider,
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

  const provider = new JsonRpcProvider(chain.rpc_url);
  const contract = new Contract(tokenAddress, ERC20, provider);
  const raw = await contract.balanceOf(address);

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
