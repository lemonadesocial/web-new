import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo
} from '@reown/appkit/react';
import { getDefaultStore } from 'jotai';

import { Chain } from '$lib/generated/backend/graphql';
import { listChainsAtom } from '$lib/jotai';
import { AppKitNetwork } from '@reown/appkit/networks';

const listChains = getDefaultStore().get(listChainsAtom);

export const getAppKitNetwork = (chain: Chain) => {
  return {
    id: Number(chain.chain_id),
    name: chain.name,
    caipNetworkId: chain.platform === 'ethereum' ? `eip155:${chain.chain_id}` : `solana:${chain.chain_id}`,
    chainNamespace: chain.platform === 'ethereum' ? 'eip155' : 'solana',
    nativeCurrency: {
      name: chain.tokens?.[0].name,
      symbol: chain.tokens?.[0].symbol,
      decimals: chain.tokens?.[0].decimals,
    },
    rpcUrls: {
      default: {
        http: [chain.rpc_url],
      },
    },
    blockExplorers: {
      default: {
        name: chain.name,
        url: chain.block_explorer_url,
      },
    },
  } as AppKitNetwork;
};

export const ethersAdapter = new EthersAdapter()

const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks: listChains.filter((chain) => chain.tokens?.length).map((chain) => getAppKitNetwork(chain)) as [AppKitNetwork, ...AppKitNetwork[]],
  metadata: {
    name: 'Lemonade',
    description: 'Discover events & communities, find your tribe! Create your own Lemonade Stand to build and collaborate with creators across the world. #makelemonade',
    url: window.location.origin,
    icons: [''],
  },
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string,
  themeVariables: {
    '--w3m-font-family': 'var(--font-general-sans)',
    '--w3m-accent': 'var(--color-accent-400)',
    '--w3m-z-index': 99999999
  },
  allowUnsupportedChain: true,
  coinbasePreference: 'smartWalletOnly',
});

export {
  appKit,
  useAppKit,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
  useAppKitNetwork,
  useDisconnect
}
