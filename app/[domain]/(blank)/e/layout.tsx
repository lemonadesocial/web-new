import React from 'react';
import { Metadata } from 'next';

import { getSiteData } from '$lib/utils/fetchers';
import Header, { RootMenu } from '$lib/components/layouts/header';

export async function generateMetadata(props: { params: Promise<{ domain: string }> }): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) return null;

  return {
    title: data.title,
  };
}

export default async function EventLayout(props: { params: Promise<{ domain: string }>; children: React.ReactNode }) {
  return <>{props.children}</>;
}
