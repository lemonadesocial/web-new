'use client';
import { createWalletClient, custom, type EIP1193Provider } from 'viem';

import { appKit } from '$lib/utils/appkit';

import { getUserWalletRequest } from "../services/auth/wallet";

export function useSignWallet() {
  const signWallet = async () => {
    const walletProvider = appKit.getProvider('eip155');
    const address = appKit.getAddress();

    if (!walletProvider || !address) {
      throw new Error('Could not find wallet provider');
    }

    const { message, token } = await getUserWalletRequest(address);
    const walletClient = createWalletClient({
      transport: custom(walletProvider as EIP1193Provider),
    });
    const signature = await walletClient.signMessage({
      account: { address: address as `0x${string}` },
      message,
    });

    return { signature, token };
  };

  return signWallet;
}
