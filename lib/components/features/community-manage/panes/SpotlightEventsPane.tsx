'use client';
import React from 'react';
import { format } from 'date-fns';
import { Button, InputField, Menu, MenuItem, drawer } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { GetSpaceEventsDocument, Event, Space, EventSortInput, SortOrder } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { debounce } from 'lodash';
import { SpotlightEventCard } from './SpotlightEventCard';

interface Props {
  space: Space;
  selectedEvents?: Event[];
  onSave: (events: Event[]) => void;
}

export function SpotlightEventsPane({ space, selectedEvents = [], onSave }: Props) {
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedEventObjects, setSelectedEventObjects] = React.useState<Event[]>(selectedEvents);
  const [filter, setFilter] = React.useState('all');
  const [sort, setSort] = React.useState('recently-added');

  const getSortInput = (): EventSortInput | undefined => {
    if (sort === 'date-asc') {
      return { start: SortOrder.Asc };
    }
    if (sort === 'date-desc') {
      return { start: SortOrder.Desc };
    }
    if (sort === 'recently-added') {
      return { start: SortOrder.Desc };
    }
    return undefined;
  };

  const getDateFilter = () => {
    const now = new Date().toISOString();
    if (filter === 'upcoming') {
      return { startFrom: now };
    }
    if (filter === 'past') {
      return { startTo: now };
    }
    return {};
  };

  const { data, loading } = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space._id,
      limit: 100,
      skip: 0,
      search: debouncedSearch || undefined,
      sort: getSortInput(),
      ...getDateFilter(),
    },
    skip: !space._id,
  });

  const events = (data?.getEvents || []) as Event[];

  React.useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(search);
    }, 500);

    handler();

    return () => {
      handler.cancel();
    };
  }, [search]);

  const handleToggleEvent = (event: Event) => {
    setSelectedEventObjects((prev) => {
      const isSelected = prev.some((e) => e._id === event._id);
      if (isSelected) {
        return prev.filter((e) => e._id !== event._id);
      }
      return [...prev, event];
    });
  };

  const handleSave = () => {
    onSave(selectedEventObjects);
    drawer.close();
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>

      <Pane.Content className="p-4 flex flex-col gap-6 overflow-auto">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Spotlight Events</h2>
          <p className="text-secondary">
            Choose events to highlight when the chat opens. These help members quickly discover what's happening in your community.
          </p>
        </div>

        <div className="space-y-3">
          <InputField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconLeft="icon-search"
            placeholder="Search"
          />

          <div className="flex justify-between">
            <Menu.Root>
              <Menu.Trigger>
                {({ toggle }) => (
                  <Button
                    variant="tertiary-alt"
                    size="sm"
                    iconLeft="icon-filter-line"
                    iconRight="icon-chevron-down"
                    onClick={toggle}
                  >
                    {filter === 'all' ? 'All Events' : filter === 'upcoming' ? 'Upcoming' : 'Past'}
                  </Button>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-1 min-w-[120px]">
                {({ toggle }) => (
                  <>
                    <MenuItem
                      title="All Events"
                      iconRight={filter === 'all' ? 'icon-done' : ''}
                      onClick={() => {
                        setFilter('all');
                        toggle();
                      }}
                    />
                    <MenuItem
                      title="Upcoming"
                      iconRight={filter === 'upcoming' ? 'icon-done' : ''}
                      onClick={() => {
                        setFilter('upcoming');
                        toggle();
                      }}
                    />
                    <MenuItem
                      title="Past"
                      iconRight={filter === 'past' ? 'icon-done' : ''}
                      onClick={() => {
                        setFilter('past');
                        toggle();
                      }}
                    />
                  </>
                )}
              </Menu.Content>
            </Menu.Root>

            <Menu.Root>
              <Menu.Trigger>
                {({ toggle }) => (
                  <Button
                    variant="tertiary-alt"
                    size="sm"
                    iconLeft="icon-sort"
                    iconRight="icon-chevron-down"
                    onClick={toggle}
                  >
                    {sort === 'recently-added'
                      ? 'Recently Added'
                      : sort === 'date-asc'
                        ? 'Date (Earliest)'
                        : 'Date (Latest)'}
                  </Button>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-1 min-w-[140px]">
                {({ toggle }) => (
                  <>
                    <MenuItem
                      title="Recently Added"
                      iconRight={sort === 'recently-added' ? 'icon-done' : ''}
                      onClick={() => {
                        setSort('recently-added');
                        toggle();
                      }}
                    />
                    <MenuItem
                      title="Date (Earliest)"
                      iconRight={sort === 'date-asc' ? 'icon-done' : ''}
                      onClick={() => {
                        setSort('date-asc');
                        toggle();
                      }}
                    />
                    <MenuItem
                      title="Date (Latest)"
                      iconRight={sort === 'date-desc' ? 'icon-done' : ''}
                      onClick={() => {
                        setSort('date-desc');
                        toggle();
                      }}
                    />
                  </>
                )}
              </Menu.Content>
            </Menu.Root>
          </div>

          <div className="flex flex-col gap-2 overflow-auto flex-1 bg-card rounded-md border border-card-border">
            {loading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-center p-2">
                    <div className="size-12 bg-card rounded-md animate-pulse" />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="h-4 bg-card rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-card rounded w-1/2 animate-pulse" />
                    </div>
                    <div className="size-5 rounded-full border border-card-border" />
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-tertiary">
                <i aria-hidden="true" className="icon-ticket size-12 text-quaternary mb-3" />
                <p className="text-sm">No events found</p>
              </div>
            ) : (
              events.map((event) => {
                const isSelected = selectedEventObjects.some((e) => e._id === event._id);
                return (
                  <SpotlightEventCard
                    key={event._id}
                    event={event}
                    isSelected={isSelected}
                    onToggle={handleToggleEvent}
                  />
                );
              })
            )}
          </div>
        </div>
      </Pane.Content>

      <Pane.Footer>
        <div className="p-4 border-t">
          <Button variant="secondary" onClick={handleSave} disabled={selectedEventObjects.length === 0}>
            Add Events
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}
