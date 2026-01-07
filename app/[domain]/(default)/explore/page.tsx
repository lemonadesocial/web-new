import React from 'react';

import { Content } from './content';
import { Spacer } from '$lib/components/core';

import { PageTitle } from '../shared';
import { notFound } from 'next/navigation';

export default function ExplorePage() {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'production') return notFound();

  return (
    <>
      <Spacer className="h-6 md:h-11" />
      <div className="md:px-8">
        <PageTitle
          title="Explore"
          subtitle="Explore popular events near you, browse by category, or check out some of the great community hubs."
        />
      </div>
      <Content />
    </>
  );
}
