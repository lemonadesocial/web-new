import React from 'react';

import { Event } from '$lib/generated/backend/graphql';
import { Divider, Map, Skeleton } from '$lib/components/core';
import { getEventAddress, isAttending } from '$lib/utils/event';
import { useSession } from '$lib/hooks/useSession';

export function LocationSection({ event, loading = false }: { event?: Event; loading?: boolean }) {
  const session = useSession();

  if (loading) return <LocationSectionSkeleton />;
  if (!event?.address) return null;

  const attending = session?.user ? isAttending(event, session?.user) : false;

  const markers =
    attending && event.address.latitude && event.address.longitude
      ? [{ lat: event.address.latitude, lng: event.address.longitude }]
      : [];

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">Location</p>
      <Divider className="h-1 w-full mb-2" />
      <div className="flex flex-col gap-1">
        {attending ? (
          <>
            <p className="md:text-lg font-medium">{event.address?.title}</p>
            <p className="text-sm">{getEventAddress(event.address, true) || 'Virtual'}</p>
          </>
        ) : (
          <p className="md:text-lg font-medium">Please register to see the exact location of this event.</p>
        )}
      </div>
      <div className="aspect-video h-[240px] rounded-sm overflow-hidden">
        <Map colorscheme="LIGHT" markers={markers} defaultZoom={5} />
      </div>
    </div>
  );
}

function LocationSectionSkeleton() {
  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <Skeleton animate className="h-4 w-24" />
      <Divider className="h-1 w-full mb-2" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <Skeleton animate className="h-6 w-[160px]" />
          <Skeleton animate className="h-4 w-[400px]" />
        </div>

        <Skeleton className="h-60 w-full rounded-sm" />
      </div>
    </div>
  );
}
