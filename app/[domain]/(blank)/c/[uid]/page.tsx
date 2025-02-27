import React from 'react';

import { Divider } from '$lib/components/core';
import { HeroSection, EventSection } from '$lib/components/features/community';

import { client } from '$lib/request/client';
import { isObjectId } from '$lib/utils/helpers';
import { Event, GetSpaceDocument, GetSpaceEventsDocument, Space } from '$lib/generated/graphql';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const { space, upcomingEvents, pastEvents } = await fetchData(uid);

  return (
    <>
      <HeroSection space={space} />
      <Divider className="my-8" />
      <EventSection upcomingEvents={upcomingEvents} spaceId={space?._id} pastEvents={pastEvents} />
    </>
  );
}

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

async function fetchData(uid: string) {
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const { data: dataGetSpace } = await client.query({ query: GetSpaceDocument, variables });
  const space = dataGetSpace.getSpace as Space;

  const { data: dataGetUpcomingEvent } = await client.query({
    query: GetSpaceEventsDocument,
    variables: { space: space._id, limit: LIMIT, skip: 0, endFrom: FROM_NOW },
  });
  const upcomingEvents = (dataGetUpcomingEvent.getEvents || []) as Event[];

  const { data: dataGetPastEvent } = await client.query({
    query: GetSpaceEventsDocument,
    variables: {
      space: space._id,
      limit: LIMIT,
      skip: 0,
      endTo: FROM_NOW,
      // sort: { start: SortOrder.Desc },
      // spaceTags: selectedTag !== 'all' ? [selectedTag] : [],
    },
  });
  const pastEvents = (dataGetPastEvent.getEvents || []) as Event[];

  return { space, upcomingEvents, pastEvents };
}
