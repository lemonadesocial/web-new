import React from 'react';
import { Metadata } from 'next';

import { Sidebar } from '$ui/sidebar';

import { getSiteData } from '$lib/fetchers';
import { Config } from '$lib/types';

import { StyleVariables } from './styled';

export async function generateMetadata(props: { params: { domain: string } }): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) return null;

  return {
    title: data.title,
  };
}

export default async function SiteLayout(props: {
  params: { domain: string };
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = (await getSiteData(domain)) as Config;

  return (
    <>
      <StyleVariables theme={data.theme.styles} />
      {props.auth}
      <div className="flex h-dvh w-full items-center">
        <Sidebar />
        <main className="flex-1">{props.children}</main>
      </div>
    </>
  );
}
