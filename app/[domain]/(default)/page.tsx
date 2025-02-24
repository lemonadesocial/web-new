import React from 'react';
import { notFound } from 'next/navigation';
import { Divider } from '@heroui/divider';

import { getSiteData } from '$lib/fetchers';
import PageHeader from './page-header';
import EventList from '$ui/events/event-list';
import { Spacer } from '@heroui/spacer';
import { Button } from '$core/button';

export default async function SiteHomePage({ params }: { params: { domain: string } }) {
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
            <span className="text-white/100">6 pending notifications</span>
            <i className="icon-chevron-right text-white/[.24] size-[18]" />
          </div>
        }
      />
      <Spacer y={6} />
      <Divider className="my-2" />
      <Button>content</Button>

      <div className="pt-6">
        <EventList />
      </div>
    </>
  );
}
