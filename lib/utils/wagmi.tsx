'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { inAppWalletConnector } from '@thirdweb-dev/wagmi-adapter';
import { ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient, defineChain } from 'thirdweb';
import { mainnet } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { createContext, useContext, useEffect, useState } from 'react';
import { metaMask, baseAccount } from 'wagmi/connectors';

const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '';

const client = createThirdwebClient({
  clientId: thirdwebClientId,
});

const chain = defineChain(mainnet.id);

const defaultConfig = getDefaultConfig({
  // Required API Keys
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  // Required App Info
  appName: 'lemonade.social',
});

const unicornFactoryAddress =
  process.env.NEXT_PUBLIC_UNICORN_FACTORY_ADDRESS || '0xD771615c873ba5a2149D5312448cE01D677Ee48A';

// Create the Unicorn Wallet Connector (using Thirdweb In-App Wallet)
// Note: The chain specified here is for the smart account functionality as per Unicorn docs.
const unicornConnector = inAppWalletConnector({
  client,
  smartAccount: {
    sponsorGas: true, // or false based on your needs / Unicorn requirements
    chain,
    factoryAddress: unicornFactoryAddress,
  },
  metadata: {
    name: 'Unicorn.eth',
  },
});

defaultConfig.connectors = [unicornConnector, metaMask(), baseAccount(), ...(defaultConfig.connectors || [])];

export const config = createConfig(defaultConfig);

const authCookieStorageKey = 'UNICORN_AUTH_COOKIE';

const queryClient = new QueryClient();

const context = createContext<{ authCookie: string }>({ authCookie: '' });
const UnicornAuthCookieProvider = context.Provider;

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [authCookie, setAuthCookie] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const value = new URLSearchParams(window.location.search).get('authCookie');
      if (value) {
        localStorage.setItem(authCookieStorageKey, value);
        setAuthCookie(value);
      } else {
        //-- try read from local storage
        const cookie = localStorage.getItem(authCookieStorageKey);
        if (cookie) {
          setAuthCookie(cookie);
        }
      }
    }
  }, []);

  return (
    <UnicornAuthCookieProvider value={{ authCookie: authCookie || '' }}>
      <WagmiProvider config={config}>
        <ThirdwebProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ThirdwebProvider>
      </WagmiProvider>
    </UnicornAuthCookieProvider>
  );
};

/**
 * Hook to access the auth cookie value from UnicornAuthCookieProvider
 * @returns The auth cookie string value
 */
export const useAuthCookie = (): string => {
  const authContext = useContext(context);

  if (authContext === undefined) {
    throw new Error('useAuthCookie must be used within a UnicornAuthCookieProvider');
  }

  return authContext.authCookie;
};
