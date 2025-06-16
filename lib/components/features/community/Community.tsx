'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { endOfDay, startOfDay, format } from 'date-fns';
import clsx from 'clsx';
import Link from 'next/link';

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
  GetSpaceTagsQuery,
  GetSubSpacesDocument,
  GetSubSpacesQuery,
  PublicSpace,
  SortOrder,
  Space,
  SpaceTag,
  SpaceTagType,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { EventList, EventListCard } from '$lib/components/features/EventList';
import { Calendar } from '$lib/components/core/calendar';
import { scrollAtBottomAtom, sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';

import { ListingEvent } from './ListingEvent';
import { EventPane } from '../pane';
import { useSignIn } from '$lib/hooks/useSignIn';
import { MyEventRequests } from './MyEventRequests';
import CommunityCard from './CommunityCard';
import { ListingExternalEvent } from './ListingExternalEvent';
import { useRouter } from 'next/navigation';

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

type Props = {
  initData: {
    space?: Space;
    subSpaces?: PublicSpace[];
    spaceTags?: SpaceTag[];
  };
};

export function Community({ initData }: Props) {
  const space = initData.space;

  const router = useRouter();
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

  const { data: dataGetSubSpaces } = useQuery(GetSubSpacesDocument, {
    variables: { id: space?._id },
    skip: !space?._id || !space?.sub_spaces?.length,
    fetchPolicy: 'cache-and-network',
    initData: { getSubSpaces: initData.subSpaces } as GetSubSpacesQuery,
  });

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

  const subSpaces = (dataGetSubSpaces?.getSubSpaces || []) as PublicSpace[];

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

  return (
    <>
      <div className="relative">
        <HeroSection space={dataGetSpace?.getSpace as Space} />
        <Divider className="my-8" />
        {subSpaces.length > 0 && (
          <>
            <section className="flex flex-col gap-6">
              <div className="w-full flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-semibold flex-1 text-primary">Hubs</h1>
                {subSpaces.length > 3 && (
                  <Link href={`/s/${space?.slug || space?._id}/featured-hubs`}>
                    <Button variant="tertiary-alt" size="sm">
                      {`View All (${subSpaces.length})`}
                    </Button>
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subSpaces.slice(0, 3).map((space) => (
                  <CommunityCard key={space._id} space={space} />
                ))}
              </div>
            </section>
            <Divider className="my-8" />
          </>
        )}
        <div className="flex md:gap-18">
          <div className="flex flex-col flex-1 gap-6 w-full">
            <div className="flex">
              <h1 className="text-xl md:text-2xl text-primary font-semibold flex-1">Events</h1>
              <div className="flex gap-2 items-center">
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
                            if (space?._id) modal.open(ListingEvent, { props: { spaceId: space._id } });
                          }}
                        />
                        <MenuItem
                          title="Submit External Event"
                          iconLeft="icon-globe"
                          onClick={() => {
                            toggle();
                            if (space?._id) modal.open(ListingExternalEvent, { props: { spaceId: space._id } });
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
                    <span className="text-sm text-primary">{item.tag}</span>{' '}
                    <span className="text-tertiary text-sm">{item.targets?.length}</span>
                  </Tag>
                ))}
              </div>
            )}

            {!canManage && !upcomingEvents.length && (
              <NoUpcomingEvents spaceId={space?._id} followed={dataGetSpace?.getSpace?.followed} />
            )}

            <MyEventRequests spaceId={space?._id} />

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
                          if (space?._id) modal.open(ListingEvent, { props: { spaceId: space._id } });
                        }}
                      />
                      <MenuItem
                        title="Submit External Event"
                        iconLeft="icon-globe"
                        onClick={() => {
                          toggle();
                          if (space?._id) modal.open(ListingExternalEvent, { props: { spaceId: space._id } });
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
  tags?: SpaceTag[];
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
  const signIn = useSignIn();
  const [follow, { loading }] = useMutation(FollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${spaceId}`, data: { followed: true } });
    },
  });

  const handleSubscribe = () => {
    if (!session) {
      signIn();
      return;
    }

    follow({ variables: { space: spaceId } });
  };

  return (
    <div className="bg-card rounded-md flex gap-3 px-4 py-3 backdrop-blur-md">
      <i className="icon-dashboard size-[48px] text-primary/16" />
      <div className="flex-1">
        <p className="text-lg text-primary">No Upcoming Events</p>
        <p className="text-tertiary">Subscribe to the calendar to get notified when new events are posted.</p>
        {!followed && (
          <>
            <Divider className="my-3" />
            <Button variant="flat" loading={loading} className="text-accent-400!" onClick={handleSubscribe}>
              Subscribe
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
