import React from 'react';
import './AboutSection.css';

import { Event } from '$lib/generated/backend/graphql';
import { Divider, SkeletonComp } from '$lib/components/core';

export function AboutSection({ event, loading }: { event: Event; loading?: boolean }) {
  if (loading) return <AboutSectionSkeleton />;
  if (!event?.description) return null;

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">About</p>
      <Divider className="h-1 w-full mb-2" />
      <div dangerouslySetInnerHTML={{ __html: event.description }} />
    </div>
  );
}

function AboutSectionSkeleton() {
  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <SkeletonComp animate className="h-4 w-24" />
      <Divider className="h-1 w-full mb-2" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <SkeletonComp animate className="h-4 w-full" />
          <SkeletonComp animate className="h-4 w-[448px]" />
          <SkeletonComp animate className="h-4 w-[240px]" />
        </div>
        <div className="flex flex-col gap-2.5">
          <SkeletonComp animate className="h-4 w-full" />
          <SkeletonComp animate className="h-4 w-[472px]" />
          <SkeletonComp animate className="h-4 w-full" />
          <SkeletonComp animate className="h-4 w-[448px]" />
          <SkeletonComp animate className="h-4 w-[120px]" />
        </div>
      </div>
    </div>
  );
}
