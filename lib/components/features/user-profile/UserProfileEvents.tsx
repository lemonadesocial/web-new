'use client';
import React, { use } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

import { Button, drawer, Menu, MenuItem, Segment } from '$lib/components/core';
import { EventListCard } from '$lib/components/features/EventList';
import { EventPane } from '$lib/components/features/pane';
import { Event, GetPastEventsDocument, GetUpcomingEventsDocument, User } from '$lib/graphql/generated/backend/graphql';
import { useClient } from '$lib/graphql/request';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useMe } from '$lib/hooks/useMe';
// import { ClaimLemonHeadCard } from '$lib/components/features/lemonheads/ClaimLemonHeadCard';

// import { PageTitle } from '../shared';

enum FilterItem {
  AllEvents,
  Drafts,
  Hosting,
  Attending,
}
const FILTER_OPTIONS = {
  [FilterItem.AllEvents]: { label: 'All Events', icon: 'icon-house-party' },
  [FilterItem.Drafts]: { label: 'Drafts', icon: 'icon-document' },
  [FilterItem.Hosting]: { label: 'Hosting', icon: 'icon-crown' },
  [FilterItem.Attending]: { label: 'Attending', icon: 'icon-guests' },
};

export default function UserProfileEvents({ user }: { user: User }) {
  const router = useRouter();
  const me = useMe();

  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState({
    type: 'upcoming',
    by: FilterItem.AllEvents,
    data: [] as Event[],
  });

  const { client } = useClient();

  const fetchData = React.useCallback(async () => {
    let events = [] as Event[];
    let showHost: any = null;
    if (Number(filter.by) === FilterItem.Hosting) showHost = true;
    if (Number(filter.by) === FilterItem.Attending) showHost = false;

    const unpublished = Number(filter.by) === FilterItem.Drafts ? true : undefined;

    const variables = {
      limit: 100,
      skip: 0,
      user: user?._id,
      host: showHost,
      unpublished,
    };
    setLoading(true);
    if (filter.type === 'upcoming') {
      const { data } = await client.query({
        query: GetUpcomingEventsDocument,
        variables: { ...variables, sort: { start: 1 } },
      });
      events = data?.events as Event[];
    } else {
      const { data } = await client.query({
        query: GetPastEventsDocument,
        variables: { ...variables, sort: { start: -1 } },
      });
      events = data?.events as Event[];
    }

    setFilter((prev) => ({ ...prev, data: events }));
    setLoading(false);
  }, [filter.type, user, filter.by]);

  React.useEffect(() => {
    fetchData();
  }, [filter.type, filter.by, user]);

  if (!user) return null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 flex-1 w-full">
        <div className="flex justify-between">
          <h3 className="hidden md:block text-xl font-semibold capitalize">{filter.type}</h3>
          <div className="flex gap-2 items-center justify-between w-full md:w-fit">
            <div className="flex gap-2 items-center">
              <Segment
                size="sm"
                selected={filter.type}
                onSelect={({ value }) => setFilter((prev) => ({ ...prev, type: value }))}
                items={[
                  { label: 'Upcoming', value: 'upcoming' },
                  { label: 'Past', value: 'past' },
                ]}
              />
            </div>
            <div className="flex gap-2">
              <Menu.Root className="w-[132px]">
                <Menu.Trigger>
                  <div className="btn btn-tertiary rounded-sm">
                    <MenuItem iconRight="icon-chevrons-up-down">
                      <div className="flex items-center gap-1.5 flex-1">
                        <i className={twMerge(FILTER_OPTIONS[filter.by].icon, 'text-tertiary size-4')} />
                        <p className="font-medium text-sm font-default-body text-secondary flex-1">
                          {FILTER_OPTIONS[filter.by].label}
                        </p>
                      </div>
                    </MenuItem>
                  </div>
                </Menu.Trigger>

                <Menu.Content className="p-1">
                  {({ toggle }) =>
                    Object.entries(FILTER_OPTIONS).map(([key, value]) => {
                      return (
                        <MenuItem
                          key={key}
                          title={value.label}
                          iconLeft={value.icon}
                          onClick={() => {
                            setFilter((prev) => ({ ...prev, by: Number(key) as FilterItem }));
                            toggle();
                          }}
                        />
                      );
                    })
                  }
                </Menu.Content>
              </Menu.Root>

              {me?._id === user._id && (
                <Button icon="icon-plus" variant="secondary" size="sm" onClick={() => router.push('/create/event')} />
              )}
            </div>
          </div>
        </div>

        <EventListCard
          loading={loading}
          events={filter.data}
          onSelect={(event) => drawer.open(EventPane, { props: { eventId: event._id }, contentClass: 'bg-background' })}
        />
      </div>

      {/* <ClaimLemonHeadCard /> */}
    </div>
  );
}
