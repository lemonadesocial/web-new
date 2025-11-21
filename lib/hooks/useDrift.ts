import { createDrift, type Drift } from '@gud/drift';
import { ethersAdapter } from '@gud/drift-ethers';
import { useEffect, useState } from 'react';

import type { Chain } from '$lib/graphql/generated/backend/graphql';
import { BrowserProvider, Eip1193Provider, JsonRpcProvider } from 'ethers';
import { useAppKitProvider } from '$lib/utils/appkit';

export function useDrift(chain: Chain | null): Drift | null {
  const { walletProvider } = useAppKitProvider('eip155');

  const [drift, setDrift] = useState<Drift | null>(null);

  useEffect(() => {
    if (!walletProvider || !chain?.rpc_url) {
      setDrift(null);
      return;
    }

    (async () => {
      try {
        const signerProvider = new BrowserProvider(walletProvider as Eip1193Provider);
        const signer = await signerProvider.getSigner();
        const provider = new JsonRpcProvider(chain.rpc_url);

        const driftInstance = await createDrift({
          adapter: ethersAdapter({ provider, signer }),
        });

        setDrift(driftInstance);
      } catch (error) {
        console.error('Failed to initialize Drift:', error);
        setDrift(null);
      }
    })();
  }, [walletProvider, chain?.rpc_url]);

  return drift;
}
