import type { Metadata } from 'next';
import Script from 'next/script';
import clsx from 'clsx';

import { GOOGLE_MAP_KEY } from '$lib/utils/constants';
import { Web3Provider } from '$lib/utils/wagmi';
import NexusProvider from '$lib/components/features/avail/NexusProvider';

import StyledJsxRegistry from './registry';
import './globals.css';
import fonts from './fonts';

export const metadata: Metadata = {
  metadataBase: null,
  title: 'Lemonade',
  description:
    'Discover events & communities, find your tribe! Create your own Lemonade Stand to build and collaborate with creators across the world. #makelemonade',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={clsx('transition antialiased', fonts)}>
        <Web3Provider>
          <NexusProvider>
            <StyledJsxRegistry>{children}</StyledJsxRegistry>
            <Script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places`}></Script>
          </NexusProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
