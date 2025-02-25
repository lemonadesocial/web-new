import React from 'react';
import { Metadata } from 'next';

import { Sidebar } from '$ui/sidebar';

import { getSiteData } from '$utils/fetchers';
import { Config } from '$utils/types';

import { StyleVariables } from './styled';
import { Spacer } from '$core/spacer';

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
      <div className="flex h-dvh w-full">
        <Sidebar />
        <main className="w-full p-4 overflow-auto">
          <div className="container mx-auto">
            <Spacer className="h-14" />
            {props.children}
          </div>
        </main>
      </div>
    </>
  );
}
