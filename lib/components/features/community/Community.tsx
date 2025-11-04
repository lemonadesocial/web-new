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
import { isMobile } from 'react-device-detect';
import { CommunityEventsWithCalendar } from './CommunityEventsWithCalendar';

const LIMIT = 50;
const FROM_NOW = new Date().toISOString();

type Props = {
  initData: {
    space?: Space;
    subSpaces?: PublicSpace[];
    spaceTags?: SpaceTag[];
  };
  customTitle?: (title: string) => React.ReactElement;
  hideHeroSection?: boolean;
  locked?: React.ReactElement;
};

export function Community({ initData, hideHeroSection = false, customTitle, locked }: Props) {
  const router = useRouter();
  const me = useMe();
  const [shouldLoadMore, setShouldLoadMore] = useAtom(scrollAtBottomAtom);

  const [mode, setMode] = React.useState<'card' | 'list'>('card');
  const [eventListType, setEventListType] = React.useState('upcoming');
  const [selectedTag, setSelectedTag] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const { data: dataGetSpace } = useQuery(GetSpaceDocument, {
    variables: { id: initData.space?._id },
    fetchPolicy: 'cache-and-network',
    initData: { getSpace: initData.space } as GetSpaceQuery,
  });
  const space = dataGetSpace?.getSpace as Space;

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
    <div className="relative pb-20">
      {!hideHeroSection && (
        <>
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
        </>
      )}

      <CommunityEventsWithCalendar space={space} />
    </div>
  );
}
