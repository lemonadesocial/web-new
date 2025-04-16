import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BottomSheetContainer, DrawerContainer, modal, ModalContainer } from '$lib/components/core/dialog';
import { ToastContainer } from '$lib/components/core/toast';
import { getSpace } from '$lib/utils/space';
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
  const [data, space] = await Promise.all([
    getSiteData(domain) as Promise<Config>,
    getSpace(domain)
  ]);

  if (!space) return notFound();

  return (
    <Providers space={space}>
      <StyleVariables theme={data.theme.styles} />
      {props.children}
      <ModalContainer modal={modal} />
      <DrawerContainer />
      <BottomSheetContainer />
      <ToastContainer />
    </Providers>
  );
}
