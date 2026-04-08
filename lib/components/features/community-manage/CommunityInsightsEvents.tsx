'use client';

import clsx from 'clsx';
import { snakeCase } from 'lodash';
import React from 'react';

import { Button, Card, Divider, InputField, Menu, MenuItem, Skeleton, toast } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import type {
  GetSpaceEventsInsightQuery,
  GetSpaceEventsInsightQueryVariables,
  Space,
  SortInput,
} from '$lib/graphql/generated/backend/graphql';
import {
  EventTense,
  GetSpaceEventsInsightDocument,
  GetSpaceStatisticsDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { formatWithTimezone } from '$lib/utils/date';
import { downloadFile, makeCSV } from '$lib/utils/file';
import { randomEventDP } from '$lib/utils/user';

const LIMIT = 15;

type EventsFilter = 'all' | 'upcoming' | 'past';
type EventsSort = 'recently-added' | 'date-earliest' | 'date-latest';
type EventInsightRow = GetSpaceEventsInsightQuery['getSpaceEventsInsight']['items'][number];

const FILTER_OPTIONS: Array<{ label: string; value: EventsFilter }> = [
  { label: 'All Events', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
];

const STATUS_FILTER_OPTIONS: Array<{ label: string; value: Exclude<EventsFilter, 'all'>; icon: string }> = [
  { label: 'Upcoming', value: 'upcoming', icon: 'icon-clock' },
  { label: 'Past', value: 'past', icon: 'icon-calendar' },
];

const SORT_OPTIONS: Array<{ label: string; value: EventsSort }> = [
  { label: 'Recently Added', value: 'recently-added' },
  { label: 'Date (Earliest)', value: 'date-earliest' },
  { label: 'Date (Latest)', value: 'date-latest' },
];

export function CommunityInsightsEvents({ space }: { space: Space }) {
  const [query, setQuery] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [skip, setSkip] = React.useState(0);
  const [filter, setFilter] = React.useState<EventsFilter>('all');
  const [sort, setSort] = React.useState<EventsSort>('recently-added');
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(query.trim());
      setSkip(0);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const { data: statisticsData, loading: statisticsLoading } = useQuery(GetSpaceStatisticsDocument, {
    variables: { space: space._id },
    skip: !space._id,
    fetchPolicy: 'cache-and-network',
  });

  const listVariables = React.useMemo<GetSpaceEventsInsightQueryVariables>(
    () => ({
      space: space._id,
      skip,
      limit: LIMIT,
      search: search || undefined,
      sort: getSortInput(sort),
      ...getFilterVariables(filter),
    }),
    [filter, search, skip, sort, space._id],
  );

  const {
    data: eventsData,
    loading: eventsLoading,
    client,
  } = useQuery(GetSpaceEventsInsightDocument, {
    variables: listVariables,
    skip: !space._id,
    fetchPolicy: 'cache-and-network',
  });

  const statistics = statisticsData?.getSpaceStatistics;
  const events = eventsData?.getSpaceEventsInsight.items || [];
  const total = eventsData?.getSpaceEventsInsight.total || 0;
  const activeFilterLabel = FILTER_OPTIONS.find((item) => item.value === filter)?.label || 'All Events';
  const activeSortLabel = SORT_OPTIONS.find((item) => item.value === sort)?.label || 'Recently Added';

  const handleFilterChange = (value: EventsFilter) => {
    setFilter(value);
    setSkip(0);
  };

  const handleSortChange = (value: EventsSort) => {
    setSort(value);
    setSkip(0);
  };

  const handleExport = async () => {
    if (!space._id || total === 0 || exporting) return;

    setExporting(true);
    const { data, error } = await client.query({
      query: GetSpaceEventsInsightDocument,
      variables: {
        ...listVariables,
        skip: 0,
        limit: total,
      },
      fetchPolicy: 'network-only',
    });
    setExporting(false);

    if (error || !data) {
      toast.error('Unable to export events right now.');
      return;
    }

    const rows = data.getSpaceEventsInsight.items.map((item) => [
      item.title,
      formatEventExportStart(item),
      formatEventLocation(item),
      formatWholeNumber(item.tickets_count),
      formatWholeNumber(item.checkins),
      formatWholeNumber(item.reviews ?? 0),
      item.rating == null ? '' : formatRating(item.rating),
    ]);

    downloadFile(
      makeCSV([
        ['Event', 'Starts On', 'Location', 'Tickets Sold', 'Check Ins', 'Reviews', 'Rating'],
        ...rows,
      ]),
      `${snakeCase(`${space.title}_events_insights`)}.csv`,
      'text/csv;charset=utf-8;',
    );
    toast.success('Downloaded events insights.');
  };

  return (
    <div className="page mx-auto px-4 py-7 md:px-0">
      <div className="flex flex-col gap-6 pb-20">
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              label="Events Created"
              loading={statisticsLoading && !statistics}
              value={formatWholeNumber(statistics?.created_events ?? 0)}
            />
            <StatCard
              label="Events Submitted"
              loading={statisticsLoading && !statistics}
              value={formatWholeNumber(statistics?.submitted_events ?? 0)}
            />
            <StatCard
              label="Total Attendees"
              loading={statisticsLoading && !statistics}
              value={formatWholeNumber(statistics?.event_attendees ?? 0)}
            />
            <StatCard
              label="Average Rating"
              loading={statisticsLoading && !statistics}
              value={formatRating(statistics?.avg_event_rating ?? 0)}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-tertiary">
            <i aria-hidden="true" className="icon-info size-4 shrink-0" />
            <p>Only events created under this calendar count towards these stats.</p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="flex-1 text-xl font-semibold">
              Events {!!total && `(${total})`}
            </h3>
            <Button
              aria-label="Download events insights"
              className="shrink-0"
              disabled={total === 0}
              icon="icon-download"
              loading={exporting}
              size="sm"
              variant="tertiary-alt"
              onClick={handleExport}
            />
          </div>

          <InputField
            className="w-full"
            iconLeft="icon-search"
            placeholder="Search"
            value={query}
            onChangeText={setQuery}
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Menu.Root placement="bottom-start">
              <Menu.Trigger>
                <Button iconLeft="icon-filter-line" iconRight="icon-chevron-down" size="sm" variant="tertiary-alt">
                  {activeFilterLabel}
                </Button>
              </Menu.Trigger>
              <Menu.Content className="w-68 overflow-hidden p-0">
                {({ toggle }) => (
                  <>
                    <div className="p-1">
                      <MenuItem
                        iconLeft="icon-ticket"
                        iconRight={filter === 'all' ? 'icon-done' : undefined}
                        title="All Events"
                        onClick={() => {
                          handleFilterChange('all');
                          toggle();
                        }}
                      />
                    </div>

                    <Divider className="border-card-border" />

                    <div className="p-1">
                      <p className="px-2 py-1 text-xs text-tertiary">Status</p>
                      {STATUS_FILTER_OPTIONS.map((option) => (
                        <MenuItem
                          key={option.value}
                          iconLeft={option.icon}
                          iconRight={option.value === filter ? 'icon-done' : undefined}
                          title={option.label}
                          onClick={() => {
                            handleFilterChange(option.value);
                            toggle();
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </Menu.Content>
            </Menu.Root>

            <Menu.Root>
              <Menu.Trigger>
                <Button iconLeft="icon-sort" iconRight="icon-chevron-down" size="sm" variant="tertiary-alt">
                  {activeSortLabel}
                </Button>
              </Menu.Trigger>
              <Menu.Content className="min-w-44 p-1">
                {({ toggle }) => (
                  <>
                    {SORT_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        iconRight={option.value === sort ? 'icon-done' : undefined}
                        title={option.label}
                        onClick={() => {
                          handleSortChange(option.value);
                          toggle();
                        }}
                      />
                    ))}
                  </>
                )}
              </Menu.Content>
            </Menu.Root>
          </div>

          <CardTable.Root data={events} loading={eventsLoading}>
            <CardTable.Header className="px-4 py-3">
              <div className="flex w-full min-w-0 items-center gap-4">
                <p className="min-w-0 flex-1 text-sm text-tertiary">Event</p>
                <p className="w-36 shrink-0 text-sm text-tertiary">Starts On</p>
                <p className="w-36 shrink-0 text-sm text-tertiary">Location</p>
                <p className="w-24 shrink-0 text-right text-sm text-tertiary">Tickets Sold</p>
                <p className="w-[72px] shrink-0 text-right text-sm text-tertiary">Check Ins</p>
                <p className="w-[72px] shrink-0 text-right text-sm text-tertiary">Reviews</p>
                <p className="w-[72px] shrink-0 text-right text-sm text-tertiary">Rating</p>
              </div>
            </CardTable.Header>

            <CardTable.Loading rows={5}>
              <div className="flex w-full min-w-0 items-center gap-4 px-4 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Skeleton animate className="size-5 shrink-0 rounded-xs" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton animate className="h-4 w-40 rounded-sm" />
                  </div>
                </div>
                <Skeleton animate className="h-5 w-36 shrink-0 rounded-sm" />
                <Skeleton animate className="h-5 w-36 shrink-0 rounded-sm" />
                <Skeleton animate className="h-5 w-24 shrink-0 rounded-sm" />
                <Skeleton animate className="h-5 w-[72px] shrink-0 rounded-sm" />
                <Skeleton animate className="h-5 w-[72px] shrink-0 rounded-sm" />
                <Skeleton animate className="h-5 w-[72px] shrink-0 rounded-sm" />
              </div>
            </CardTable.Loading>

            <CardTable.EmptyState>
              <div className="flex flex-col items-center justify-center gap-5 pb-20 pt-12 text-tertiary">
                <i aria-hidden="true" className="icon-ticket size-44 text-quaternary md:size-46" />
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">No Events</h3>
                  <p>No events match the current filters yet.</p>
                </div>
              </div>
            </CardTable.EmptyState>

            {events.map((item) => (
              <EventRow key={item.shortid || item._id || item.title} item={item} />
            ))}
          </CardTable.Root>

          {total > LIMIT && (
            <EventsPagination
              currentPage={Math.floor(skip / LIMIT) + 1}
              disableNext={skip + LIMIT >= total}
              disablePrev={skip === 0}
              onNext={() => setSkip((prev) => prev + LIMIT)}
              onPrev={() => setSkip((prev) => Math.max(0, prev - LIMIT))}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function EventRow({ item }: { item: EventInsightRow }) {
  const imageSrc = item.cover || randomEventDP(item._id || undefined);
  const eventUrl = item.shortid ? `/e/${item.shortid}` : undefined;
  const locationLabel = formatEventLocation(item);

  const eventContent = (
    <>
      <img alt="" className="size-5 shrink-0 rounded-xs border border-card-border object-cover" src={imageSrc} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-primary">{item.title}</p>
      </div>
    </>
  );

  return (
    <CardTable.Row>
      <div className="flex w-full min-w-0 items-center gap-4 px-4 py-3">
        {eventUrl ? (
          <button
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left transition hover:opacity-80"
            type="button"
            onClick={() => window.open(eventUrl, '_blank')}
          >
            {eventContent}
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">{eventContent}</div>
        )}

        <div className="w-36 shrink-0">
          <p className="truncate text-md text-tertiary">{formatEventStart(item)}</p>
        </div>

        <div className="w-36 shrink-0">
          <div className="flex items-start gap-2">
            <i
              aria-hidden="true"
              className={clsx('mt-0.5 size-4 shrink-0 text-tertiary', item.virtual ? 'icon-video' : 'icon-location-outline')}
            />
            <div className="min-w-0">
              <p className="truncate text-md text-tertiary">{locationLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex w-24 shrink-0 items-center justify-end gap-2 text-md text-tertiary">
          <i aria-hidden="true" className="icon-ticket size-4 shrink-0" />
          <p>{formatWholeNumber(item.tickets_count)}</p>
        </div>
        <p className="w-[72px] shrink-0 text-right text-md text-tertiary">
          {formatWholeNumber(item.checkins)}
        </p>
        <p className="w-[72px] shrink-0 text-right text-md text-tertiary">
          {formatWholeNumber(item.reviews ?? 0)}
        </p>
        <div className="flex w-[72px] shrink-0 items-center justify-end gap-2 text-md text-tertiary">
          <i aria-hidden="true" className="icon-star size-4 shrink-0" />
          <p>{item.rating == null ? '-' : formatRating(item.rating)}</p>
        </div>
      </div>
    </CardTable.Row>
  );
}

function EventsPagination({
  currentPage,
  disableNext,
  disablePrev,
  onNext,
  onPrev,
}: {
  currentPage: number;
  disableNext: boolean;
  disablePrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Button
        className="rounded-full"
        disabled={disablePrev}
        icon="icon-arrow-back-sharp"
        size="sm"
        variant="tertiary-alt"
        onClick={onPrev}
      />
      <p className="text-sm text-tertiary">Page {currentPage}</p>
      <Button
        className="rounded-full"
        disabled={disableNext}
        icon="icon-arrow-back-sharp rotate-180"
        size="sm"
        variant="tertiary-alt"
        onClick={onNext}
      />
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value: string; loading: boolean }) {
  return (
    <Card.Root className="min-h-[72px]">
      <Card.Content className="space-y-1 px-4 py-3">
        {loading ? (
          <>
            <Skeleton animate className="h-6 w-18 rounded-sm" />
            <Skeleton animate className="h-4 w-24 rounded-sm" />
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-primary">{value}</p>
            <p className="text-sm text-tertiary">{label}</p>
          </>
        )}
      </Card.Content>
    </Card.Root>
  );
}

function getFilterVariables(filter: EventsFilter): Pick<
  GetSpaceEventsInsightQueryVariables,
  'eventTense' | 'irlEvent' | 'virtualEvent'
> {
  switch (filter) {
    case 'upcoming':
      return { eventTense: EventTense.Future };
    case 'past':
      return { eventTense: EventTense.Past };
    default:
      return {};
  }
}

function getSortInput(sort: EventsSort): SortInput | undefined {
  switch (sort) {
    case 'date-earliest':
      return { field: 'start', order: 1 };
    case 'date-latest':
      return { field: 'start', order: -1 };
    default:
      return undefined;
  }
}

function formatEventStart(item: EventInsightRow) {
  if (!item.start) return 'TBA';
  return formatWithTimezone(new Date(item.start), 'MMM d, h:mm a', item.timezone || undefined);
}

function formatEventExportStart(item: EventInsightRow) {
  if (!item.start) return '';
  return formatWithTimezone(new Date(item.start), 'yyyy-MM-dd HH:mm OOO', item.timezone || undefined);
}

function formatEventLocation(item: EventInsightRow) {
  if (item.virtual) return 'Virtual';

  const address = item.address;
  if (!address) return 'Location TBA';

  const place = [address.city, address.region, address.country].filter(Boolean).join(', ');
  return place || address.title || 'Location TBA';
}

function formatWholeNumber(value: number) {
  return Math.round(value).toLocaleString('en-US');
}

function formatRating(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
