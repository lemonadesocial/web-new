import React from 'react';
import { notFound } from 'next/navigation';

import { Button, Divider, Spacer } from '$lib/components/core';
import { getSiteData } from '$utils/fetchers';

import PageHeader from './page-header';
import Link from 'next/link';

export default async function SiteHomePage({ params }: { params: Promise<{ domain: string }> }) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);
  const [data] = await Promise.all([getSiteData(domain)]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Welcome, John"
        subtitle={
          <div className="flex items-center gap-1">
            <span>You have</span>
            <span className="text-tertiary">6 pending notifications</span>
            <i className="icon-chevron-right text-quaternary size-[18]" />
          </div>
        }
      />
      <Spacer className="h-6" />
      <Divider className="my-2" />

      <div className="pt-6">
        <Button>primary</Button>
      </div>
      <Link href={'/c/new-space'}>asdasd</Link>
    </>
  );
}
