import React from 'react';

import { Event } from '$lib/generated/backend/graphql';
import { Divider, Map, SkeletonComp } from '$lib/components/core';
import { getEventAddress } from '$lib/utils/event';

export function LocationSection({ event, loading = false }: { event?: Event; loading?: boolean }) {
  if (loading) return <LocationSectionSkeleton />;
  if (!event?.address) return null;

  const markers =
    event.address.latitude && event.address.longitude
      ? [{ lat: event.address.latitude, lng: event.address.longitude }]
      : [];

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">Location</p>
      <Divider className="h-1 w-full mb-2" />
      <div className="flex flex-col gap-1">
        <p className="md:text-lg font-medium">{event.address?.title}</p>
        <p className="text-sm">{getEventAddress(event.address, true) || 'Virtual'}</p>
      </div>
      <div className="aspect-video h-[240px] rounded-lg overflow-hidden">
        <Map colorscheme="LIGHT" markers={markers} defaultZoom={5} />
      </div>
    </div>
  );
}

function LocationSectionSkeleton() {
  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <SkeletonComp animate className="h-4 w-24" />
      <Divider className="h-1 w-full mb-2" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <SkeletonComp animate className="h-6 w-[160px]" />
          <SkeletonComp animate className="h-4 w-[400px]" />
        </div>

        <SkeletonComp className="h-60 w-full rounded-xl" />
      </div>
    </div>
  );
}
