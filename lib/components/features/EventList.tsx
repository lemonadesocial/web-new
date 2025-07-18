import { groupBy } from 'lodash';
import { format, isAfter, isBefore } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Avatar, Badge, Card, Divider, Spacer } from '$lib/components/core';
import { Address, Event, SpaceTag, User } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { userAvatar } from '$lib/utils/user';
import { getEventCohosts, getEventPrice } from '$lib/utils/event';
import { convertFromUtcToTimezone, formatWithTimezone } from '$lib/utils/date';

export function EventList({
  events,
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
        groupBy(events, ({ start, timezone }) => formatWithTimezone(new Date(start), 'yyyy-MM-dd', timezone)),
      ).map(([date, data]) => {
        const timezone = data?.[0]?.timezone;
        return (
          <div key={date}>
            <p className="text-tertiary font-medium">
              <span className="text-primary">{formatWithTimezone(new Date(date), 'MMM dd', timezone)}</span>{' '}
              {formatWithTimezone(new Date(date), 'EEE', timezone)}
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
        );
      })}
      <Spacer className="h-6" />
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

export function EventListCard({
  events,
  loading,
  tags = [],
  onSelect,
}: {
  events: Event[];
  loading?: boolean;
  tags?: SpaceTag[];
  onSelect?: (event: Event) => void;
}) {
  if (loading) return <EventListCardSkeleton />;
  if (!events.length) return <EmptyComp />;
  return (
    <div className="flex flex-col">
      {Object.entries(
        groupBy(events, ({ start, timezone }) => formatWithTimezone(new Date(start), 'yyyy-MM-dd', timezone)),
      ).map(([date, data]) => {
        const timezone = data?.[0]?.timezone;
        return (
          <div className="flex flex-col relative" key={date}>
            <div className="border-dashed border-l-2 border-l-[var(--color-divider)] absolute h-full left-1 top-2 z-10">
              <div className="size-2 backdrop-blur-lg -ml-[5px] absolute">
                <div className="size-2 rounded-full bg-quaternary" />
              </div>
            </div>

            <div className="ml-5">
              <p className="text-md text-tertiary font-medium">
                <span className="text-primary">{formatWithTimezone(new Date(date), 'MMM dd ', timezone)}</span>{' '}
                {formatWithTimezone(new Date(date), 'EEEE', timezone)}
              </p>
              <Spacer className="h-3" />

              <div className="flex flex-col gap-3">
                {data.map((item) => (
                  <EventCardItem
                    key={item._id}
                    item={item}
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
        );
      })}
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

function EventCardItem({ item, tags = [], onClick }: { item: Event; tags?: SpaceTag[]; onClick?: () => void }) {
  const users = getEventCohosts(item);

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

              <p>{format(convertFromUtcToTimezone(item.start, item.timezone as string), 'hh:mm a')}</p>
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
                      .map((p) => p.display_name || p.name)
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
