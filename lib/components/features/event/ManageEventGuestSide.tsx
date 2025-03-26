'use client';
import React from 'react';

import { Event, GetEventDocument, GetEventQuery } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { Avatar, Divider } from '$lib/components/core';
import { format } from 'date-fns';
import { generateUrl } from '$lib/utils/cnd';
import { AboutSection } from './AboutSection';
import { LocationSection } from './LocationSection';
import { SubEventSection } from './SubEventSection';
import { GalarySection } from './GalarySection';
import { CommunitySection } from './CommunitySection';
import { HostedBySection } from './HostedBySection';
import { convertFromUtcToTimezone } from '$lib/utils/date';
import { getEventDateBlockRange, getEventDateBlockStart } from '$lib/utils/event';

export default function ManageEventGuestSide({ event: eventDetail }: { event: Event }) {
  const { data } = useQuery(GetEventDocument, {
    variables: { id: eventDetail._id },
    skip: !eventDetail._id,
    initData: { getEvent: eventDetail } as unknown as GetEventQuery,
  });

  const event = data?.getEvent as Event;
  const hosts = [event.host_expanded, ...(event.visible_cohosts_expanded || [])];

  return (
    <div className="flex gap-[72px]">
      <div className="w-[296px] flex flex-col gap-6">
        {event.new_new_photos_expanded?.[0] && (
          <img
            src={generateUrl(event.new_new_photos_expanded[0], 'TICKET_PHOTO')}
            alt={event.title}
            className="aspect-square border rounded-md"
          />
        )}

        <CommunitySection event={event} />
        <HostedBySection event={event} />
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <h3 className="text-2xl font-bold">{event.title}</h3>

        <div className="flex gap-2 item-center">
          {!!hosts.filter((p) => p?.image_avatar).length && (
            <div className="flex -space-x-1 overflow-hidden p-1">
              {hosts
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

          <p className="font-medium text-tertiary/80">Hosted By {hosts.map((p) => p?.name).join(',')}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 flex-1">
            <div className="border rounded-sm size-12 text-tertiary/80 flex flex-col justify-center items-center font-medium">
              <span className="py-0.5 text-xs">
                {format(convertFromUtcToTimezone(event.start, event.timezone as string), 'MMM')}
              </span>
              <Divider className="h-1 w-full" />
              <span>{format(convertFromUtcToTimezone(event.start, event.timezone as string), 'dd')}</span>
            </div>
            <div className="flex flex-col">
              <span>{getEventDateBlockStart(event)}</span>
              <span className="text-sm">{getEventDateBlockRange(event)}</span>
            </div>
          </div>

          {event.address && (
            <div className="flex gap-4 flex-1">
              <div className="border rounded-sm size-12 flex items-center justify-center">
                <i className="icon-location-outline" />
              </div>
              <div>
                <p>
                  {event.address?.title} <i className="icon-arrow-outward text-tertiary/24 size-[18px]" />
                </p>
                <p>
                  {[event.address?.city || event.address?.region, event.address?.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
        <AboutSection event={event} />
        <LocationSection event={event} />
        <SubEventSection event={event} />
        <GalarySection event={event} />
      </div>
    </div>
  );
}
