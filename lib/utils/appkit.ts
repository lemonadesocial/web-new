import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
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
import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";

import { Chain } from '$lib/graphql/generated/backend/graphql';

import { getListChains } from './crypto';

import { mainnet } from "wagmi/chains";
import { createThirdwebClient, defineChain } from "thirdweb";

const thirdwebClientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "4e8c81182c3709ee441e30d776223354";

const client = createThirdwebClient({
  clientId: thirdwebClientId,
});

const chain = defineChain(mainnet.id);


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
let wagmiAdapter: WagmiAdapter | undefined;

const unicornFactoryAddress =
  process.env.NEXT_PUBLIC_UNICORN_FACTORY_ADDRESS || "0xD771615c873ba5a2149D5312448cE01D677Ee48A";

// 2️⃣ Define the Unicorn (Thirdweb In-App Smart Account) connector
const unicornConnector = inAppWalletConnector({
  client,
  smartAccount: {
    sponsorGas: true, // or false based on your needs / Unicorn requirements
    chain,
    factoryAddress: unicornFactoryAddress,
  },
  metadata: {
    name: "Unicorn.eth",
  },
});

export function initializeAppKit() {
  const networks = getListChains()
    .filter((chain) => chain.tokens?.length)
    .map((chain) => getAppKitNetwork(chain)) as [AppKitNetwork, ...AppKitNetwork[]];

  const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string;

  // Create the wagmi adapter with unicornConnector
  wagmiAdapter = new WagmiAdapter({
    networks: networks as any,
    projectId,
    connectors: [unicornConnector]
  });

  appKit = createAppKit({
    adapters: [
      wagmiAdapter as any,
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

  return { wagmiAdapter };
}

export function getWagmiConfig() {
  return wagmiAdapter?.wagmiConfig;
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
