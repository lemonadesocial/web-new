import React from 'react';
import { groupBy, uniqBy } from 'lodash';
import { differenceInHours, format, isAfter, isBefore, isSameDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { toZonedTime } from 'date-fns-tz';

import { Avatar, Badge, Button, Card, Divider, Spacer } from '$lib/components/core';
import { Address, Event, SpaceTag, User } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { userAvatar } from '$lib/utils/user';
import { getEventPrice } from '$lib/utils/event';
import { formatWithTimezone } from '$lib/utils/date';
import { useMe } from '$lib/hooks/useMe';

type EventListProps = {
  events: Event[];
  loading?: boolean;
  tags?: SpaceTag[];
  onSelect?: (event: Event) => void;
  ownEvent?: boolean;
};

export function EventList({ events, loading, onSelect }: EventListProps) {
  if (loading) return <EventListSkeleton />;
  if (!events.length) return <EmptyComp />;

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(groupBy(events, ({ start }) => format(new Date(start), 'yyyy-MM-dd'))).map(([date, data]) => (
        <div key={date}>
          <p className="text-tertiary font-medium">
            <span className="text-primary">{format(date, 'MMM dd')}</span> {format(date, 'EEE')}
          </p>
          <Divider className="mt-2 mb-3" />

          {data.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                if (item.external_url) window.open(item.external_url);
                else onSelect?.(item);
              }}
            >
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
  const users = uniqBy([item.host_expanded, ...(item.visible_cohosts_expanded || [])], (u) => u?._id);

  return (
    <div className="transition flex text-tertiary gap-4 hover:bg-primary/[.16] p-2 rounded-md cursor-pointer backdrop-blur-lg">
      <EventDateBlock event={item} />
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-primary font-medium text-base md:text-lg">{item.title}</p>
        <div className="flex gap-2 items-center">
          {item.external_url && item.external_hostname ? (
            <p className="font-medium text-sm md:text-base text-tertiary">{`By ${item.external_hostname}`}</p>
          ) : (
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

export function EventListCard({ events, loading, tags = [], onSelect, ownEvent }: EventListProps) {
  if (loading) return <EventListCardSkeleton />;
  if (!events.length) return <EmptyComp />;
  return (
    <div className="flex flex-col">
      {Object.entries(groupBy(events, ({ start }) => format(new Date(start), 'yyyy-MM-dd'))).map(([date, data]) => (
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
                <EventCardItem
                  key={item._id}
                  item={item}
                  ownEvent={ownEvent}
                  tags={tags}
                  onClick={() => {
                    if (item.external_url) window.open(item.external_url);
                    else onSelect?.(item);
                  }}
                />
              ))}
            </div>
          </div>

          <Spacer className="h-6" />
        </div>
      ))}
    </div>
  );
}

function EventCardItem({
  item,
  tags = [],
  ownEvent,
  onClick,
}: {
  item: Event;
  tags?: SpaceTag[];
  onClick?: () => void;
  ownEvent?: boolean;
}) {
  const me = useMe();
  const users = uniqBy([item.host_expanded, ...(item.visible_cohosts_expanded || [])], (u) => u?._id);
  const hosting = users.find((u) => u?._id === me?._id);

  return (
    <Card.Root as="button" onClick={onClick} key={`event_${item.shortid}`} className="flex flex-col gap-3">
      <Card.Content className="flex gap-6">
        <div className="text-tertiary flex-1 w-[173px] flex flex-col gap-2">
          <div>
            <div className="flex gap-2 text-sm items-center md:text-base font-medium">
              {isBefore(new Date(), item.end) && isAfter(new Date(), item.start) && (
                <div className="flex gap-2 items-center">
                  <div className="size-1.5 bg-danger-400 rounded-full motion-safe:animate-pulse" />
                  <span className="text-danger-400 uppercase">Live</span>
                  <div className="size-0.5 bg-quaternary rounded-full" />
                </div>
              )}

              <EventDateBlock event={item} />
            </div>
            <p className="font-title text-lg md:text-xl font-semibold text-primary">{item.title}</p>

            <div className="flex gap-2 item-center">
              {item.external_url && item.external_hostname ? (
                <p className="font-medium text-tertiary text-sm md:text-base truncate">
                  {`By ${item.external_hostname}`}
                </p>
              ) : (
                <>
                  <div className="flex -space-x-1 overflow-hidden p-1 min-w-fit">
                    {users.map((p) => (
                      <Avatar
                        key={p?._id}
                        src={userAvatar(p as User)}
                        size="sm"
                        className="outline outline-background"
                      />
                    ))}
                  </div>

                  <p className="font-medium text-tertiary text-sm md:text-base truncate">
                    By{' '}
                    {users
                      .map((p) => p?.name)
                      .join(', ')
                      .replace(/,(?=[^,]*$)/, ' & ')}
                  </p>
                </>
              )}
            </div>
          </div>

          {!!getLocation(item.address) && (
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2">
                <i className="icon-location-outline size-4" />
                <span className="text-sm md:text-md truncate">{getLocation(item.address)}</span>
              </div>
            </div>
          )}

          {item.external_url && <Badge className="bg-quaternary text-tertiary" title="External" />}

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

          {ownEvent && (
            <div>
              <Button size="xs" variant="tertiary-alt">
                Check In
              </Button>
            </div>
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
  const location = [];
  if (address?.city) location.push(address.city);
  if (address?.country) location.push(address.country);

  return location.join(', ');
}

function EmptyComp() {
  return (
    <div className="flex flex-col items-center flex-1 gap-5 mt-10 mb-20">
      <i className="icon-dashboard w-[184px] h-[184px] text-primary/16 blur-md" />
      <div className="text-center">
        <p className="font-title text-tertiary font-semibold! text-xl">No Upcoming Events</p>
        <p className="text-tertiary">Subscribe to keep up with new events.</p>
      </div>
    </div>
  );
}

function EventDateBlock({ event }: { event: Event }) {
  const startDate = event.start;
  const localTimeLabel = format(new Date(event.start), 'hh:mm a');
  const eventTimezone = event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // If the event is in a different timezone, we need to show the event in both the local timezone and the event timezone
  if (eventTimezone !== localTimezone) {
    const eventDate = toZonedTime(startDate, eventTimezone);
    const timeDiffInHours = Math.abs(differenceInHours(new Date(startDate), eventDate));

    if (timeDiffInHours >= 1) {
      const eventTimeLabel = formatWithTimezone(eventDate, 'hh:mm a OOO', eventTimezone);
      const eventDateLabel = formatWithTimezone(eventDate, 'MMM d', eventTimezone);
      // If the event date is not the same as the local date, we need to show the event date
      // Otherwise, we can just show the time
      const showDate = !isSameDay(new Date(startDate), eventDate);
      const eventDisplay = showDate ? `${eventDateLabel}, ${eventTimeLabel}` : eventTimeLabel;

      return (
        <>
          <p>{localTimeLabel}</p>
          <p className="text-warning-300">{eventDisplay}</p>
        </>
      );
    }
  }

  return <p>{localTimeLabel}</p>;
}
