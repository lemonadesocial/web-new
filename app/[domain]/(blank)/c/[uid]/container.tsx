'use client';
import React from 'react';

import { Button, Divider, Segment } from '$lib/components/core';
import { HeroSection } from '$lib/components/features/community';
import { Event, GetSpaceEventsDocument, SortOrder, Space } from '$lib/generated/graphql';
import { useQuery } from '$lib/request';
import { EventList } from '$lib/components/features/EventList';
import { Calendar } from '$lib/components/core/calendar';

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

export default function Container({ space }: { space?: Space }) {
  const [mode, setMode] = React.useState<'list' | 'grid'>('list');
  const [eventListType, setEventListType] = React.useState('upcoming');
  const [selectedTag] = React.useState('all');

  const { data: dataGetUpcomingEvent } = useQuery(GetSpaceEventsDocument, {
    variables: { space: space?._id, limit: LIMIT, skip: 0, endFrom: FROM_NOW },
    skip: !space?._id,
  });
  const upcomingEvents = (dataGetUpcomingEvent?.getEvents || []) as Event[];

  const { data: dataGetPastEvent, loading } = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space?._id,
      limit: LIMIT,
      skip: 0,
      endTo: FROM_NOW,
      sort: { start: SortOrder.Desc },
      spaceTags: selectedTag !== 'all' ? [selectedTag] : [],
    },
    skip: !space?._id,
  });
  const pastEvents = (dataGetPastEvent?.getEvents || []) as Event[];

  return (
    <>
      <HeroSection space={space} />
      <Divider className="my-8" />
      <div className="flex gap-18">
        <div className="flex-1">
          <div className="flex">
            <h1 className="text-2xl font-semibold flex-1">Events</h1>
            <div>
              <Segment
                selected="list"
                onSelect={(item) => setMode(item.value as 'list' | 'grid')}
                items={[
                  { value: 'list', icon: 'icon-list-bulleted' },
                  { value: 'grid', icon: 'icon-view-agenda-outline' },
                ]}
              />
            </div>
          </div>

          {!!upcomingEvents.length && eventListType === 'upcoming' && (
            <EventsWithMode mode={mode} events={upcomingEvents} loading={loading} />
          )}

          {(!upcomingEvents.length || eventListType === 'past') && (
            <EventsWithMode mode={mode} events={pastEvents} loading={loading} />
          )}
        </div>

        <div className="hidden flex-col gap-4 md:flex">
          <Button variant="tertiary" iconLeft="icon-plus" className="w-full">
            Submit Event
          </Button>
          <Calendar
            footer={
              <Segment
                className="w-full mt-3"
                onSelect={(item) => setEventListType(item.value)}
                items={[
                  { label: 'Upcomping', value: 'upcoming' },
                  { label: 'Past', value: 'past' },
                ]}
              />
            }
          />
        </div>
      </div>
    </>
  );
}

function EventsWithMode({ mode, events, loading }: { mode: 'list' | 'grid'; events: Event[]; loading?: boolean }) {
  return mode === 'list' ? <EventList events={events} loading={loading} /> : null;
}
