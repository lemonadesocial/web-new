import React from 'react';
import { getSiteData } from '@/lib/fetchers';
import { Config } from '@/lib/types';
import { StyleVariables } from './styled';

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: React.ReactNode;
}) {
  let res = await params;
  const domain = decodeURIComponent(res.domain);
  const data = (await getSiteData(domain)) as Config;

  return (
    <>
      <StyleVariables theme={data.theme.styles} />
      {children}
    </>
  );
}
