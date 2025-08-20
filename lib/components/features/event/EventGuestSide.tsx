'use client';
import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { Event, GetEventDocument, GetEventQuery } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { Badge, Button, Spacer } from '$lib/components/core';
import { EDIT_KEY, generateUrl } from '$lib/utils/cnd';
import { getEventCohosts, hosting, isAttending } from '$lib/utils/event';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';

import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import { randomEventDP } from '$lib/utils/user';

import { AboutSection } from './AboutSection';
import { LocationSection } from './LocationSection';
import { SubEventSection } from './SubEventSection';
import { GallerySection } from './GallerySection';
import { CommunitySection } from './CommunitySection';
import { HostedBySection } from './HostedBySection';

import { EventAccess } from '../event-access';
import { EventDateTimeBlock } from './EventDateTimeBlock';
import { EventLocationBlock } from './EventLocationBlock';
import { AttendeesSection } from './AttendeesSection';
import { PendingCohostRequest } from './PendingCohostRequest';
import { useMe } from '$lib/hooks/useMe';
import { EventCollectibles } from '../event-collectibles';

export function EventGuestSide({ event: initEvent }: { event: Event }) {
  const { data } = useQuery(GetEventDocument, {
    variables: { id: initEvent._id },
    initData: { getEvent: initEvent } as unknown as GetEventQuery,
  });

  return <EventGuestSideContent event={data?.getEvent as Event || initEvent} />;
}

export function EventGuestSideContent({ event }: { event: Event }) {
  const [state] = useEventTheme();

  const me = useMe();

  const isHost = me?._id && event && hosting(event, me._id);
  const attending = me?._id ? isAttending(event, me._id) : false;
  const hosts = getEventCohosts(event);

  const router = useRouter();

  return (
    <div className={clsx('flex gap-[72px]', state.theme && state.config.color)}>
      <div className="hidden md:flex w-[296px] flex-col gap-6">
        <div className="flex flex-col gap-4">
          {event.new_new_photos_expanded?.[0] ? (
            <img
              src={generateUrl(event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
              alt={event.title}
              loading="lazy"
              className="aspect-square object-contain border rounded-md"
            />
          ) : (
            <img className="aspect-square object-contain border rounded-md" src={randomEventDP()} />
          )}

          {isHost && (
            <>
              <EventThemeBuilder eventId={event._id} />
              <div className="flex gap-2 items-center px-3.5 py-2 border border-card-border bg-accent-400/16 rounded-md">
                <p className="text-accent-500">You have manage access for this event.</p>
                <Button
                  variant="primary"
                  size="sm"
                  iconRight="icon-arrow-outward"
                  className="rounded-full"
                  onClick={() => router.push(`/e/manage/${event.shortid}`)}
                >
                  Manage
                </Button>
              </div>
            </>
          )}
        </div>

        <PendingCohostRequest event={event} />
        <CommunitySection event={event} />
        <HostedBySection event={event} />
        <AttendeesSection eventId={event._id} />
      </div>

      <div className="flex-1 flex flex-col gap-6 w-full">
        <div className="block md:hidden">
          {event.new_new_photos_expanded?.[0] ? (
            <img
              src={generateUrl(event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
              alt={event.title}
              loading="lazy"
              className="aspect-square object-contain border rounded-md"
            />
          ) : (
            <img className="aspect-square object-contain border rounded-md" src={randomEventDP()} />
          )}

          {isHost && (
            <>
              <Spacer className="h-4" />
              <div className="flex flex-col gap-4">
                <EventThemeBuilder eventId={event._id} />
                <div className="flex gap-2 items-center px-3.5 py-2 border border-card-border bg-accent-400/16 rounded-md">
                  <p className="text-accent-500">You have manage access for this event.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    iconRight="icon-arrow-outward"
                    className="rounded-full"
                    onClick={() => router.push(`/e/manage/${event.shortid}`)}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </>
          )}

          {event.private && (
            <>
              <Spacer className="h-6" />
              <Badge className="bg-gradient-to-r from-accent-500/16 to-warning-500/16">
                <div className="bg-gradient-to-r from-accent-500 to-warning-500 bg-clip-text flex items-center gap-1">
                  <i className="icon-sparkles size-3.5 bg-gradient-to-r from-accent-500 to-accent-500/70 " />
                  <span className="text-transparent bg-clip-text">Private Event</span>
                </div>
              </Badge>
            </>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl md:text-3xl font-bold">{event.title}</h3>

          {!!hosts.length && (
            <p className="md:hidden text-secondary text-sm">
              Hosted By{' '}
              {hosts
                .map((p) => p.display_name || p.name)
                  .join(', ')
                  .replace(/,(?=[^,]*$)/, ' & ')}
              </p>
            )
          }
        </div>

        <div className="flex flex-col gap-4">
          <EventDateTimeBlock event={event} />
          <EventLocationBlock event={event} />
        </div>
        {event && <EventAccess event={event} />}
        <AboutSection event={event} />
        {attending && <EventCollectibles event={event} />}
        <LocationSection event={event} />
        <SubEventSection event={event} />
        <GallerySection event={event} />
        <div className="flex flex-col gap-6 md:hidden">
          <CommunitySection event={event} />
          <AttendeesSection eventId={event._id} />
        </div>
        <Spacer className="h-8" />
      </div>
    </div>
  );
}
