import React from 'react';
import { atom, getDefaultStore } from 'jotai';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { getListChains } from '$lib/utils/crypto';
import { EthereumStakeAccount } from '$lib/graphql/generated/backend/graphql';
import StakeVaultABI from '$lib/abis/StakeVault.json';

const StakeVaultContract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(StakeVaultABI.abi));

const stakeRefundRateCacheAtom = atom<Record<string, number>>({});

export async function getStakeRefundRate(stakeAccount: EthereumStakeAccount): Promise<number> {
  const store = getDefaultStore();
  const cache = store.get(stakeRefundRateCacheAtom);
  
  const cacheKey = `${stakeAccount.address.toLowerCase()}_${stakeAccount.network}`;
  
  if (cache[cacheKey] !== undefined) {
    return cache[cacheKey];
  }
  
  try {
    const chains = getListChains();
    const chain = chains.find(c => c.chain_id === stakeAccount.network);
    
    if (!chain || !chain.rpc_url) {
      throw new Error(`Chain data not found for network ${stakeAccount.network}`);
    }
    
    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    
    const contract = StakeVaultContract.attach(stakeAccount.config_id).connect(provider);
    
    const refundPPM = await contract.getFunction("refundPPM")();
    
    const refundRate = Number(refundPPM) / 10000;
    
    store.set(stakeRefundRateCacheAtom, {
      ...cache,
      [cacheKey]: refundRate
    });
    
    return refundRate;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export function useStakeRefundRate(stakeAccount?: EthereumStakeAccount) {
  const [refundRate, setRefundRate] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  React.useEffect(() => {
    if (!stakeAccount) return;
    
    setLoading(true);
    getStakeRefundRate(stakeAccount)
      .then(rate => setRefundRate(rate))
      .catch(err => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
      
  }, [stakeAccount?.address, stakeAccount?.network]);
  
  return { refundRate, loading, error };
}
