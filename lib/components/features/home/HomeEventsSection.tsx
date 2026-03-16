'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';

import { Button, Segment } from '$lib/components/core';
import { EventCardItem } from '$lib/components/features/EventList';
import {
  Event,
  GetSpacesDocument,
  GetUpcomingEventsDocument,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';
import { useQuery } from '$lib/graphql/request';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { generateUrl } from '$lib/utils/cnd';
import { userAvatar } from '$lib/utils/user';

import { PageCardItem, PageCardItemSkeleton } from '../../../../app/[domain]/(default)/shared';

export function HomeEventsSection() {
  const me = useMe();
  const router = useRouter();
  const [tab, setTab] = React.useState<'events' | 'communities'>('events');

  const { data: eventsData, loading: eventsLoading } = useQuery(GetUpcomingEventsDocument, {
    variables: { user: me!._id, limit: 12, skip: 0 },
    skip: !me?._id,
  });

  const { data: spacesData, loading: spacesLoading } = useQuery(GetSpacesDocument, {
    variables: { with_my_spaces: true, roles: [SpaceRole.Creator, SpaceRole.Admin] },
    fetchPolicy: 'cache-and-network',
    skip: !me?._id || tab !== 'communities',
  });

  const events = (eventsData?.events ?? []) as Event[];
  const spaces = (spacesData?.listSpaces || []) as Space[];

  const getSpaceImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.personal) src = userAvatar(me);
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  return (
    <section
      className="w-full p-4 md:p-6 xl:p-7 bg-background rounded-xl"
    >
      <header
        className="flex items-center justify-between w-full"
        style={{ height: 32, minHeight: 32 }}
      >
        <Segment
          items={[
            { label: 'Events', value: 'events' },
            { label: 'Communities', value: 'communities' },
          ]}
          selected={tab}
          onSelect={(item) => setTab(item.value as 'events' | 'communities')}
          size="sm"
          className="rounded-[var(--radius-sm)]"
        />
        <div
          className="flex items-center gap-2"
          style={{ gap: 8 }}
        >
          {tab === 'events' && (
            <>
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-sm text-sm font-medium text-tertiary bg-primary/8 hover:text-primary hover:bg-primary/12 transition"
              >
                View All
                <i className="icon-chevron-right size-4" aria-hidden />
              </Link>
              <Button
                variant="tertiary"
                size="sm"
                className="size-8 p-2"
                iconLeft="icon-plus"
                onClick={() => router.push('/create/event')}
                title="New Event"
              />
            </>
          )}
          {tab === 'communities' && (
            <>
              <Link
                href="/communities"
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-sm text-sm font-medium text-tertiary bg-primary/8 hover:text-primary hover:bg-primary/12 transition"
              >
                View All
                <i className="icon-chevron-right size-4" aria-hidden />
              </Link>
              <Button
                variant="tertiary"
                size="sm"
                className="size-8 p-2"
                iconLeft="icon-plus"
                onClick={() => router.push('/create/community')}
                title="New Community"
              />
            </>
          )}
        </div>
      </header>

      {tab === 'events' && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 w-full gap-4 mt-5 overflow-y-auto"
          style={{
            gap: 16,
            marginTop: 20,
          }}
        >
          {eventsLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[168px] rounded-lg bg-overlay-secondary animate-pulse"
                style={{ minHeight: 168 }}
              />
            ))}
          {!eventsLoading && events.length === 0 && (
            <div
              className="col-span-full flex flex-col items-center justify-center py-12 text-center text-tertiary text-sm"
              style={{ minHeight: 168 }}
            >
              <i className="icon-ticket size-8 mb-2 opacity-56" aria-hidden />
              <p>No upcoming events</p>
            </div>
          )}
          {!eventsLoading &&
            events.map((item) => (
              <EventCardItem
                key={item._id}
                item={item}
                me={me}
                onClick={() => router.push(`/e/${item.shortid}`)}
                onManage={
                  [item.host, ...(item.cohosts || [])].includes(me?._id)
                    ? (e) => {
                        e.stopPropagation();
                        router.push(`/e/manage/${item.shortid}`);
                      }
                    : undefined
                }
              />
            ))}
        </div>
      )}

      {tab === 'communities' && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5 gap-4 mt-5 overflow-y-auto"
          style={{
            gap: 16,
            marginTop: 20,
          }}
        >
          {spacesLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <PageCardItemSkeleton key={i} view={isMobile ? 'list-item' : 'card'} />
            ))}
          {!spacesLoading && spaces.length === 0 && (
            <div
              className="col-span-full flex flex-col items-center justify-center py-12 text-center text-tertiary text-sm"
              style={{ minHeight: 168 }}
            >
              <i className="icon-community size-8 mb-2 opacity-56" aria-hidden />
              <p>No communities yet</p>
            </div>
          )}
          {!spacesLoading &&
            spaces
              .sort((a, _) => (a.personal ? -1 : 1))
              .map((item) => (
                <PageCardItem
                  key={item._id}
                  title={item.title}
                  subtitle={`${item.followers_count || 0} Subscribers`}
                  view={isMobile ? 'list-item' : 'card'}
                  onClick={() => router.push(`/s/manage/${item.slug || item._id}`)}
                  image={{
                    src: getSpaceImageSrc(item),
                    class: twMerge('rounded-sm', item.personal && 'rounded-full'),
                  }}
                />
              ))}
        </div>
      )}
    </section>
  );
}
