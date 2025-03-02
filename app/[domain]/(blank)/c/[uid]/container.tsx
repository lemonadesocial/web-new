'use client';
import React from 'react';

import { Button, Divider, Map, Segment } from '$lib/components/core';
import { HeroSection } from '$lib/components/features/community';
import {
  Event,
  GetSpaceEventsCalendarDocument,
  GetSpaceEventsDocument,
  GetSpaceTagsDocument,
  SortOrder,
  Space,
  SpaceTagBase,
  SpaceTagType,
} from '$lib/generated/graphql';
import { useQuery } from '$lib/request';
import { EventList } from '$lib/components/features/EventList';
import { Calendar } from '$lib/components/core/calendar';
import { endOfDay, startOfDay, format } from 'date-fns';

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

export default function Container({ space }: { space?: Space }) {
  const [mode, setMode] = React.useState<'list' | 'grid'>('list');
  const [eventListType, setEventListType] = React.useState('upcoming');
  const [selectedTag] = React.useState('all');
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const { data: dataGetSpaceTags } = useQuery(GetSpaceTagsDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
  });
  const eventTags =
    (dataGetSpaceTags?.listSpaceTags as SpaceTagBase[]).filter(
      (t) => t.type === SpaceTagType.Event && !!t.targets?.length,
    ) || [];

  const { data: dataGetSpaceEventsCalendar } = useQuery(GetSpaceEventsCalendarDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
  });
  const spaceEventsCalendar = dataGetSpaceEventsCalendar?.getEvents || [];
  const mappins = spaceEventsCalendar
    .filter((i) => i.address)
    .map((i) => ({ lat: i.address?.latitude as number, lng: i.address?.longitude as number }));

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

  const { data: dataSpaceEventsByDate } = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space?._id,
      limit: LIMIT,
      skip: 0,
      startFrom: startOfDay(selectedDate as Date),
      startTo: endOfDay(selectedDate as Date),
      spaceTags: selectedTag !== 'all' ? [selectedTag] : [],
    },
    skip: !space?._id || !selectedDate,
  });
  const events = (dataSpaceEventsByDate?.getEvents || []) as Event[];

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

          {eventTags.map((item) => (
            <div key={item._id}>{item.tag}</div>
          ))}

          {!selectedDate ? (
            <>
              {!!upcomingEvents.length && eventListType === 'upcoming' && (
                <EventsWithMode mode={mode} events={upcomingEvents} loading={loading} />
              )}

              {(!upcomingEvents.length || eventListType === 'past') && (
                <EventsWithMode mode={mode} events={pastEvents} loading={loading} />
              )}
            </>
          ) : (
            <EventsWithMode mode={mode} events={events} loading={loading} />
          )}
        </div>

        <div>
          <div className="hidden sticky top-0 z-50 flex-col gap-4 md:flex">
            <Button variant="tertiary" iconLeft="icon-plus" className="w-full">
              Submit Event
            </Button>
            <Calendar
              events={spaceEventsCalendar.map((item) => new Date(item.start))}
              onSelectDate={setSelectedDate}
              footer={() => {
                if (selectedDate) {
                  return (
                    <div className="flex justify-between items-center text-tertiary/[.56] mt-3">
                      <time className="font-medium">{format(selectedDate, 'E, dd MMM yyyy')}</time>
                      <Button
                        icon="icon-x"
                        size="sm"
                        aria-label="close"
                        className="bg-transparent hover:bg-tertiary/[.08] "
                        onClick={() => setSelectedDate(undefined)}
                      />
                    </div>
                  );
                }

                if (!upcomingEvents.length) return null;

                return (
                  <Segment
                    className="w-full mt-3"
                    onSelect={(item) => setEventListType(item.value)}
                    items={[
                      { label: 'Upcomping', value: 'upcoming' },
                      { label: 'Past', value: 'past' },
                    ]}
                  />
                );
              }}
            />
            <div className="aspect-square rounded-lg overflow-hidden">
              <Map markers={mappins} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EventsWithMode({ mode, events, loading }: { mode: 'list' | 'grid'; events: Event[]; loading?: boolean }) {
  return mode === 'list' ? <EventList events={events} loading={loading} /> : null;
}
