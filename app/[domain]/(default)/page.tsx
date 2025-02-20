import React from 'react';
import { notFound } from 'next/navigation';
import { getSiteData } from '$lib/fetchers';
import { Button } from '$core/button';
import Link from 'next/link';

export default async function SiteHomePage({ params }: { params: { domain: string } }) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);
  const [data] = await Promise.all([getSiteData(domain)]);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center h-dvh ">
      <h1>{domain}</h1>
    </div>
  );
}
