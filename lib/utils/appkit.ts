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
  useWalletInfo,
  useAppKitProvider
} from '@reown/appkit/react';
import { AppKitNetwork } from '@reown/appkit/networks';

import { Chain } from '$lib/graphql/generated/backend/graphql';

import { getListChains } from './crypto';


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

let appKit: ReturnType<typeof createAppKit>;

export function initializeAppKit() {
  const networks = getListChains()
    .filter((chain) => chain.tokens?.length)
    .map((chain) => getAppKitNetwork(chain)) as [AppKitNetwork, ...AppKitNetwork[]];

  const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string;

  appKit = createAppKit({
    adapters: [
      new EthersAdapter(),
    ],
    networks,
    metadata: {
      name: 'Lemonade',
      description: 'Discover events & communities, find your tribe! Create your own Lemonade Stand to build and collaborate with creators across the world. #makelemonade',
      url: window.location.origin,
      icons: [''],
    },
    projectId,
    themeVariables: {
      '--w3m-font-family': 'var(--font-general-sans)',
      '--w3m-accent': 'var(--color-accent-400)',
      '--w3m-z-index': 99999999
    },
    allowUnsupportedChain: true,
    coinbasePreference: 'smartWalletOnly',
    featuredWalletIds: [
      '445ced0f482742632dfa6684f802eb1a2bb3cb97531bd06e02fb297c6ad21de1' // Family
    ],
    features: {
      email: false,
      socials: false
    }
  });
}

export {
  appKit,
  useAppKit,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
  useAppKitNetwork,
  useDisconnect,
  useAppKitProvider
}
