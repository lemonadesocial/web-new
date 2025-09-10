'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { endOfDay, startOfDay, format } from 'date-fns';

import { Button, drawer, Menu, MenuItem, modal, Segment } from '$lib/components/core';
import {
  Event,
  GetSpaceDocument,
  GetSpaceEventsCalendarDocument,
  GetSpaceEventsDocument,
  GetSpaceQuery,
  GetSpaceTagsDocument,
  GetSpaceTagsQuery,
  PublicSpace,
  SortOrder,
  Space,
  SpaceTag,
  SpaceTagType,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { EventList, EventListCard } from '$lib/components/features/EventList';
import { Calendar } from '$lib/components/core/calendar';
import { scrollAtBottomAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';

import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';
import { ListingEvent } from '$lib/components/features/community/ListingEvent';
import { ListingExternalEvent } from '$lib/components/features/community/ListingExternalEvent';
import { EventPane } from '$lib/components/features/pane';

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

type Props = {
  initData: {
    space?: Space;
    subSpaces?: PublicSpace[];
    spaceTags?: SpaceTag[];
  };
};

export function Content({ initData }: Props) {
  const space = initData.space;

  const router = useRouter();
  const me = useMe();
  const [shouldLoadMore, setShouldLoadMore] = useAtom(scrollAtBottomAtom);

  const [eventListType, setEventListType] = React.useState('upcoming');
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const { data: dataGetSpaceTags } = useQuery(GetSpaceTagsDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
    fetchPolicy: 'cache-and-network',
    initData: { listSpaceTags: initData.spaceTags } as unknown as GetSpaceTagsQuery,
  });

  const spaceTags = (dataGetSpaceTags?.listSpaceTags || []) as SpaceTag[];
  const eventTags = spaceTags.filter((t) => t.type === SpaceTagType.Event && !!t.targets?.length);

  const { data: dataGetSpaceEventsCalendar } = useQuery(GetSpaceEventsCalendarDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
  });

  const spaceEventsCalendar = dataGetSpaceEventsCalendar?.getEvents || [];

  const resUpcomingEvents = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space?._id,
      limit: LIMIT,
      skip: 0,
      endFrom: FROM_NOW,
      spaceTags: [],
    },
    skip: !space?._id,
  });
  const upcomingEvents = (resUpcomingEvents.data?.getEvents || []) as Event[];

  const resPastEvents = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space?._id,
      limit: LIMIT,
      skip: 0,
      endTo: FROM_NOW,
      sort: { start: SortOrder.Desc },
      spaceTags: [],
    },
    skip: !space?._id,
  });
  const pastEvents = (resPastEvents.data?.getEvents || []) as Event[];

  const resEventsByDate = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space?._id,
      limit: LIMIT,
      skip: 0,
      startFrom: startOfDay(selectedDate as Date),
      startTo: endOfDay(selectedDate as Date),
      spaceTags: [],
    },
    skip: !space?._id || !selectedDate,
  });
  const events = (resEventsByDate.data?.getEvents || []) as Event[];

  const canManage = [space?.creator, ...(space?.admins?.map((p) => p._id) || [])].filter((p) => p).includes(me?._id);

  const handleScroll = () => {
    if (selectedDate) {
      resEventsByDate.fetchMore({
        variables: { skip: events.length },
        updateQuery: (existing, res) => {
          if (res?.getEvents?.length) {
            return { __typename: 'Query', getEvents: [...(existing?.getEvents || []), ...res?.getEvents] };
          }
          setShouldLoadMore(false);
          return existing;
        },
      });
    } else {
      if (eventListType === 'upcoming') {
        resUpcomingEvents.fetchMore({
          variables: { skip: upcomingEvents.length },
          updateQuery: (existing, res) => {
            if (res?.getEvents?.length) {
              return { __typename: 'Query', getEvents: [...(existing?.getEvents || []), ...res?.getEvents] };
            }
            setShouldLoadMore(false);
            return existing;
          },
        });
      } else {
        resPastEvents.fetchMore({
          variables: { skip: pastEvents.length },
          updateQuery: (existing, res) => {
            if (res?.getEvents?.length) {
              return { __typename: 'Query', getEvents: [...(existing?.getEvents || []), ...res?.getEvents] };
            }
            setShouldLoadMore(false);
            return existing;
          },
        });
      }
    }
  };

  React.useEffect(() => {
    if (shouldLoadMore) {
      handleScroll();
    }
  }, [shouldLoadMore]);

  return (
    <>
      <div className="relative">
        <div className="flex md:gap-18">
          <div className="flex flex-col flex-1 gap-6 w-full">
            <Menu.Root className="md:hidden">
              <Menu.Trigger>
                <Button variant="tertiary-alt" iconLeft="icon-plus" size="sm" className="w-full backdrop-blur-md">
                  Submit
                </Button>
              </Menu.Trigger>
              <Menu.Content className="p-1">
                {({ toggle }) => (
                  <>
                    <MenuItem
                      title="Create New Event"
                      iconLeft="icon-edit-square"
                      onClick={() => {
                        toggle();
                        router.push(`/create/event?space=${space?._id}`);
                      }}
                    />
                    <MenuItem
                      title="Submit Existing Event"
                      iconLeft="icon-celebration-outline"
                      onClick={() => {
                        toggle();
                        if (space?._id) modal.open(ListingEvent, { dismissible: false, props: { spaceId: space._id } });
                      }}
                    />
                    <MenuItem
                      title="Submit External Event"
                      iconLeft="icon-globe"
                      onClick={() => {
                        toggle();
                        if (space?._id)
                          modal.open(ListingExternalEvent, { dismissible: false, props: { spaceId: space._id } });
                      }}
                    />
                  </>
                )}
              </Menu.Content>
            </Menu.Root>

            {!selectedDate ? (
              <>
                {!!upcomingEvents.length && eventListType === 'upcoming' && (
                  <EventsWithMode
                    mode="card"
                    events={upcomingEvents}
                    loading={resUpcomingEvents.loading}
                    tags={eventTags}
                  />
                )}

                {(!upcomingEvents.length || eventListType === 'past') && (
                  <EventsWithMode mode="card" events={pastEvents} loading={resPastEvents.loading} tags={eventTags} />
                )}
              </>
            ) : (
              <EventsWithMode mode="card" events={events} loading={resEventsByDate.loading} tags={eventTags} />
            )}
          </div>

          <div>
            <div className="hidden sticky top-7 z-50 flex-col gap-4 md:flex max-w-[296px]">
              <Menu.Root>
                <Menu.Trigger>
                  <Button variant="tertiary-alt" iconLeft="icon-plus" size="sm" className="w-full backdrop-blur-md">
                    {space?.is_ambassador || canManage ? 'Add Event' : 'Submit Event'}
                  </Button>
                </Menu.Trigger>
                <Menu.Content className="p-1">
                  {({ toggle }) => (
                    <>
                      <MenuItem
                        title="Create New Event"
                        iconLeft="icon-edit-square"
                        onClick={() => {
                          toggle();
                          router.push(`/create/event?space=${space?._id}`);
                        }}
                      />
                      <MenuItem
                        title="Submit Existing Event"
                        iconLeft="icon-celebration-outline"
                        onClick={() => {
                          toggle();
                          if (space?._id)
                            modal.open(ListingEvent, { dismissible: false, props: { spaceId: space._id } });
                        }}
                      />
                      <MenuItem
                        title="Submit External Event"
                        iconLeft="icon-globe"
                        onClick={() => {
                          toggle();
                          if (space?._id)
                            modal.open(ListingExternalEvent, { dismissible: false, props: { spaceId: space._id } });
                        }}
                      />
                    </>
                  )}
                </Menu.Content>
              </Menu.Root>

              <Calendar
                events={spaceEventsCalendar.map((item) => new Date(item.start))}
                selected={selectedDate}
                onSelectDate={setSelectedDate}
                footer={() => {
                  if (selectedDate) {
                    return (
                      <div className="flex justify-between items-center text-primary mt-3">
                        <time className="font-medium">{format(selectedDate, 'E, dd MMM yyyy')}</time>
                        <Button
                          variant="tertiary-alt"
                          icon="icon-x"
                          size="xs"
                          aria-label="close"
                          onClick={() => setSelectedDate(undefined)}
                        />
                      </div>
                    );
                  }

                  if (!upcomingEvents.length) return null;

                  return (
                    <Segment
                      className="w-full mt-3"
                      size="sm"
                      onSelect={(item) => setEventListType(item.value)}
                      selected={eventListType}
                      items={[
                        { label: 'Upcoming', value: 'upcoming' },
                        { label: 'Past', value: 'past' },
                      ]}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EventsWithMode({
  mode,
  events,
  loading,
  tags = [],
}: {
  mode: 'list' | 'card';
  events: Event[];
  loading?: boolean;
  tags?: SpaceTag[];
}) {
  const handleSelect = (event: Event) => {
    if (isMobile) {
      window.open(`/e/${event.shortid}`, '_blank');
    } else {
      drawer.open(EventPane, { props: { eventId: event._id }, contentClass: 'bg-background' });
    }
  };
  return (
    <>
      {mode === 'card' ? (
        <EventListCard events={events} loading={loading} tags={tags} onSelect={handleSelect} />
      ) : (
        <EventList events={events} loading={loading} tags={tags} onSelect={handleSelect} />
      )}
    </>
  );
}
