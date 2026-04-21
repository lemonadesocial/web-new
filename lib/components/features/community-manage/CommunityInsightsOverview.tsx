'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

import { Avatar } from '$lib/components/core/avatar';
import { Card } from '$lib/components/core/card';
import { Divider } from '$lib/components/core/divider';
import { Segment } from '$lib/components/core/segment';
import { Skeleton } from '$lib/components/core/skeleton';
import type {
  GetSpaceEventLocationsLeaderboardQuery,
  GetSpaceMemberAmountByDateQuery,
  GetSpaceStatisticsQuery,
  GetTopSpaceEventAttendeesQuery,
  GetTopSpaceHostsQuery,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import {
  GetSpaceEventLocationsLeaderboardDocument,
  GetSpaceMemberAmountByDateDocument,
  GetSpaceStatisticsDocument,
  GetTopSpaceEventAttendeesDocument,
  GetTopSpaceHostsDocument,
  SpaceRole as SpaceRoleEnum,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';

type SubscriberRange = '1D' | '1W' | '1M' | '6M' | '1Y' | 'All';

type HostRow = GetTopSpaceHostsQuery['getTopSpaceHosts'][number];
type AttendeeRow = GetTopSpaceEventAttendeesQuery['getTopSpaceEventAttendees'][number];
type LocationRow = GetSpaceEventLocationsLeaderboardQuery['getSpaceEventLocationsLeaderboard'][number];
type SubscriberPoint = GetSpaceMemberAmountByDateQuery['getSpaceMemberAmountByDate'][number];

const SUBSCRIBER_RANGES: readonly SubscriberRange[] = ['1D', '1W', '1M', '6M', '1Y', 'All'];
const LEADERBOARD_LIMIT = 5;
const HOST_SUMMARY_LIMIT = 1000;
const LOCATION_LIMIT = 5;
const CHART_STROKE = '#9b7cff';

export function CommunityInsightsOverview({ space }: { space: Space }) {
  const [selectedRange, setSelectedRange] = React.useState<SubscriberRange>('1D');
  const subscriberWindow = React.useMemo(() => getSubscriberRangeWindow(selectedRange), [selectedRange]);

  const { data: statisticsData, loading: statisticsLoading } = useQuery(GetSpaceStatisticsDocument, {
    variables: { space: space._id },
    skip: !space._id,
    fetchPolicy: 'cache-and-network',
  });

  const { data: subscribersData, loading: subscribersLoading } = useQuery(GetSpaceMemberAmountByDateDocument, {
    variables: {
      space: space._id,
      role: SpaceRoleEnum.Subscriber,
      start: subscriberWindow.start.toISOString(),
      end: subscriberWindow.end.toISOString(),
    },
    skip: !space._id,
    fetchPolicy: 'cache-and-network',
  });

  const { data: hostsData, loading: hostsLoading } = useQuery(GetTopSpaceHostsDocument, {
    variables: { space: space._id, limit: HOST_SUMMARY_LIMIT },
    skip: !space._id,
    fetchPolicy: 'cache-and-network',
  });

  const { data: attendeesData, loading: attendeesLoading } = useQuery(GetTopSpaceEventAttendeesDocument, {
    variables: { space: space._id, limit: LEADERBOARD_LIMIT },
    skip: !space._id,
    fetchPolicy: 'cache-and-network',
  });

  const { data: citiesData, loading: citiesLoading } = useQuery(GetSpaceEventLocationsLeaderboardDocument, {
    variables: { space: space._id, limit: LOCATION_LIMIT, city: true },
    skip: !space._id,
    fetchPolicy: 'cache-and-network',
  });

  const { data: countriesData, loading: countriesLoading } = useQuery(GetSpaceEventLocationsLeaderboardDocument, {
    variables: { space: space._id, limit: LOCATION_LIMIT, city: false },
    skip: !space._id,
    fetchPolicy: 'cache-and-network',
  });

  const statistics = statisticsData?.getSpaceStatistics;

  const subscriberSeries = React.useMemo(() => normalizeSubscriberSeries(subscribersData?.getSpaceMemberAmountByDate), [
    subscribersData?.getSpaceMemberAmountByDate,
  ]);

  const currentSubscribers = subscriberSeries.at(-1)?.total ?? Math.round(statistics?.subscribers ?? 0);
  const subscriberChange = React.useMemo(() => getSeriesChange(subscriberSeries), [subscriberSeries]);

  const allHosts = hostsData?.getTopSpaceHosts ?? [];
  const topHosts = React.useMemo(() => allHosts.slice(0, LEADERBOARD_LIMIT), [allHosts]);
  const topAttendees = attendeesData?.getTopSpaceEventAttendees ?? [];
  const topCities = citiesData?.getSpaceEventLocationsLeaderboard ?? [];
  const topCountries = countriesData?.getSpaceEventLocationsLeaderboard ?? [];

  return (
    <div className="page mx-auto py-7 px-4 md:px-0">
      <div className="flex flex-col gap-8 pb-20">
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              label="Events Created"
              value={statistics?.created_events}
              loading={statisticsLoading && !statistics}
            />
            <StatCard
              label="Ambassadors"
              value={statistics?.ambassadors}
              loading={statisticsLoading && !statistics}
            />
            <StatCard label="Hosts" value={allHosts.length} loading={hostsLoading && allHosts.length === 0} />
            <StatCard
              label="Total Attendees"
              value={statistics?.event_attendees}
              loading={statisticsLoading && !statistics}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-tertiary">
            <i aria-hidden="true" className="icon-info size-4 shrink-0" />
            <p>Only events created under this calendar count towards these stats.</p>
          </div>
        </section>

        <SubscribersCard
          change={subscriberChange}
          count={currentSubscribers}
          loading={subscribersLoading && subscriberSeries.length === 0}
          range={selectedRange}
          series={subscriberSeries}
          onRangeChange={setSelectedRange}
        />

        <Divider />

        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Leaderboard</h2>
            <p className="text-secondary">
              See your community&apos;s top contributors &amp; popular event locations, all in one place.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <HostsLeaderboardCard items={topHosts} loading={hostsLoading && topHosts.length === 0} />
            <AttendeesLeaderboardCard items={topAttendees} loading={attendeesLoading && topAttendees.length === 0} />
            <LocationsLeaderboardCard
              items={topCities}
              loading={citiesLoading && topCities.length === 0}
              title="Cities"
            />
            <LocationsLeaderboardCard
              items={topCountries}
              loading={countriesLoading && topCountries.length === 0}
              title="Countries"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function SubscribersCard({
  count,
  change,
  loading,
  range,
  series,
  onRangeChange,
}: {
  count: number;
  change: number | null;
  loading: boolean;
  range: SubscriberRange;
  series: Array<{ time: string; total: number }>;
  onRangeChange: (range: SubscriberRange) => void;
}) {
  return (
    <Card.Root>
      <Card.Content className="relative p-0">
        <div className="flex flex-col gap-3 border-b border-card-border px-4 py-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-tertiary">Subscribers</p>
            <p className="text-4xl font-semibold tracking-tight text-primary">{formatWholeNumber(count)}</p>
            {change !== null && (
              <p className={clsx('text-sm font-medium', change >= 0 ? 'text-success-500' : 'text-danger-500')}>
                {formatPercent(change)} ({range})
              </p>
            )}
          </div>

          <Segment
            className="self-start"
            items={SUBSCRIBER_RANGES.map((item) => ({ label: item, value: item }))}
            onSelect={(item) => onRangeChange(item.value as SubscriberRange)}
            selected={range}
            size="sm"
          />
        </div>

        <div className="h-70 px-2 pb-2 md:h-75">
          {loading ? (
            <div className="flex h-full items-center justify-center px-4 pb-2">
              <Skeleton animate className="h-full w-full rounded-md" />
            </div>
          ) : series.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-tertiary">
              <p>No subscriber data available yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 12, right: 14, bottom: 8, left: 6 }}>
                <defs>
                  <linearGradient id="community-subscriber-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(155, 124, 255, 0.18)" />
                    <stop offset="100%" stopColor="rgba(155, 124, 255, 0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  horizontal={false}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="4 4"
                  vertical={true}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 24, 0.96)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '6px 10px',
                  }}
                  cursor={{ stroke: 'rgba(155, 124, 255, 0.16)', strokeDasharray: '4 4' }}
                  formatter={(value: number) => [formatWholeNumber(value), 'Subscribers']}
                  itemStyle={{ color: 'rgba(255,255,255,0.92)' }}
                  labelFormatter={(label) => formatSubscriberTooltipLabel(String(label), range)}
                  labelStyle={{ color: 'rgba(255,255,255,0.64)' }}
                />
                <Area
                  activeDot={{ fill: CHART_STROKE, r: 5, stroke: '#17171d', strokeWidth: 2 }}
                  dataKey="total"
                  dot={(props) => renderLastChartDot(props, series.length)}
                  fill="url(#community-subscriber-gradient)"
                  isAnimationActive={false}
                  stroke={CHART_STROKE}
                  strokeWidth={2}
                  type="linear"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card.Content>
    </Card.Root>
  );
}

