import React from 'react';
import { Metadata } from 'next';

import { BottomSheetContainer, DrawerContainer, ModalProvider } from '$lib/components/core/dialog';
import { ToastContainer } from '$lib/components/core/toast';
import { getSpaceHydraKeys } from '$lib/utils/space';
import TRPCProvider from '$lib/trpc/provider';
import { Web3Provider } from '$lib/components/features/unicorn/providers';

import { getSiteData } from '$utils/fetchers';
import { Config } from '$utils/types';

import { StyleVariables } from './styled';
import Providers from './providers';

export async function generateMetadata(props: { params: Promise<{ domain: string }> }): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) return null;

  return {
    metadataBase: null,
    title: data.title,
  };
}

export default async function SiteLayout(props: { params: Promise<{ domain: string }>; children: React.ReactNode }) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const [data, space] = await Promise.all([getSiteData(domain) as Promise<Config>, getSpaceHydraKeys(domain)]);

  return (
    <Providers space={space}>
      <Web3Provider>
        <TRPCProvider>
          <ModalProvider>
            <StyleVariables theme={data.theme.styles} />
            {props.children}
            <DrawerContainer />
            <BottomSheetContainer />
            <ToastContainer />
          </ModalProvider>
        </TRPCProvider>
      </Web3Provider>
    </Providers>
  );
}
