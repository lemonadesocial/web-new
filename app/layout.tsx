import type { Metadata } from 'next';
import Script from 'next/script';
import clsx from 'clsx';

import { GOOGLE_MAP_KEY } from '$lib/utils/constants';
import { Web3Provider } from '$lib/utils/wagmi';

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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-primary">
          Skip to content
        </a>
        <Web3Provider>
          <StyledJsxRegistry>{children}</StyledJsxRegistry>
          <Script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places`}></Script>
        </Web3Provider>
      </body>
    </html>
  );
}
