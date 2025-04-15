'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { endOfDay, startOfDay, format } from 'date-fns';
import clsx from 'clsx';

import { Button, Divider, drawer, Menu, MenuItem, modal, Segment, Tag } from '$lib/components/core';
import { HeroSection } from '$lib/components/features/community';
import {
  Event,
  FollowSpaceDocument,
  GetSpaceDocument,
  GetSpaceEventsCalendarDocument,
  GetSpaceEventsDocument,
  GetSpaceQuery,
  GetSpaceTagsDocument,
  SortOrder,
  Space,
  SpaceTagBase,
  SpaceTagType,
} from '$lib/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/request';
import { EventList, EventListCard } from '$lib/components/features/EventList';
import { Calendar } from '$lib/components/core/calendar';
import { scrollAtBottomAtom, sessionAtom } from '$lib/jotai';
import { generateCssVariables } from '$lib/utils/fetchers';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { useMe } from '$lib/hooks/useMe';
import { handleSignIn } from '$lib/utils/ory';

import { ListingEvent } from './ListingEvent';
import { EventPane } from '../pane';

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

export function Community({ space }: { space?: Space }) {
  const me = useMe();
  const [shouldLoadMore, setShouldLoadMore] = useAtom(scrollAtBottomAtom);

  const [mode, setMode] = React.useState<'card' | 'list'>('card');
  const [eventListType, setEventListType] = React.useState('upcoming');
  const [selectedTag, setSelectedTag] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const { data: dataGetSpace } = useQuery(GetSpaceDocument, {
    variables: { id: space?._id },
    fetchPolicy: 'cache-and-network',
    initData: { getSpace: space } as GetSpaceQuery,
  });

  const { data: dataGetSpaceTags } = useQuery(GetSpaceTagsDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
  });
  const spaceTags = (dataGetSpaceTags?.listSpaceTags || []) as SpaceTagBase[];
  const eventTags = spaceTags.filter((t) => t.type === SpaceTagType.Event && !!t.targets?.length);

  const { data: dataGetSpaceEventsCalendar } = useQuery(GetSpaceEventsCalendarDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
  });
  const spaceEventsCalendar = dataGetSpaceEventsCalendar?.getEvents || [];
  // const mappins = spaceEventsCalendar
  //   .filter((i) => i.address)
  //   .map((i) => ({ lat: i.address?.latitude as number, lng: i.address?.longitude as number }));

  const resUpcomingEvents = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space?._id,
      limit: LIMIT,
      skip: 0,
      endFrom: FROM_NOW,
      spaceTags: selectedTag ? [selectedTag] : [],
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
      spaceTags: selectedTag ? [selectedTag] : [],
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
      spaceTags: selectedTag ? [selectedTag] : [],
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

  const theme = (dataGetSpace?.getSpace as Space).theme_data;
  return (
    <>
      {theme?.variables && (
        <style global jsx>
          {`
            body {
              ${theme.variables.font && generateCssVariables(theme.variables.font)}
            }

            @media (prefers-color-scheme: dark) {
              main {
                ${theme.variables.dark && generateCssVariables(theme.variables.dark)}
              }
            }

            @media (prefers-color-scheme: light) {
              main {
                ${theme.variables.light && generateCssVariables(theme.variables.light)}
              }
            }

            :root {
              ${theme.variables.pattern && generateCssVariables(theme.variables.pattern)}
            }
          `}
        </style>
      )}

      <div id="pattern" className={`pattern ${theme?.class}`}></div>

      <div className="relative">
        <HeroSection space={dataGetSpace?.getSpace as Space} />
        <Divider className="my-8" />
        <div className="flex md:gap-18">
          <div className="flex flex-col flex-1 gap-6 w-full">
            <div className="flex">
              <h1 className="text-xl md:text-2xl font-semibold flex-1">Events</h1>
              <div className="flex gap-2 items-center">
                <Menu.Root className="md:hidden">
                  <Menu.Trigger>
                    <Button variant="tertiary-alt" iconLeft="icon-plus" size="sm" className="w-full">
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
                            window.open(`${LEMONADE_DOMAIN}/create/experience?space=${space?._id}`);
                          }}
                        />
                        <MenuItem
                          title="Submit Existing Event"
                          iconLeft="icon-celebration-outline"
                          onClick={() => {
                            toggle();
                            if (space?._id) modal.open(ListingEvent, { props: { spaceId: space._id } });
                          }}
                        />
                      </>
                    )}
                  </Menu.Content>
                </Menu.Root>

                <Segment
                  size="sm"
                  selected="card"
                  onSelect={(item) => setMode(item.value as 'card' | 'list')}
                  items={[
                    { value: 'card', icon: 'icon-view-agenda-outline' },
                    { value: 'list', icon: 'icon-list-bulleted' },
                  ]}
                />
              </div>
            </div>

            {!!eventTags.length && (
              <div className="flex gap-1.5 overflow-auto md:flex-wrap no-scrollbar">
                {eventTags.map((item) => (
                  <Tag
                    key={item._id}
                    className={clsx(
                      'hover:border-primary min-w-fit',
                      selectedTag === item._id && 'bg-accent-500 hover:border-transparent text-tertiary',
                    )}
                    onClick={() => setSelectedTag((prev) => (prev === item._id ? '' : item._id))}
                  >
                    <span className="text-sm">{item.tag}</span>{' '}
                    <span className="text-tertiary text-sm">{item.targets?.length}</span>
                  </Tag>
                ))}
              </div>
            )}

            {!canManage && !upcomingEvents.length && (
              <NoUpcomingEvents spaceId={space?._id} followed={dataGetSpace?.getSpace?.followed} />
            )}

            {!selectedDate ? (
              <>
                {!!upcomingEvents.length && eventListType === 'upcoming' && (
                  <EventsWithMode
                    mode={mode}
                    events={upcomingEvents}
                    loading={resUpcomingEvents.loading}
                    tags={eventTags}
                  />
                )}

                {(!upcomingEvents.length || eventListType === 'past') && (
                  <EventsWithMode mode={mode} events={pastEvents} loading={resPastEvents.loading} tags={eventTags} />
                )}
              </>
            ) : (
              <EventsWithMode mode={mode} events={events} loading={resEventsByDate.loading} tags={eventTags} />
            )}
          </div>

          <div>
            <div className="hidden sticky top-7 z-50 flex-col gap-4 md:flex max-w-[296px]">
              <Menu.Root>
                <Menu.Trigger>
                  <Button variant="tertiary-alt" iconLeft="icon-plus" size="sm" className="w-full">
                    Submit Event
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
                          window.open(`${LEMONADE_DOMAIN}/create/experience?space=${space?._id}`);
                        }}
                      />
                      <MenuItem
                        title="Submit Existing Event"
                        iconLeft="icon-celebration-outline"
                        onClick={() => {
                          toggle();
                          if (space?._id) modal.open(ListingEvent, { props: { spaceId: space._id } });
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
              {/* <div className="aspect-square rounded-lg overflow-hidden"> */}
              {/*   <Map markers={mappins} marker="advanced" /> */}
              {/* </div> */}
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
  tags?: SpaceTagBase[];
}) {
  return (
    <>
      {mode === 'card' ? (
        <EventListCard
          events={events}
          loading={loading}
          tags={tags}
          onSelect={(event) => drawer.open(EventPane, { props: { eventId: event._id } })}
        />
      ) : (
        <EventList
          events={events}
          loading={loading}
          tags={tags}
          onSelect={(event) => drawer.open(EventPane, { props: { eventId: event._id } })}
        />
      )}
    </>
  );
}

function NoUpcomingEvents({ spaceId, followed }: { spaceId?: string; followed?: boolean | null }) {
  const [session] = useAtom(sessionAtom);

  const [follow, { loading }] = useMutation(FollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${spaceId}`, data: { followed: true } });
    },
  });

  const handleSubscribe = () => {
    if (!session) {
      handleSignIn();
      return;
    }

    follow({ variables: { space: spaceId } });
  };

  return (
    <div className="bg-card rounded-md flex gap-3 px-4 py-3">
      <i className="icon-dashboard size-[48px] text-primary/16" />
      <div className="flex-1">
        <p className="text-lg">No Upcoming Events</p>
        <p className="text-tertiary">Subscribe to the calendar to get notified when new events are posted.</p>
        {!followed && (
          <>
            <Divider className="my-3" />
            <Button variant="flat" loading={loading} className="text-accent-400" onClick={handleSubscribe}>
              Subscribe
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
