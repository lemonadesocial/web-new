import React from 'react';

import { Event } from '$lib/generated/backend/graphql';
import { Divider, Map } from '$lib/components/core';

export function LocationSection({ event }: { event: Event }) {
  if (!event.address) return null;

  const markers =
    event.address.latitude && event.address.longitude
      ? [{ lat: event.address.latitude, lng: event.address.longitude }]
      : [];

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">Location</p>
      <Divider className="h-1 w-full mb-2" />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium">{event.address?.title}</p>
        {event.address.street_1 && <p>{event.address.street_1}</p>}
      </div>
      <div className="aspect-video h-[240px] rounded-lg overflow-hidden">
        <Map colorscheme="LIGHT" markers={markers} defaultZoom={5} />
      </div>
    </div>
  );
}
