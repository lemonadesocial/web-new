import React from 'react';

import { Divider, SkeletonComp } from '$lib/components/core';
import { Event } from '$lib/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';

export function GalarySection({ event, loading }: { event: Event; loading?: boolean }) {
  if (loading) return <GalarySectionSkeleton />;
  if (!event?.new_new_photos_expanded?.length) return null;

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">
        {event.new_new_photos_expanded?.length} Photo{event.new_new_photos_expanded?.length > 1 ? 's' : ''}
      </p>
      <Divider className="h-1 w-full mb-2" />
      <div className="grid grid-cols-3 gap-3">
        {event.new_new_photos_expanded.map((photo, idx) => (
          <img key={idx} src={generateUrl(photo)} className="rounded-xl aspect-square object-contain border" />
        ))}
      </div>
    </div>
  );
}

function GalarySectionSkeleton() {
  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <SkeletonComp animate className="h-4 w-24" />
      <Divider className="h-1 w-full mb-2" />
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 5 }).map((_, num) => (
          <SkeletonComp key={num} className="h-[157] aspect-square" />
        ))}
      </div>
    </div>
  );
}
