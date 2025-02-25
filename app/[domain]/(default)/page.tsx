import React from 'react';
import { notFound } from 'next/navigation';

import { getSiteData } from '$utils/fetchers';

import { Button } from '$core/button';
import { Spacer } from '$core/spacer';
import { Divider } from '$core/divider';

import EventList from '$ui/events/event-list';

import PageHeader from './page-header';
import { Card } from '$core/card';

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
            <span className="text-tertiary">6 pending notifications</span>
            <i className="icon-chevron-right text-tertiary/[.24] size-[18]" />
          </div>
        }
      />
      <Spacer className="h-6" />
      <Divider className="my-2" />

      <div className="pt-6">
        <EventList />
      </div>
    </>
  );
}
