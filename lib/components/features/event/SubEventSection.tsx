import { Divider, drawer } from '$lib/components/core';
import { Event, GetEventsDocument } from '$lib/generated/backend/graphql';
import React from 'react';
import { EventListCard } from '../EventList';
import { useQuery } from '$lib/request';
import Link from 'next/link';
import { EventPane } from '../pane';

export function SubEventSection({ event }: { event?: Event }) {
  const { data } = useQuery(GetEventsDocument, {
    variables: { skip: 0, limit: 1, subeventParent: event?._id },
    skip: !event?._id,
  });
  const events = (data?.getEvents || []) as Event[];
  if (!event?.subevent_enabled || !events.length) return null;

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <div className="flex justify-between text-sm">
        <p className="font-medium">{events?.length} sessions</p>
        {/* <div className="flex gap-1">
          <Link href="#">Create Session</Link>
          <Link href="#" className="text-tertiary">
            View All
          </Link>
        </div> */}
      </div>
      <Divider className="h-1 w-full mb-2" />
      <EventListCard events={events} onSelect={(event) => drawer.open(EventPane, { props: { eventId: event._id } })} />
    </div>
  );
}
