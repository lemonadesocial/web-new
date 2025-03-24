import React from 'react';

import { Alert, Avatar, Button, Card, Divider, drawer } from '$lib/components/core';
import { Event, GetEventDocument, GetMeDocument } from '$lib/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useQuery } from '$lib/request';
import { format } from 'date-fns';

export function EventPane({ eventId }: { eventId: string }) {
  const { data: dataGetMe } = useQuery(GetMeDocument);
  const me = dataGetMe?.getMe;

  const { data, loading } = useQuery(GetEventDocument, { variables: { id: eventId }, skip: !eventId });
  const event = data?.getEvent as Event;

  if (loading) return <>Loading...</>;
  if (!event) return <>Not Found</>;

  const hosts = [event.host_expanded, ...(event.visible_cohosts_expanded || [])];
  const canManage = hosts.map((i) => i?._id).includes(me?._id);

  return (
    <div>
      <EventPaneHeader />
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

        <div className="flex gap-4">
          <div className="flex gap-4 flex-1">
            <div className="border rounded-sm size-12 text-tertiary/80 flex flex-col justify-center items-center font-medium">
              <span className="py-0.5 text-xs">{format(event.start, 'MMM')}</span>
              <Divider className="h-1 w-full" />
              <span>{format(event.start, 'dd')}</span>
            </div>
            <div className="flex flex-col">
              <span>{format(event.start, 'EEEE, MMMM dd')}</span>
              <span>
                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
              </span>
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

        <Card.Root>
          <Card.Header title="Registration" />
          <Card.Content className="flex flex-col gap-4 font-medium">
            <p>Welcome! To join the event, please register below.</p>
            {me && (
              <div className="flex gap-2 items-center">
                <Avatar src={generateUrl(me.image_avatar)} size="sm" />
                <div className="flex gap-1 items-center">
                  {me.name && <p>{me.name}</p>}
                  {me.email && <p>{me.email}</p>}
                </div>
              </div>
            )}
            <Button variant="secondary">One-Click Register</Button>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}

function EventPaneHeader() {
  return (
    <div className="px-3 py-2 flex gap-3 border-b">
      <Button icon="icon-chevron-double-right" variant="tertiary-alt" size="sm" onClick={() => drawer.close()} />
      <Button iconLeft="icon-duplicate" variant="tertiary" size="sm">
        Copy Link
      </Button>
      <Button iconRight="icon-arrow-outward" variant="tertiary" size="sm">
        Event Page
      </Button>
    </div>
  );
}
