import React from 'react';
import { PageTitle } from '../shared';
import { Content } from './content';

export default function ExplorePage() {
  return (
    <>
      <PageTitle
        title="Explore"
        subtitle="Explore popular events near you, browse by category, or check out some of the great community hubs."
      />

      <Content />
    </>
  );
}
