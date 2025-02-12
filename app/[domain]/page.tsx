import React from 'react';
import { notFound } from 'next/navigation';
import { getSiteData } from '@/lib/fetchers';

export default async function SiteHomePage({ params }: { params: { domain: string } }) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);
  const [data] = await Promise.all([getSiteData(domain)]);

  if (!data) {
    notFound();
  }

  return (
    <div className="h-dvh" style={{ background: 'var(--background)' }}>
      {domain}

      <button className="btn btn-primary">asd</button>
    </div>
  );
}
