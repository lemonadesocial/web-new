import React from 'react';
import { groupBy } from 'lodash';
import { format, isAfter, isBefore } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Avatar, Badge, Card, Divider, Spacer } from '$lib/components/core';
import { Address, Event, SpaceTagBase } from '$lib/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { getTicketCost } from '$lib/utils/event';

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
          <p className="text-tertiary/[.56] font-medium">
            <span className="text-tertiary">{format(date, 'MMM dd')}</span> {format(date, 'EEE')}
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
  const defaultTicketType = item.event_ticket_types?.find((p) => p.default);
  const users = [item.host_expanded, ...(item.visible_cohosts_expanded || [])];

  return (
    <div className="transition flex text-tertiary/[.56] gap-4 hover:bg-tertiary/[.16] p-2 rounded-md cursor-pointer">
      <p>{format(item.start, 'h:mm a')}</p>
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-tertiary font-medium text-lg">{item.title}</p>
        <div className="flex gap-2 items-center">
          {!!users.filter((p) => p?.image_avatar).length && (
            <div className="flex -space-x-1 overflow-hidden p-1">
              {users
                .filter((p) => p?.image_avatar)
                .map((p) => (
                  <Avatar
                    key={p?._id}
                    src={generateUrl(p?.image_avatar)}
                    size="sm"
                    className="ring-2 border-background"
                  />
                ))}
            </div>
          )}

          <p className="font-medium text-sm text-tertiary/[.56]">By {users.map((p) => p?.name).join(',')}</p>
        </div>
      </div>
      <div>
        {defaultTicketType && (
          <Badge title={getTicketCost(defaultTicketType)} className="bg-success-500/[0.16] text-success-500" />
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
          <SkeletonLine animate className="w-[96px] h-[16px] bg-tertiary/[.04] rounded-lg" />
          <Divider className="mt-3 mb-4" />

          <div className="flex flex-col gap-5">
            {data.map((item) => (
              <div key={item} className="transition flex gap-4 rounded-md">
                <SkeletonLine className="w-[64px] h-[20px] bg-tertiary/[.04] rounded-lg" />
                <div className="flex flex-col gap-2">
                  <SkeletonLine animate className="w-[360px] h-[20px] bg-tertiary/[.04] rounded-lg" />
                  <div className="flex gap-2">
                    <SkeletonLine className="size-[16px] bg-tertiary/[.04] rounded-lg" />
                    <SkeletonLine className="w-[120px] h-[16px] bg-tertiary/[.04] rounded-lg" />
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
          <div className="border-dashed border border-l-2 absolute h-full left-1 top-2 z-10">
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
                <EventCardItem key={item._id} item={item} tags={tags} onClick={() => onSelect?.(item)} />
              ))}
            </div>
          </div>

          <Spacer className="h-6" />
        </div>
      ))}
      <div className="flex flex-col relative">
        <div className="border-dashed border-l-2 absolute h-full left-1 top-2 z-10">
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

function EventCardItem({ item, tags = [], onClick }: { item: Event; tags?: SpaceTagBase[]; onClick?: () => void }) {
  const defaultTicketType = item.event_ticket_types?.find((p) => p.default);
  const users = [item.host_expanded, ...(item.visible_cohosts_expanded || [])];

  return (
    <Card.Root as="button" onClick={onClick} key={`event_${item.shortid}`} className="flex flex-col gap-3">
      <Card.Content className="flex gap-6">
        <div className="text-tertiary/56 flex-1 flex flex-col gap-2">
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
            <div className="flex gap-2 item-center">
              {!!users.filter((p) => p?.image_avatar).length && (
                <div className="flex -space-x-1 overflow-hidden p-1">
                  {users
                    .filter((p) => p?.image_avatar)
                    .map((p) => (
                      <Avatar
                        key={p?._id}
                        src={generateUrl(p?.image_avatar)}
                        size="sm"
                        className="ring-2 border-background"
                      />
                    ))}
                </div>
              )}

              <p className="font-medium text-tertiary/[.56]">By {users.map((p) => p?.name).join(',')}</p>
            </div>
          </div>

          {!!getLocation(item.address) && (
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2">
                <i className="icon-location-outline size-4" />
                <span className="text-md">{getLocation(item.address)}</span>
              </div>
            </div>
          )}

          {!!tags.length && (
            <div className="flex gap-1.5 flex-wrap">
              {tags
                .filter((t) => t.targets?.includes(item._id))
                .map((t) => (
                  <Badge key={t._id} title={t.tag} color={t.color} />
                ))}
            </div>
          )}

          {!!defaultTicketType && (
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
      </Card.Content>
    </Card.Root>
  );
}

function EventListCardSkeleton() {
  return (
    <div className="flex flex-col">
      {Object.entries({ 1: [1, 2], 2: [1], 3: [1, 2, 3] }).map(([date, data]) => (
        <div className="flex flex-col relative" key={date}>
          <div className="border-dashed border-l-2 absolute h-full left-1 top-2 z-10">
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
    <Card.Root className="bg-transparent border">
      <Card.Content className="flex">
        <div className="flex-1 flex flex-col gap-4">
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
      </Card.Content>
    </Card.Root>
  );
}

function SkeletonLine({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <div
      className={twMerge(
        clsx(animate && 'animate-skeleton bg-linear-to-r from-tertiary/[0.04] via-tertiary/[.1] to-tertiary/[0.04]'),
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
