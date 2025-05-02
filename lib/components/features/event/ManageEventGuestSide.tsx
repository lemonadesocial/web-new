'use client';
import React from 'react';
import { uniqBy } from 'lodash';

import { Event, GetEventDocument, GetEventQuery, User } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { Avatar, Badge, Button, Spacer } from '$lib/components/core';
import { generateUrl } from '$lib/utils/cnd';
import { hosting, isAttending } from '$lib/utils/event';
import { userAvatar } from '$lib/utils/user';
import { useSession } from '$lib/hooks/useSession';

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
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { EventCollectibles } from '../event-collectibles';

export default function ManageEventGuestSide({ event: eventDetail }: { event: Event }) {
  const { data, loading } = useQuery(GetEventDocument, {
    variables: { id: eventDetail._id },
    skip: !eventDetail._id,
    initData: { getEvent: eventDetail } as unknown as GetEventQuery,
  });

  const session = useSession();

  const event = data?.getEvent as Event;
  const hosts = uniqBy([event?.host_expanded, ...(event?.visible_cohosts_expanded || [])], (u) => u?._id);

  const isHost = session?.user && event && hosting(event, session.user);
  const attending = session?.user ? isAttending(event, session?.user) : false;

  return (
    <div className="flex gap-[72px]">
      <div className="hidden md:flex w-[296px] flex-col gap-6">
        {event.new_new_photos_expanded?.[0] && (
          <img
            src={generateUrl(event.new_new_photos_expanded[0])}
            alt={event.title}
            loading="lazy"
            className="aspect-square object-contain border rounded-md"
          />
        )}

        {
          isHost && (
            <div className="flex gap-2 items-center px-3.5 py-2 border border-card-border bg-accent-400/16 rounded-md">
              <p className="text-accent-500">You have manage access for this event.</p>
              <Button
                variant="primary"
                size="sm"
                iconRight="icon-arrow-outward"
                className="rounded-full"
                onClick={() => window.open(`${LEMONADE_DOMAIN}/manage/event/${event.shortid}/`, '_blank')}
              >
                Manage
              </Button>
            </div>
          )
        }

        <CommunitySection event={event} />
        <HostedBySection event={event} /> 
        <AttendeesSection eventId={event._id} />
      </div>

      <div className="flex-1 flex flex-col gap-6 w-full">
        <div className="block md:hidden">
          {event.new_new_photos_expanded?.[0] && (
            <img
              src={generateUrl(event.new_new_photos_expanded[0])}
              alt={event.title}
              loading="lazy"
              className="aspect-square object-contain border rounded-md"
            />
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

        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">{event.title}</h3>

          <div className="flex gap-2 item-center">
            {!!hosts.filter((p) => p?.image_avatar).length && (
              <div className="flex -space-x-1 overflow-hidden p-1">
                {hosts
                  .filter((p) => p?.image_avatar)
                  .map((p) => (
                    <Avatar key={p?._id} src={userAvatar(p as User)} size="sm" className="ring-2 border-background" />
                  ))}
              </div>
            )}

            <p className="text-sm md:text-base font-medium text-secondary">
              Hosted By {hosts.map((p) => p?.name).join(',')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <EventDateTimeBlock event={event} />
          <EventLocationBlock event={event} />
        </div>
        <EventAccess event={event} />
        <AboutSection event={event} loading={loading} />
        <LocationSection event={event} loading={loading} />
        <SubEventSection event={event} />
        <GallerySection event={event} loading={loading} />
        {attending && <EventCollectibles event={event} />}
        <Spacer className="h-8" />
      </div>
    </div>
  );
}
