'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { endOfDay, startOfDay, format } from 'date-fns';
import clsx from 'clsx';

import { Button, Divider, drawer, Map, Menu, MenuItem, modal, Segment, Tag } from '$lib/components/core';
import { HeroSection } from '$lib/components/features/community';
import {
  Event,
  GetSpaceDocument,
  GetSpaceEventsCalendarDocument,
  GetSpaceEventsDocument,
  GetSpaceTagsDocument,
  SortOrder,
  Space,
  SpaceFragment,
  SpaceTagBase,
  SpaceTagType,
  User,
} from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { EventList, EventListCard } from '$lib/components/features/EventList';
import { Calendar } from '$lib/components/core/calendar';
import { scrollAtBottomAtom } from '$lib/jotai';
import { generateCssVariables } from '$lib/utils/fetchers';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { ListingEvent } from './ListingEvent';
import { EventPane } from '../pane';

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

export function Community({ me, space }: { me?: User; space?: Space }) {
  const [shouldLoadMore, setShouldLoadMore] = useAtom(scrollAtBottomAtom);

  const [mode, setMode] = React.useState<'card' | 'list'>('card');
  const [eventListType, setEventListType] = React.useState('upcoming');
  const [selectedTag, setSelectedTag] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const { data: dataGetSpace } = useQuery(GetSpaceDocument, {
    variables: { id: space?._id },
    initData: { __typename: 'Query', getSpace: space as { __typename: string } & SpaceFragment },
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
  const mappins = spaceEventsCalendar
    .filter((i) => i.address)
    .map((i) => ({ lat: i.address?.latitude as number, lng: i.address?.longitude as number }));

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
          `}
        </style>
      )}

      <div>
        <HeroSection space={dataGetSpace?.getSpace as Space} me={me} />
        <Divider className="my-8" />
        <div className="flex gap-18">
          <div className="flex flex-col flex-1 gap-6">
            <div className="flex">
              <h1 className="text-2xl font-semibold flex-1">Events</h1>
              <div>
                <Segment
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
              <div className="flex gap-1.5 flex-wrap">
                {eventTags.map((item) => (
                  <Tag
                    key={item._id}
                    className={clsx(
                      'hover:border-tertiary',
                      selectedTag === item._id && 'bg-primary-500 hover:border-transparent text-tertiary',
                    )}
                    onClick={() => setSelectedTag((prev) => (prev === item._id ? '' : item._id))}
                  >
                    {item.tag} <span className="text-tertiary/[.56]">{item.targets?.length}</span>
                  </Tag>
                ))}
              </div>
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

          <div className="hidden sticky top-0 z-50 flex-col gap-4 md:flex max-w-[296px]">
            <Menu.Root>
              <Menu.Trigger>
                <Button variant="tertiary" iconLeft="icon-plus" className="w-full">
                  Submit Event
                </Button>
              </Menu.Trigger>
              <Menu.Content className="px-1.5 py-2">
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
                    selected={eventListType}
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
