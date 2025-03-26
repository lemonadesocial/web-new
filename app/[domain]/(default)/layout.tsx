import React from 'react';
import { Metadata } from 'next';

import { Spacer } from '$lib/components/core';
import { getSiteData } from '$lib/utils/fetchers';

import Sidebar from './sidebar';

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
  return (
    <>
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
