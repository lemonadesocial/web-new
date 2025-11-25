import { useQuery } from '@tanstack/react-query';
import { BrowserProvider, type Eip1193Provider, formatEther } from 'ethers';

import { useAppKitAccount, useAppKitProvider } from '$lib/utils/appkit';

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
    refetchInterval: 10000,
  });

  return {
    balance: data?.raw ?? BigInt(0),
    formattedBalance: data?.formatted ?? '0',
    loading,
    error,
  };
}
