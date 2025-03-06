import React from 'react';
import { groupBy } from 'lodash';
import { format, isAfter, isBefore } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Badge, Card, Spacer } from '$lib/components/core';
import { Address, Event, SpaceTagBase } from '$lib/generated/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { getTicketCost } from '$lib/utils/event';

// export function EventList({ events, loading }: { events: Event[]; loading?: boolean }) {
//   return <></>;
// }

export function EventListCard({
  events,
  loading,
  tags = [],
}: {
  events: Event[];
  loading?: boolean;
  tags?: SpaceTagBase[];
}) {
  if (loading) return <EventListCardSkeleton />;

  return (
    <div className="flex flex-col">
      {Object.entries(groupBy(events, ({ start }) => start)).map(([date, data]) => (
        <div className="flex flex-col relative" key={date}>
          <div className="border-l border-dashed border-l-2 absolute h-full left-1 top-2 z-10">
            <div className="size-2 bg-background -ml-[5px] absolute">
              <div className="size-2 rounded-full bg-tertiary/[.24]" />
            </div>
          </div>

          <div className="ml-5">
            <p className="text-md text-tertiary/[.56] font-medium">
              <span className="text-tertiary">{format(new Date(date), 'MMM dd ')}</span>{' '}
              {format(new Date(date), 'EEEE')}
            </p>
            <Spacer className="h-3" />

            <div className="flex flex-col gap-3">
              {data.map((item) => (
                <EventCardItem key={item._id} item={item} tags={tags} />
              ))}
            </div>
          </div>

          <Spacer className="h-6" />
        </div>
      ))}
      <div className="flex flex-col relative">
        <div className="border-l border-dashed border-l-2 absolute h-full left-1 top-2 z-10">
          <div className="size-2 bg-background -ml-[5px] absolute">
            <div className="size-2 rounded-full bg-tertiary/[.24] " />
          </div>
        </div>
      </div>
      <div className="ml-5 mt-0.5">
        <p className="text-sm text-tertiary/[.56]">No more events to see here!</p>
      </div>
      <Spacer className="h-6" />
    </div>
  );
}

function EventCardItem({ item, tags = [] }: { item: Event; tags?: SpaceTagBase[] }) {
  const defaultTicketType = item.event_ticket_types?.find((p) => p.default);
  return (
    <Card key={`event_${item.shortid}`}>
      <div className="flex gap-6">
        <div className="text-tertiary/[.56] flex-1 flex flex-col gap-2">
          <div>
            <div className="flex gap-2 font-medium">
              {isBefore(new Date(), item.end) && isAfter(new Date(), item.start) && (
                <div className="flex gap-2 items-center">
                  <div className="size-1.5 bg-danger-400 rounded-full motion-safe:animate-pulse" />
                  <span className="text-danger-400 uppercase">Live</span>
                  <div className="size-0.5 bg-tertiary/[.24] rounded-full" />
                </div>
              )}

              <p>{format(item.start, 'hh:mm a')}</p>
            </div>
            <p className="font-title text-xl font-semibold text-tertiary">{item.title}</p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2">
              <i className="icon-location-outline size-4" />
              <span className="text-md">{getLocattion(item.address)}</span>
            </div>
          </div>

          {tags.length && (
            <div className="flex gap-1.5 flex-wrap">
              {tags
                .filter((t) => t.targets?.includes(item._id))
                .map((t) => (
                  <Badge key={t._id} title={t.tag} color={t.color} />
                ))}
            </div>
          )}

          {defaultTicketType && (
            <Badge title={getTicketCost(defaultTicketType)} className="bg-success-500/[0.16] text-success-500" />
          )}
        </div>

        {!!item?.new_new_photos_expanded?.[0] && (
          <img
            className="aspect-square object-contain rounded-lg w-[120px] h-[120px]"
            src={generateUrl(item?.new_new_photos_expanded[0], {
              resize: { height: 120, width: 120, fit: 'cover' },
            })}
            alt={item.title}
          />
        )}
      </div>
    </Card>
  );
}

function EventListCardSkeleton() {
  return (
    <div className="flex flex-col">
      {Object.entries({ 1: [1, 2], 2: [1], 3: [1, 2, 3] }).map(([date, data]) => (
        <div className="flex flex-col relative" key={date}>
          <div className="border-l border-dashed border-l-2 absolute h-full left-1 top-2 z-10">
            <div className="size-2 bg-background -ml-[5px] absolute">
              <div className="size-2 rounded-full bg-tertiary/[.24]" />
            </div>
          </div>
          <div className="ml-5 mt-1">
            <SkeletonLine animate className="h-4 w-[96px] rounded-full" />
            <Spacer className="h-3" />

            <div className="flex flex-col gap-4">
              {data.map((item) => (
                <EventCardSkeleton key={item} />
              ))}
            </div>

            <Spacer className="h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <Card className="bg-transparent border">
      <div className="flex">
        <div className="text-tertiary/[.56] flex-1 flex flex-col gap-4">
          <SkeletonLine className="h-4 w-[64px] rounded-full bg-tertiary/[.04]" />
          <SkeletonLine animate className="h-[28px] w-[400px] rounded" />

          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2">
              <SkeletonLine className="size-4 rounded-full bg-tertiary/[.04]" />
              <SkeletonLine className="h-4 w-[64px] rounded-full bg-tertiary/[.04]" />
            </div>

            <div className="inline-flex items-center gap-2">
              <SkeletonLine className="size-4 rounded-full bg-tertiary/[.04]" />
              <SkeletonLine className="h-4 w-[120px] rounded-full bg-tertiary/[.04]" />
            </div>
          </div>
        </div>
        <div className="size-[124px] bg-tertiary/[.04] rounded-lg"></div>
      </div>
    </Card>
  );
}

function SkeletonLine({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <div
      className={twMerge(
        clsx(
          animate && 'animate-skeleton bg-linear-to-r from-tertiary/[0.04] via-tertiary/[.08] to-tertiary/[0.04]',
          className,
        ),
      )}
      style={{ backgroundSize: '200% 100%' }}
    />
  );
}

function getLocattion(address?: Address | null) {
  let location = '';
  if (address?.city) location += address.city + ', ';
  if (address?.country) location += address.country;
  else location = 'Unknow';

  return location;
}
