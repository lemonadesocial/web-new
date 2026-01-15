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
  const nativeToken = chain.tokens?.find(token => token.is_native) || chain.tokens?.[0];
  
  return {
    id: Number(chain.chain_id),
    name: chain.name,
    caipNetworkId: chain.platform === 'ethereum' ? `eip155:${chain.chain_id}` : `solana:${chain.chain_id}`,
    chainNamespace: chain.platform === 'ethereum' ? 'eip155' : 'solana',
    nativeCurrency: {
      name: nativeToken?.name,
      symbol: nativeToken?.symbol,
      decimals: nativeToken?.decimals,
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
  appKit = createAppKit({
    adapters: [new EthersAdapter()],
    networks: getListChains()
      .filter((chain) => chain.tokens?.length)
      .map((chain) => getAppKitNetwork(chain)) as [AppKitNetwork, ...AppKitNetwork[]],
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
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // Metamask
      '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1', // Rabby
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
