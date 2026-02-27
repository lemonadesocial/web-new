'use client';
import { useEffect, useState } from "react";
import { createWalletClient, custom, type Address, type EIP1193Provider, type WalletClient } from "viem";
import { chains } from "@lens-chain/sdk/viem";

import { useAppKitAccount, useAppKitProvider } from "$lib/utils/appkit";

export function useSigner() {
  const { walletProvider } = useAppKitProvider('eip155');
  const { address } = useAppKitAccount();
  const [signer, setSigner] = useState<WalletClient | null>(null);

  useEffect(() => {
    if (!walletProvider || !address) {
      setSigner(null);
      return;
    }

    try {
      const chain = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? chains.mainnet : chains.testnet;
      const walletClient = createWalletClient({
        account: address as Address,
        chain,
        transport: custom(walletProvider as EIP1193Provider),
      });

      setSigner(walletClient);
    } catch {
      setSigner(null);
    }
  }, [walletProvider, address]);

  return signer;
}
