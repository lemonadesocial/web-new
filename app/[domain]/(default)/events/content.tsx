'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button, drawer, Menu, MenuItem, Segment } from '$lib/components/core';
import { EventListCard } from '$lib/components/features/EventList';
import { EventPane } from '$lib/components/features/pane';
import { Event, GetPastEventsDocument, GetUpcomingEventsDocument } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';
import { PageTitle } from '../shared';

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

export function EventsContent() {
  const me = useSession();
  const signIn = useSignIn();

  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState({
    type: 'upcoming',
    showHost: false,
    by: FilterItem.AllEvents,
    data: [] as Event[],
  });

  const client = getClient();

  const fetchData = React.useCallback(async () => {
    if (!me) return;

    let events = [] as Event[];
    const variables = {
      user: me.user,
      host: filter.showHost,
      unpublished: Number(filter.by) === FilterItem.Drafts ? true : undefined,
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
  }, [filter.type, me, filter.by]);

  React.useEffect(() => {
    if (!me) signIn();
  }, [me]);

  React.useEffect(() => {
    fetchData();
  }, [filter.type, filter.by]);

  return (
    <div className="flex flex-col gap-5 flex-1 w-full">
      <PageTitle title="Events">
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
                          setFilter((prev) => ({ ...prev, by: key as unknown as FilterItem }));
                          toggle();
                        }}
                      />
                    );
                  })
                }
              </Menu.Content>
            </Menu.Root>
          </div>
          <Button
            icon="icon-edit-square"
            size="sm"
            onClick={() => {
              // TODO: will need to update router after update from legacy code
              window.location.href = '/create/experience';
            }}
          />
        </div>
      </PageTitle>

      <EventListCard
        loading={loading}
        events={filter.data}
        onSelect={(event) => drawer.open(EventPane, { props: { eventId: event._id } })}
      />
    </div>
  );
}
