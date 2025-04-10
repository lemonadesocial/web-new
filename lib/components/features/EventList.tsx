import React from 'react';
import { groupBy } from 'lodash';
import { format, isAfter, isBefore } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Avatar, Badge, Card, Divider, Spacer } from '$lib/components/core';
import { Address, Event, SpaceTagBase, User } from '$lib/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { userAvatar } from '$lib/utils/user';
import { getEventPrice } from '$lib/utils/event';

export function EventList({
  events,
  loading,
  onSelect,
}: {
  events: Event[];
  loading?: boolean;
  tags?: SpaceTagBase[];
  onSelect?: (event: Event) => void;
}) {
  if (loading) return <EventListSkeleton />;

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(groupBy(events, ({ start }) => start)).map(([date, data]) => (
        <div key={date}>
          <p className="text-tertiary font-medium">
            <span className="text-primary">{format(date, 'MMM dd')}</span> {format(date, 'EEE')}
          </p>
          <Divider className="mt-2 mb-3" />

          {data.map((item) => (
            <div key={item._id} onClick={() => onSelect?.(item)}>
              <EventItem item={item} />
            </div>
          ))}
        </div>
      ))}
      <Spacer className="h-6" />
    </div>
  );
}

function EventItem({ item }: { item: Event }) {
  const users = [item.host_expanded, ...(item.visible_cohosts_expanded || [])];

  return (
    <div className="transition flex text-tertiary gap-4 hover:bg-primary/[.16] p-2 rounded-md cursor-pointer backdrop-blur-lg">
      <p>{format(item.start, 'h:mm a')}</p>
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-primary font-medium text-base md:text-lg">{item.title}</p>
        <div className="flex gap-2 items-center">
          <div className="flex -space-x-1 overflow-hidden p-1 min-w-fit">
            {users.map((p) => (
              <Avatar key={p?._id} src={userAvatar(p as User)} size="sm" className="ring-2 border-background" />
            ))}
          </div>

          <p className="font-medium text-sm md:text-base text-tertiary">By {users.map((p) => p?.name).join(',')}</p>
        </div>
      </div>
      <div>
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
          <SkeletonLine animate className="w-[96px] h-[16px] bg-card rounded-lg" />
          <Divider className="mt-3 mb-4" />

          <div className="flex flex-col gap-5">
            {data.map((item) => (
              <div key={item} className="transition flex gap-4 rounded-md">
                <SkeletonLine className="w-[64px] h-[20px] bg-card rounded-lg" />
                <div className="flex flex-col gap-2">
                  <SkeletonLine animate className="w-[360px] h-[20px] bg-card rounded-lg" />
                  <div className="flex gap-2">
                    <SkeletonLine className="size-[16px] bg-card rounded-lg" />
                    <SkeletonLine className="w-[120px] h-[16px] bg-card rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Spacer className="h-6" />
    </div>
  );
}

// ListEventCard

export function EventListCard({
  events,
  loading,
  tags = [],
  onSelect,
}: {
  events: Event[];
  loading?: boolean;
  tags?: SpaceTagBase[];
  onSelect?: (event: Event) => void;
}) {
  if (loading) return <EventListCardSkeleton />;

  return (
    <div className="flex flex-col">
      {Object.entries(groupBy(events, ({ start }) => start)).map(([date, data]) => (
        <div className="flex flex-col relative" key={date}>
          <div className="border-dashed border-l-2 border-l-[var(--color-divider)] absolute h-full left-1 top-2 z-10">
            <div className="size-2 backdrop-blur-lg -ml-[5px] absolute">
              <div className="size-2 rounded-full bg-quaternary" />
            </div>
          </div>

          <div className="ml-5">
            <p className="text-md text-tertiary font-medium">
              <span className="text-primary">{format(new Date(date), 'MMM dd ')}</span> {format(new Date(date), 'EEEE')}
            </p>
            <Spacer className="h-3" />

            <div className="flex flex-col gap-3">
              {data.map((item) => (
                <EventCardItem key={item._id} item={item} tags={tags} onClick={() => onSelect?.(item)} />
              ))}
            </div>
          </div>

          <Spacer className="h-6" />
        </div>
      ))}
      {/* <div className="flex flex-col relative"> */}
      {/*   <div className="border-dashed border-l-2 absolute h-full left-1 top-2 z-10"> */}
      {/*     <div className="size-2 bg-background -ml-[5px] absolute"> */}
      {/*       <div className="size-2 rounded-full bg-quaternary " /> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
      {/* <div className="ml-5 mt-0.5"> */}
      {/*   <p className="text-sm text-tertiary">No more events to see here!</p> */}
      {/* </div> */}
      {/* <Spacer className="h-6" /> */}
    </div>
  );
}

function EventCardItem({ item, tags = [], onClick }: { item: Event; tags?: SpaceTagBase[]; onClick?: () => void }) {
  const users = [item.host_expanded, ...(item.visible_cohosts_expanded || [])];

  return (
    <Card.Root as="button" onClick={onClick} key={`event_${item.shortid}`} className="flex flex-col gap-3">
      <Card.Content className="flex gap-6">
        <div className="text-tertiary flex-1 w-[173px] flex flex-col gap-2">
          <div>
            <div className="flex gap-2 text-sm md:text-base font-medium">
              {isBefore(new Date(), item.end) && isAfter(new Date(), item.start) && (
                <div className="flex gap-2 items-center">
                  <div className="size-1.5 bg-danger-400 rounded-full motion-safe:animate-pulse" />
                  <span className="text-danger-400 uppercase">Live</span>
                  <div className="size-0.5 bg-quaternary rounded-full" />
                </div>
              )}

              <p>{format(item.start, 'hh:mm a')}</p>
            </div>
            <p className="font-title text-lg md:text-xl font-semibold text-primary">{item.title}</p>
            <div className="flex gap-2 item-center">
              <div className="flex -space-x-1 overflow-hidden p-1 min-w-fit">
                {users.map((p) => (
                  <Avatar key={p?._id} src={userAvatar(p as User)} size="sm" className="outline outline-background" />
                ))}
              </div>

              <p className="font-medium text-tertiary text-sm md:text-base truncate">
                By {users.map((p) => p?.name).join(',')}
              </p>
            </div>
          </div>

          {!!getLocation(item.address) && (
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2">
                <i className="icon-location-outline size-4" />
                <span className="text-sm md:text-md">{getLocation(item.address)}</span>
              </div>
            </div>
          )}

          {!!tags.length && (
            <div className="flex gap-1.5 flex-wrap">
              {tags
                .filter((t) => t.targets?.includes(item._id))
                .map((t) => (
                  <Badge key={t._id} title={t.tag} color={t.color} className="truncate" />
                ))}
            </div>
          )}

          {getEventPrice(item) && (
            <Badge title={getEventPrice(item)} className="bg-success-500/[0.16] text-success-500" />
          )}
        </div>

        {!!item?.new_new_photos_expanded?.[0] && (
          <img
            className="aspect-square object-contain rounded-lg size-[90px] md:size-[120px]"
            src={generateUrl(item?.new_new_photos_expanded[0], {
              resize: { height: 120, width: 120, fit: 'cover' },
            })}
            loading="lazy"
            alt={item.title}
          />
        )}
      </Card.Content>
    </Card.Root>
  );
}

function EventListCardSkeleton() {
  return (
    <div className="flex flex-col">
      {Object.entries({ 1: [1, 2], 2: [1], 3: [1, 2, 3] }).map(([date, data]) => (
        <div className="flex flex-col relative" key={date}>
          <div className="border-dashed border-l-2 border-l-[var(--color-divider)] absolute h-full left-1 top-2 z-10">
            <div className="size-2 backdrop-blur-lg -ml-[5px] absolute">
              <div className="size-2 rounded-full bg-quaternary" />
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
    <Card.Root className="bg-transparent border">
      <Card.Content className="flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <SkeletonLine className="h-4 w-[64px] rounded-full bg-card" />
          <SkeletonLine animate className="h-[28px] w-full md:w-[400px] rounded" />

          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2">
              <SkeletonLine className="size-4 rounded-full bg-card" />
              <SkeletonLine className="h-4 w-[64px] rounded-full bg-card" />
            </div>

            <div className="inline-flex items-center gap-2">
              <SkeletonLine className="size-4 rounded-full bg-card" />
              <SkeletonLine className="h-4 w-[120px] rounded-full bg-card" />
            </div>
          </div>
        </div>
        <div className="size-[80px] md:size-[124px] bg-card rounded-lg"></div>
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

function getLocation(address?: Address | null) {
  let location = '';
  if (address?.city) location += address.city + ', ';
  if (address?.country) location += address.country;

  return location;
}
