import { groupBy } from 'lodash';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Avatar, Badge, Card, Divider, Spacer } from '$lib/components/core';
import { Event, SpaceTag, User } from '$lib/graphql/generated/backend/graphql';
import { userAvatar } from '$lib/utils/user';
import { getEventCohosts, getEventPrice } from '$lib/utils/event';
import { convertFromUtcToTimezone } from '$lib/utils/date';
import { useMe } from '$lib/hooks/useMe';
import React from 'react';
import { EventCardItem } from './EventCardItem';

export function EventList({
  events = [],
  loading,
  onSelect,
}: {
  events: Event[];
  loading?: boolean;
  tags?: SpaceTag[];
  onSelect?: (event: Event) => void;
}) {
  if (loading) return <EventListSkeleton />;
  if (!events.length) return <EmptyComp />;

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(
        groupBy(events, ({ start, timezone }) => format(convertFromUtcToTimezone(start, timezone), 'yyyy-MM-dd')),
      ).map(([date, data]) => {
        return (
          <div key={date}>
            {' '}
            <p className="text-tertiary font-medium">
              <span className="text-primary">{format(new Date(`${date}T12:00:00`), 'MMM dd')}</span>{' '}
              {format(new Date(`${date}T12:00:00`), 'EEE')}
            </p>
            <Divider className="mt-2 mb-3" />
            {data.map((item) => (
              <button
                key={item._id}
                type="button"
                className="w-full text-left"
                onClick={() => {
                  if (item.external_url) window.open(item.external_url);
                  else onSelect?.(item);
                }}
              >
                <EventItem item={item} />
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function EventItem({ item }: { item: Event }) {
  const users = getEventCohosts(item);

  return (
    <div className="transition flex text-tertiary gap-4 hover:bg-primary/[.16] p-2 rounded-md cursor-pointer backdrop-blur-lg">
      <p>{format(convertFromUtcToTimezone(item.start, item.timezone as string), 'hh:mm a')}</p>
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-primary font-medium text-base md:text-lg">{item.title}</p>
        <div className="flex gap-2 items-center">
          {item.external_url && item.external_hostname ? (
            <p className="font-medium text-sm md:text-base text-tertiary">{`By ${item.external_hostname}`}</p>
          ) : (
            !!users.length && (
              <>
                <div className="flex -space-x-1 overflow-hidden p-1 min-w-fit">
                  {users.map((p) => (
                    <Avatar key={p?._id} src={userAvatar(p as User)} size="sm" className="outline outline-background" />
                  ))}
                </div>

                <p className="font-medium text-sm md:text-base text-tertiary">
                  By{' '}
                  {users
                    .map((p) => p?.name)
                    .join(', ')
                    .replace(/,(?=[^,]*$)/, ' & ')}
                </p>
              </>
            )
          )}
        </div>
      </div>
      <div>
        {item.external_url && <Badge title="External" className="bg-quaternary text-tertiary" />}

        {getEventPrice(item) && (
          <Badge title={getEventPrice(item)} className="bg-success-500/[0.16] text-success-500" />
        )}
      </div>
    </div>
  );
}

function EventListSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {Object.entries({ 1: [1, 2], 2: [1], 3: [1, 2, 3] }).map(([date, data]) => (
        <div key={date}>
          <SkeletonLine animate className="w-24 h-4 bg-card rounded-lg" />
          <Divider className="mt-3 mb-4" />

          <div className="flex flex-col gap-5">
            {data.map((item) => (
              <div key={item} className="transition flex gap-4 rounded-md">
                <SkeletonLine className="w-16 h-5 bg-card rounded-lg" />
                <div className="flex flex-col gap-2">
                  <SkeletonLine animate className="w-90 h-5 bg-card rounded-lg" />
                  <div className="flex gap-2">
                    <SkeletonLine className="size-4 bg-card rounded-lg" />
                    <SkeletonLine className="w-30 h-4 bg-card rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ListEventCard

export function EventListCard({
  events = [],
  loading,
  tags = [],
  onSelect,
}: {
  events: Event[];
  loading?: boolean;
  tags?: SpaceTag[];
  onSelect?: (event: Event) => void;
}) {
  const me = useMe();

  if (!loading && !events.length) return <EmptyComp />;

  const list = Object.entries(
    groupBy(events, ({ start, timezone }) => format(convertFromUtcToTimezone(start, timezone), 'yyyy-MM-dd')),
  );
  return (
    <div className="flex flex-col">
      {list.map(([date, data], idx) => {
        return (
          <div className="flex" key={date}>
            <div
              className={clsx(
                'border-l-2 border-dashed border-l-[var(--color-divider)] pt-2 relative',
                idx === 0 && 'mt-2 pt-0!',
              )}
            >
              <div className="size-2 backdrop-blur-lg rounded-full -ml-1.25 absolute">
                <div className="size-2 rounded-full bg-(--color-divider)" />
              </div>
            </div>

            <div className="ml-4 w-full">
              <p className="text-md text-tertiary font-medium">
                <span className="text-primary">{format(new Date(`${date}T12:00:00`), 'MMM dd ')}</span>{' '}
                {format(new Date(`${date}T12:00:00`), 'EEEE')}{' '}
              </p>
              <Spacer className="h-3" />

              <div className="flex flex-col gap-3">
                {data.map((item) => (
                  <EventCardItem
                    key={item._id}
                    item={item}
                    tags={tags}
                    me={me}
                    onClick={() => {
                      if (item.external_url) window.open(item.external_url);
                      else onSelect?.(item);
                    }}
                  />
                ))}
                {idx < list.length - 1 && <div className="h-3" />}
              </div>
            </div>
          </div>
        );
      })}

      {loading && (
        <>
          {!!list.length && <Spacer className="h-3" />}
          <EventListCardSkeleton />
        </>
      )}
    </div>
  );
}

function EventListCardSkeleton() {
  return (
    <div className="flex flex-col">
      {Object.entries({ 1: [1, 2], 2: [1], 3: [1, 2, 3] }).map(([date, data], idx) => (
        <div className="flex" key={date}>
          <div
            className={clsx(
              'border-l-2 border-dashed border-l-[var(--color-divider)] pt-2 relative',
              idx === 0 && 'mt-2 pt-0!',
            )}
          >
            <div className="size-2 backdrop-blur-lg rounded-full -ml-1.25 absolute">
              <div className="size-2 rounded-full bg-(--color-divider)" />
            </div>
          </div>

          <div className="ml-4 w-full">
            <div className="flex flex-col gap-4">
              <SkeletonLine animate className="mt-1 h-4 w-24 rounded-full" />

              <div className="flex flex-col gap-4">
                {data.map((item) => (
                  <EventCardSkeleton key={item} />
                ))}
              </div>
              {idx < 3 && <div className="h-3" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <Card.Root className="bg-transparent border">
      <Card.Content className="flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <SkeletonLine className="h-4 w-16 rounded-full bg-card" />
          <SkeletonLine animate className="h-7 w-full md:w-100 rounded" />

          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2">
              <SkeletonLine className="size-4 rounded-full bg-card" />
              <SkeletonLine className="h-4 w-16 rounded-full bg-card" />
            </div>

            <div className="inline-flex items-center gap-2">
              <SkeletonLine className="size-4 rounded-full bg-card" />
              <SkeletonLine className="h-4 w-30 rounded-full bg-card" />
            </div>
          </div>
        </div>
        <div className="size-20 md:size-31 bg-card rounded-lg"></div>
      </Card.Content>
    </Card.Root>
  );
}

function SkeletonLine({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <div
      className={twMerge(
        clsx(animate && 'animate-skeleton bg-linear-to-r from-tertiary/4 via-tertiary/10 to-tertiary/4'),
        className,
      )}
      style={{ backgroundSize: '200% 100%' }}
    />
  );
}

function EmptyComp() {
  return (
    <div className="flex flex-col items-center flex-1 gap-5 mt-10 mb-20">
      <i aria-hidden="true" className="icon-dashboard w-46 h-46 text-primary/16 blur-md" />
      <div className="text-center">
        <p className="font-title text-tertiary font-semibold! text-xl">No Upcoming Events</p>
        <p className="text-tertiary">Subscribe to keep up with new events.</p>
      </div>
    </div>
  );
}
