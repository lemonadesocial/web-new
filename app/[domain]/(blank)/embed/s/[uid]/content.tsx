'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { isMobile } from 'react-device-detect';
import { endOfDay, startOfDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { useMutation, useQuery } from '$lib/graphql/request';
import { Button, Divider, drawer, Menu, MenuItem, modal, Segment, Tag } from '$lib/components/core';
import {
  Event,
  FollowSpaceDocument,
  GetSpaceDocument,
  GetSpaceEventsDocument,
  GetSpaceQuery,
  GetSpaceTagsDocument,
  SortOrder,
  Space,
  SpaceTag,
  SpaceTagType,
} from '$lib/graphql/generated/backend/graphql';
import { sessionAtom } from '$lib/jotai';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useMe } from '$lib/hooks/useMe';
import { MyEventRequests } from '$lib/components/features/community/MyEventRequests';
import { ListingEvent } from '$lib/components/features/community/ListingEvent';
import { ListingExternalEvent } from '$lib/components/features/community/ListingExternalEvent';
import { EventPane } from '$lib/components/features/pane';
import { EventList, EventListCard } from '$lib/components/features/EventList';

interface Props {
  space?: Space;
  customTitle?: (title: string) => React.ReactElement;
  locked?: React.ReactElement;
  className?: string;
}

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

export function Content({ space: initSpace, customTitle, locked, className }: Props) {
  const router = useRouter();
  const me = useMe();

  const [mode, setMode] = React.useState<'card' | 'list'>('card');
  const [eventListType, _setEventListType] = React.useState('upcoming');
  const [selectedTag, setSelectedTag] = React.useState('');
  const [selectedDate, _setSelectedDate] = React.useState<Date>();
  const [canLoadMore, setCanLoadMore] = React.useState({
    past: true,
    upcomming: true,
    date: true,
  });
  const [fetching, setFetching] = React.useState(false);

  const { data: dataGetSpace } = useQuery(GetSpaceDocument, {
    variables: { id: initSpace?._id },
    fetchPolicy: 'cache-and-network',
    initData: initSpace ? ({ getSpace: initSpace } as unknown as GetSpaceQuery) : undefined,
  });

  const space = dataGetSpace?.getSpace as Space | undefined;

  const { data: dataGetSpaceTags } = useQuery(GetSpaceTagsDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
    fetchPolicy: 'cache-and-network',
  });

  const spaceTags = (dataGetSpaceTags?.listSpaceTags || []) as SpaceTag[];
  const eventTags = spaceTags.filter((t) => t.type === SpaceTagType.Event && !!t.targets?.length);

  const resUpcomingEvents = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space?._id,
      limit: LIMIT,
      skip: 0,
      endFrom: FROM_NOW,
      spaceTags: selectedTag ? [selectedTag] : [],
    },
    skip: !space?._id || !!locked,
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
    skip: !space?._id || !!locked,
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
    skip: !space?._id || !selectedDate || !!locked,
  });
  const events = (resEventsByDate.data?.getEvents || []) as Event[];

  React.useEffect(() => {
    const main = document.getElementsByTagName('main')?.[0];

    const handleScroll = async () => {
      if (main) {
        const { scrollTop, scrollHeight, clientHeight } = main;

        if (Math.abs(scrollHeight - (scrollTop + clientHeight)) <= 1 && !fetching) {
          if (selectedDate && canLoadMore.date && events.length >= LIMIT) {
            setFetching(true);
            await resEventsByDate.fetchMore({
              variables: { skip: events.length },
              updateQuery: (existing, res) => {
                if (res?.getEvents?.length) {
                  return { __typename: 'Query', getEvents: [...(existing?.getEvents || []), ...res?.getEvents] };
                } else {
                  setCanLoadMore((prev) => ({ ...prev, date: false }));
                }

                setCanLoadMore((prev) => ({ ...prev, date: false }));
                return existing;
              },
            });
          }

          if (!selectedDate) {
            if (eventListType === 'upcoming' && canLoadMore.upcomming && upcomingEvents.length >= LIMIT) {
              setFetching(true);

              await resUpcomingEvents.fetchMore({
                variables: { skip: upcomingEvents.length },
                updateQuery: (existing, res) => {
                  if (res?.getEvents?.length) {
                    return { __typename: 'Query', getEvents: [...(existing?.getEvents || []), ...res?.getEvents] };
                  } else {
                    setCanLoadMore((prev) => ({ ...prev, upcomming: false }));
                  }

                  return existing;
                },
              });
            }

            if (eventListType === 'past' && canLoadMore.past && pastEvents.length >= LIMIT) {
              setFetching(true);
              await resPastEvents.fetchMore({
                variables: { skip: pastEvents.length },
                updateQuery: (existing, res) => {
                  if (res?.getEvents?.length) {
                    return { __typename: 'Query', getEvents: [...(existing?.getEvents || []), ...res?.getEvents] };
                  } else {
                    setCanLoadMore((prev) => ({ ...prev, past: false }));
                  }

                  return existing;
                },
              });
            }
          }

          setFetching(false);
        }
      }
    };

    if (main) {
      main.addEventListener('scroll', handleScroll);
    }

    return () => {
      main.removeEventListener('scroll', handleScroll);
    };
  }, [upcomingEvents.length, pastEvents.length, events.length, canLoadMore, fetching, eventListType, selectedDate]);

  const canManage = [space?.creator, ...(space?.admins?.map((p) => p._id) || [])].filter((p) => p).includes(me?._id);

  return (
    <div className={twMerge('flex md:gap-18', className)}>
      <div className="flex flex-col flex-1 gap-6 w-full">
        <div className="flex">
          {customTitle ? (
            customTitle(eventListType)
          ) : (
            <h1 className="text-xl md:text-2xl text-primary font-semibold flex-1">Events</h1>
          )}
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
                        if (space?._id) router.push(`/create/event?space=${space._id}`);
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

        <>
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
            <NoUpcomingEvents message="No Upcoming Events" spaceId={space?._id} followed={space?.followed} />
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
        </>
      </div>
    </div>
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

function NoUpcomingEvents({ spaceId, followed }: { spaceId?: string; message: string; followed?: boolean | null }) {
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
