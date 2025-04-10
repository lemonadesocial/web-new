import { SkeletonComp } from '$lib/components/core';
import { Event } from '$lib/generated/backend/graphql';
import React from 'react';

export function EventLocationBlock({ loading = false, event }: { loading?: boolean; event?: Event }) {
  if (loading) return <EventLocationBlockSekeleton />;
  if (!event?.address) return null;

  return (
    <div className="flex gap-4 flex-1 text-nowrap">
      <div className="border rounded-sm size-12 flex items-center justify-center">
        <i className="icon-location-outline" />
      </div>
      <div>
        <p>
          {event.address?.title} <i className="icon-arrow-outward text-quaternary size-[18px]" />
        </p>
        <p className="text-sm">
          {[event.address?.city || event.address?.region, event.address?.country].filter(Boolean).join(', ')}
        </p>
      </div>
    </div>
  );
}

function EventLocationBlockSekeleton() {
  return (
    <div className="flex gap-4 flex-1">
      <div className="border rounded-sm size-12 text-secondary flex flex-col justify-center items-center font-medium">
        <span className="py-0.5 text-xs"></span>
      </div>
      <div className="flex flex-col justify-between">
        <SkeletonComp animate className="w-40 h-6" />
        <SkeletonComp animate className="w-24 h-4" />
      </div>
    </div>
  );
}
