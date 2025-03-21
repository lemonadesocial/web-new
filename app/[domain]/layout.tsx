import React from 'react';
import { Metadata } from 'next';

import { BottomSheetContainer, DrawerContainer, ModalContainer } from '$lib/components/core/dialog';

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
    title: data.title,
  };
}

export default async function SiteLayout(props: { params: Promise<{ domain: string }>; children: React.ReactNode }) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = (await getSiteData(domain)) as Config;

  return (
    <Providers>
      <StyleVariables theme={data.theme.styles} />
      {props.children}
      <ModalContainer />
      <DrawerContainer />
      <BottomSheetContainer />
    </Providers>
  );
}
