import React from 'react';

import { Content } from './content';
import { Spacer } from '$lib/components/core';

import { PageTitle } from '../shared';

export default function ExplorePage() {
  return (
    <>
      <Spacer className="h-6 md:h-11" />
      <PageTitle
        title="Explore"
        subtitle="Explore popular events near you, browse by category, or check out some of the great community hubs."
      />
      <Content />
    </>
  );
}
