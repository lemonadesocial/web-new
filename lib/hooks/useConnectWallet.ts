'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { getAppKitNetwork } from '$lib/utils/appkit';
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

export function useConnectWallet(targetChain?: Chain) {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { chainId, switchNetwork } = useAppKitNetwork();


  const isReady = useMemo(() => {
    if (!isConnected) return false;
    if (!targetChain) return true;
    return chainId?.toString() === targetChain.chain_id;
  }, [isConnected, chainId, targetChain]);

  useEffect(() => {
    if (
      isConnected &&
      targetChain &&
      chainId?.toString() !== targetChain.chain_id
    ) {
      switchNetwork(getAppKitNetwork(targetChain));
    }
  }, [isConnected, chainId, targetChain, switchNetwork]);

  const connect = useCallback(() => {
    if (!isConnected) {
      open({ view: 'Connect', namespace: 'eip155' });
      return;
    }
    if (targetChain && chainId?.toString() !== targetChain.chain_id) {
      switchNetwork(getAppKitNetwork(targetChain));
    }
  }, [isConnected, open, targetChain, chainId, switchNetwork]);

  return { isReady, connect };
}
