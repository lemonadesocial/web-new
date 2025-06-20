import { useEffect, useState } from "react";

import { Eip1193Provider } from "ethers";
import { BrowserProvider, Provider, Signer } from "zksync-ethers";
import { getDefaultProvider, Network } from "@lens-chain/sdk/ethers";

import { useAppKitProvider } from "$lib/utils/appkit";

export function useSigner() {
  const { walletProvider } = useAppKitProvider('eip155');
  const [signer, setSigner] = useState<Signer | null>(null);

  useEffect(() => {
    if (!walletProvider) return;

    (async () => {
      const browserProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const network = await browserProvider.getNetwork();

      const signer = Signer.from(
        await browserProvider.getSigner(),
        Number(network.chainId),
        getDefaultProvider(process.env.NEXT_PUBLIC_APP_ENV === 'production' ? Network.Mainnet : Network.Testnet) as unknown as Provider
      );

      setSigner(signer);
    })();
  }, [walletProvider]);

  return signer;
}
