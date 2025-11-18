import React from 'react';

import { ExploreContent } from '$lib/components/features/explore/Explore';
import { Spacer } from '$lib/components/core';

import { PageTitle } from '../shared';

export default function ExplorePage() {
  return (
    <div className="max-w-[1256px] mx-auto overflow-visible">
      <Spacer className="h-6 md:h-11" />
      <PageTitle
        title="Explore"
        subtitle="Discover popular communities, events & coins."
      />
      <ExploreContent />
    </div>
  );
}