function HostsLeaderboardCard({ items, loading }: { items: HostRow[]; loading: boolean }) {
  return (
    <LeaderboardCard
      emptyCopy="No host leaderboard data yet."
      loading={loading}
      metricLabel="Events Hosted"
      title="Hosts"
    >
      {items.map((item, index) => (
        <LeaderboardPersonRow
          key={`${item.user_expanded?._id || item.user_expanded?.email || item.user_expanded?.name}-${index}`}
          metric={item.hosted_event_count}
          rank={index + 1}
          subtitle={formatRoleLabel(item.space_member?.role)}
          title={item.user_expanded.display_name || item.user_expanded.name || 'Unknown host'}
          user={item.user_expanded}
        />
      ))}
    </LeaderboardCard>
  );
}

function AttendeesLeaderboardCard({ items, loading }: { items: AttendeeRow[]; loading: boolean }) {
  return (
    <LeaderboardCard
      emptyCopy="No attendee leaderboard data yet."
      loading={loading}
      metricLabel="Events Attended"
      title="Attendees"
    >
      {items.map((item, index) => {
        const user = item.user_expanded || item.non_login_user;

        return (
          <LeaderboardPersonRow
            key={`${user?._id || user?.email || user?.name}-${index}`}
            metric={item.attended_event_count}
            rank={index + 1}
            subtitle={user?.email || user?.display_name || 'Community member'}
            title={user?.display_name || user?.name || 'Unknown attendee'}
            user={user}
          />
        );
      })}
    </LeaderboardCard>
  );
}

