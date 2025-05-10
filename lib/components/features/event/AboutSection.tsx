import React from 'react';
import './AboutSection.css';

import { Event } from '$lib/graphql/generated/backend/graphql';
import { Divider, Skeleton } from '$lib/components/core';

export function AboutSection({ event, loading }: { event: Event; loading?: boolean }) {
  if (loading) return <AboutSectionSkeleton />;
  if (!event?.description) return null;

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="text-secondary text-sm">About</p>
      <Divider className="h-1 w-full mb-2" />
      <div dangerouslySetInnerHTML={{ __html: event.description }} />
    </div>
  );
}

function AboutSectionSkeleton() {
  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <Skeleton animate className="h-4 w-24" />
      <Divider className="h-1 w-full mb-2" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <Skeleton animate className="h-4 w-full" />
          <Skeleton animate className="h-4 w-2/3" />
          <Skeleton animate className="h-4 w-1/2" />
        </div>
        <div className="flex flex-col gap-2.5">
          <Skeleton animate className="h-4 w-full" />
          <Skeleton animate className="h-4 w-2/3" />
          <Skeleton animate className="h-4 w-full" />
          <Skeleton animate className="h-4 w-2/3" />
          <Skeleton animate className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
