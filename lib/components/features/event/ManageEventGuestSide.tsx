'use client';
import React from 'react';

import { Event, GetEventDocument, GetEventQuery, User } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { Avatar, Badge, Spacer } from '$lib/components/core';
import { generateUrl } from '$lib/utils/cnd';
import { hosting } from '$lib/utils/event';
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

export default function ManageEventGuestSide({ event: eventDetail }: { event: Event }) {
  const { data, loading } = useQuery(GetEventDocument, {
    variables: { id: eventDetail._id },
    skip: !eventDetail._id,
    initData: { getEvent: eventDetail } as unknown as GetEventQuery,
  });

  const session = useSession();

  const event = data?.getEvent as Event;
  const hosts = [event.host_expanded, ...(event.visible_cohosts_expanded || [])];

  const isHost = session?.user && event && hosting(event, session.user);

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

        <CommunitySection event={event} />
        <HostedBySection event={event} />
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
        {!isHost && <EventAccess event={event} />}
        <AboutSection event={event} loading={loading} />
        <LocationSection event={event} loading={loading} />
        <SubEventSection event={event} />
        <GallerySection event={event} loading={loading} />
        <Spacer className="h-8" />
      </div>
    </div>
  );
}
