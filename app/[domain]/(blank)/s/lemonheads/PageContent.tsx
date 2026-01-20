'use client';

import React from 'react';
import { Divider } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { FeatureHubSection, HeroSection, CommunityInfoSection, NewFeedSection, JourneySection } from './shared';
import { LemonheadsGallery } from '$lib/components/features/lemonheads/LemonheadsGallery';
import { ErrorBoundary } from './ErrorBoundary';

type PageContentProps = {
  space: Space;
};

export function PageContent({ space }: PageContentProps) {
  return (
    <ErrorBoundary componentName="Lemonheads Page">
      <div className="flex flex-col gap-6 pb-20">
        <div>
          <HeroSection space={space} />
          <CommunityInfoSection space={space} />
        </div>
        <JourneySection />
        <LemonheadsGallery />
        <FeatureHubSection spaceId={space._id} />
        <Divider className="h-2" />
        <NewFeedSection space={space} />
      </div>
    </ErrorBoundary>
  );
}
