import { useAppKitProvider } from "$lib/utils/appkit";
import { Eip1193Provider, ethers } from "ethers";
import { useEffect, useState } from "react";

export function useSigner() {
  const { walletProvider } = useAppKitProvider('eip155');
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    if (!walletProvider) return;

    (async () => {
      const browserProvider = new ethers.BrowserProvider(walletProvider as Eip1193Provider);
      const signer = await browserProvider.getSigner();
      setSigner(signer);
    })();
  }, [walletProvider]);

  return signer;
}
