'use client';
import React from 'react';
import { format } from 'date-fns';

import { Alert, Avatar, Button, Divider, drawer } from '$lib/components/core';
import { Event, GetEventDocument, GetMeDocument, User } from '$lib/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useQuery } from '$lib/request';

import RegistrationCard from '../event/RegistrationCard';
import { AboutSection } from '../event/AboutSection';
import { LocationSection } from '../event/LocationSection';
import { SubEventSection } from '../event/SubEventSection';
import { GalarySection } from '../event/GalarySection';
import { CommunitySection } from '../event/CommunitySection';
import { HostedBySection } from '../event/HostedBySection';
import { convertFromUtcToTimezone } from '$lib/utils/date';
import { getEventDateBlockRange, getEventDateBlockStart } from '$lib/utils/event';
import { userAvatar } from '$lib/utils/user';
import { copy } from '$lib/utils/helpers';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';

export function EventPane({ eventId }: { eventId: string }) {
  const { data: dataGetMe } = useQuery(GetMeDocument);
  const me = dataGetMe?.getMe as User;

  const { data, loading } = useQuery(GetEventDocument, { variables: { id: eventId }, skip: !eventId });
  const event = data?.getEvent as Event;

  if (loading) return <>Loading...</>;
  if (!event) return <>Not Found</>;

  const hosts = [event.host_expanded, ...(event.visible_cohosts_expanded || [])];
  const canManage = hosts.map((i) => i?._id).includes(me?._id);

  return (
    <div>
      <EventPaneHeader eventShortId={event.shortid} />

      {canManage && (
        <Alert message="You have manage access for this event.">
          <Button iconRight="icon-arrow-outward" className="rounded-full">
            Manage
          </Button>
        </Alert>
      )}

      <div className="p-4 flex flex-col gap-6">
        {event.new_new_photos_expanded?.[0] && (
          <div className="p-4">
            <img
              src={generateUrl(event.new_new_photos_expanded[0], 'TICKET_PHOTO')}
              alt={event.title}
              className="mx-auto size-[280px] aspect-square border rounded-md"
            />
          </div>
        )}

        <h3 className="text-2xl font-bold">{event.title}</h3>

        <div className="flex gap-2 item-center">
          {!!hosts.filter((p) => p?.image_avatar).length && (
            <div className="flex -space-x-1 overflow-hidden p-1">
              {hosts
                .filter((p) => p?.image_avatar)
                .map((p) => (
                  <Avatar key={p?._id} src={userAvatar(p)} size="sm" className="ring-2 border-background" />
                ))}
            </div>
          )}

          <p className="font-medium text-tertiary/80">Hosted By {hosts.map((p) => p?.name).join(',')}</p>
        </div>

        <div className="flex gap-4">
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
                <p className="text-sm">
                  {[event.address?.city || event.address?.region, event.address?.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
        <RegistrationCard />
        <AboutSection event={event} />
        <LocationSection event={event} />
        <SubEventSection event={event} />
        <GalarySection event={event} />
        <CommunitySection event={event} />
        <HostedBySection event={event} />
      </div>
    </div>
  );
}

function EventPaneHeader({ eventShortId }: { eventShortId: string }) {
  return (
    <div className="px-3 py-2 flex gap-3 border-b sticky top-0 z-50 backdrop-blur-xl">
      <Button icon="icon-chevron-double-right" variant="tertiary-alt" size="sm" onClick={() => drawer.close()} />
      <Button
        iconLeft="icon-duplicate"
        variant="tertiary-alt"
        size="sm"
        onClick={() => copy(`${LEMONADE_DOMAIN}/e/${eventShortId}`)}
      >
        Copy Link
      </Button>
      <Button
        iconRight="icon-arrow-outward"
        variant="tertiary-alt"
        size="sm"
        onClick={() => window.open(`/e/${eventShortId}`, '_blank')}
      >
        Event Page
      </Button>
    </div>
  );
}