function LeaderboardCard({
  children,
  emptyCopy,
  loading,
  metricLabel,
  title,
}: React.PropsWithChildren<{
  emptyCopy: string;
  loading: boolean;
  metricLabel: string;
  title: string;
}>) {
  const hasItems = React.Children.count(children) > 0;

  return (
    <Card.Root className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-card-border bg-card/80 px-4 py-2.5 text-sm text-secondary">
        <p>{title}</p>
        <p>{metricLabel}</p>
      </div>

      <div>
        {loading ? (
          <div className="divide-y divide-card-border">
            {Array.from({ length: LEADERBOARD_LIMIT }).map((_, index) => (
              <LeaderboardPersonSkeleton key={index} />
            ))}
          </div>
        ) : hasItems ? (
          <div className="divide-y divide-card-border">{children}</div>
        ) : (
          <div className="px-4 py-6 text-sm text-tertiary">{emptyCopy}</div>
        )}
      </div>
    </Card.Root>
  );
}

function LeaderboardPersonRow({
  metric,
  rank,
  subtitle,
  title,
  user,
}: {
  metric: number;
  rank: number;
  subtitle: string;
  title: string;
  user?: {
    _id?: string | null;
    image_avatar?: string | null;
    new_photos_expanded?: Array<{
      _id?: string | null;
      bucket: string;
      key: string;
      type: string;
      url: string;
    } | null> | null;
  } | null;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <RankBadge rank={rank} />
      <Avatar className="border border-card-border" rounded="full" size="xl" src={userAvatar(user)} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-primary">{title}</p>
        <p className="truncate text-sm text-tertiary">{subtitle}</p>
      </div>
      <p className="w-14 shrink-0 text-right font-medium text-primary">{formatWholeNumber(metric)}</p>
    </div>
  );
}

function LocationsLeaderboardCard({
  items,
  loading,
  title,
}: {
  items: LocationRow[];
  loading: boolean;
  title: 'Cities' | 'Countries';
}) {
  const maxValue = React.useMemo(() => Math.max(...items.map((item) => item.total), 0), [items]);

  return (
    <Card.Root className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-card-border bg-card/80 px-4 py-2.5 text-sm text-secondary">
        <p>{title}</p>
        <p>Events</p>
      </div>

      {loading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: LOCATION_LIMIT }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton animate className="h-10 flex-1 rounded-sm" />
              <Skeleton animate className="h-5 w-10 rounded-sm" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-3 p-4">
          {items.map((item, index) => (
            <div key={`${item.city || item.country}-${index}`} className="flex items-center gap-3">
              <div className="relative min-w-0 flex-1 overflow-hidden rounded-sm px-3 py-2">
                <div
                  className={clsx(
                    'absolute inset-y-0 left-0 rounded-sm',
                    index === 0 ? 'bg-warning-500/20' : 'bg-primary/8',
                  )}
                  style={{ width: `${getLocationFillWidth(item.total, maxValue)}%` }}
                />
                <p
                  className={clsx(
                    'relative truncate text-sm font-medium',
                    index === 0 ? 'text-warning-300' : 'text-secondary',
                  )}
                >
                  {formatLocationLabel(item, title === 'Cities')}
                </p>
              </div>
              <p className="w-14 shrink-0 text-right font-medium text-primary">{formatWholeNumber(item.total)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 text-sm text-tertiary">No location data yet.</div>
      )}
    </Card.Root>
  );
}

function StatCard({ label, value, loading }: { label: string; value?: number | null; loading: boolean }) {
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
            <p className="text-lg font-semibold text-primary">{formatWholeNumber(value ?? 0)}</p>
            <p className="text-sm text-tertiary">{label}</p>
          </>
        )}
      </Card.Content>
    </Card.Root>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <div
      className={clsx(
        'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.18)]',
        getRankBadgeClassName(rank),
      )}
    >
      {rank}
    </div>
  );
}

function LeaderboardPersonSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton animate className="size-6 rounded-full" />
      <Skeleton animate className="size-10 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton animate className="h-4 w-32 rounded-sm" />
        <Skeleton animate className="h-3 w-24 rounded-sm" />
      </div>
      <Skeleton animate className="h-4 w-8 rounded-sm" />
    </div>
  );
}

function normalizeSubscriberSeries(series?: SubscriberPoint[]) {
  return (series || [])
    .map((item) => ({
      time: item._id,
      total: Math.round(item.total || 0),
    }))
    .sort((left, right) => new Date(left.time).getTime() - new Date(right.time).getTime());
}

function getSeriesChange(series: Array<{ total: number }>) {
  if (series.length < 2) return null;

  const latest = series[series.length - 1]?.total ?? 0;
  const previous = series[series.length - 2]?.total ?? 0;

  if (previous === 0) return null;

  return ((latest - previous) / previous) * 100;
}

function getSubscriberRangeWindow(range: SubscriberRange) {
  const end = new Date();
  const start = new Date(end);

  switch (range) {
    case '6M':
      start.setMonth(start.getMonth() - 6);
      break;
    case '1D':
      start.setDate(start.getDate() - 1);
      break;
    case '1W':
      start.setDate(start.getDate() - 7);
      break;
    case '1M':
      start.setMonth(start.getMonth() - 1);
      break;
    case '1Y':
      start.setFullYear(start.getFullYear() - 1);
      break;
    case 'All':
      start.setTime(0);
      break;
  }

  return { start, end };
}

function formatSubscriberTooltipLabel(value: string, range: SubscriberRange) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  switch (range) {
    case '6M':
      return format(date, 'MMM d, yyyy');
    case '1D':
      return format(date, 'MMM d, h:mm a');
    case '1W':
    case '1M':
      return format(date, 'MMM d, yyyy');
    case '1Y':
    case 'All':
      return format(date, 'MMM yyyy');
  }
}

function renderLastChartDot(
  props: { cx?: number; cy?: number; index?: number } | null | undefined,
  length: number,
) {
  if (!props || props.index !== length - 1 || props.cx == null || props.cy == null) {
    return null;
  }

  return <circle cx={props.cx} cy={props.cy} fill={CHART_STROKE} r={4} stroke="#17171d" strokeWidth={2} />;
}

function getRankBadgeClassName(rank: number) {
  switch (rank) {
    case 1:
      return 'border-[#6c5a22] bg-[linear-gradient(135deg,#8f6b22_0%,#f5e68f_45%,#7a5621_100%)] text-white';
    case 2:
      return 'border-[#53545b] bg-[linear-gradient(135deg,#5f6066_0%,#c9c9cf_45%,#515159_100%)] text-white';
    case 3:
      return 'border-[#6c4a38] bg-[linear-gradient(135deg,#7b5134_0%,#d6a57d_45%,#6d4934_100%)] text-white';
    default:
      return 'border-card-border bg-primary/8 text-tertiary';
  }
}

function formatRoleLabel(role?: SpaceRole | null) {
  switch (role) {
    case SpaceRoleEnum.Creator:
      return 'Creator';
    case SpaceRoleEnum.Admin:
      return 'Admin';
    case SpaceRoleEnum.Ambassador:
      return 'Ambassador';
    case SpaceRoleEnum.Subscriber:
      return 'Subscriber';
    case SpaceRoleEnum.Unsubscriber:
      return 'Unsubscriber';
    default:
      return 'Community member';
  }
}

function formatLocationLabel(item: LocationRow, includeCity: boolean) {
  if (includeCity && item.city) {
    return `${item.city}, ${item.country}`;
  }

  return item.country;
}

function getLocationFillWidth(value: number, maxValue: number) {
  if (maxValue <= 0) return 0;
  return Math.max((value / maxValue) * 100, 18);
}

function formatWholeNumber(value: number) {
  return Math.round(value).toLocaleString('en-US');
}

function formatPercent(value: number) {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}
