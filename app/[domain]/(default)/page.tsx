import React from 'react';
import { notFound } from 'next/navigation';

import { Spacer } from '$lib/components/core';
import { getSiteData } from '$utils/fetchers';
import { LensAccountCard } from '$lib/components/features/lens-account/LensAccountCard';
import { LensFeed } from '$lib/components/features/lens-feed/LensFeed';

import { HomeTitle } from './title';

export default async function SiteHomePage({ params }: { params: Promise<{ domain: string }> }) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);
  const [data] = await Promise.all([getSiteData(domain)]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <Spacer className="h-11" />

      <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_336px] gap-5 md:gap-[72px] items-start pb-10">
        <div className="flex flex-col gap-5">
          <HomeTitle />
          <LensFeed />
        </div>
        <LensAccountCard />
      </div>
    </>
  );
}
