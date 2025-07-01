'use client';

import { Alert, Avatar, Button, drawer, toast } from '$lib/components/core';
import { Event, GetEventDocument, User } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';
import { copy } from '$lib/utils/helpers';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { useSession } from '$lib/hooks/useSession';
import { getEventCohosts, hosting } from '$lib/utils/event';

import { AboutSection } from '../event/AboutSection';
import { LocationSection } from '../event/LocationSection';
import { SubEventSection } from '../event/SubEventSection';
import { GallerySection } from '../event/GallerySection';
import { CommunitySection } from '../event/CommunitySection';
import { HostedBySection } from '../event/HostedBySection';
import { EventDateTimeBlock } from '../event/EventDateTimeBlock';
import { EventLocationBlock } from '../event/EventLocationBlock';
import { AttendeesSection } from '../event/AttendeesSection';
import { EventAccess } from '../event-access';
import { useMe } from '$lib/hooks/useMe';

export function EventPane({ eventId }: { eventId: string }) {
  const session = useSession();
  const { data, loading } = useQuery(GetEventDocument, { variables: { id: eventId }, skip: !eventId });
  const event = data?.getEvent as Event;
  const me = useMe();

  const hosts = event ? getEventCohosts(event) : [];

  const canManage = me?._id && event && hosting(event, me._id);

  return (
    <div>
      <EventPaneHeader eventShortId={event?.shortid} />

      {canManage && (
        <Alert message="You have manage access for this event.">
          <Button
            iconRight="icon-arrow-outward"
            className="rounded-full"
            onClick={() => window.open(`${LEMONADE_DOMAIN}/manage/event/${event?.shortid}`)}
          >
            Manage
          </Button>
        </Alert>
      )}

      <div className="p-4 flex flex-col gap-6">
        {loading ? (
          <div className="p-4">
            <div className="w-[280px] h-[280px] bg-card rounded-md m-auto" />
          </div>
        ) : (
          event?.new_new_photos_expanded?.[0] && (
            <div className="p-4">
              <img
                src={generateUrl(event.new_new_photos_expanded[0], 'TICKET_PHOTO')}
                alt={event.title}
                className="mx-auto object-contain size-[280px] border rounded-md"
                loading="lazy"
              />
            </div>
          )
        )}

        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">{event?.title}</h3>

          <div className="flex gap-2 item-center">
            {!!hosts.filter((p) => p?.image_avatar).length && (
              <div className="flex -space-x-1 overflow-hidden p-1">
                {hosts
                  .filter((p) => p?.image_avatar)
                  .map((p) => (
                    <Avatar
                      key={p?._id}
                      src={userAvatar(p as User)}
                      size="sm"
                      className="outline-2 outline-background"
                    />
                  ))}
              </div>
            )}

            <p className="font-medium text-secondary">
              Hosted By{' '}
              {hosts
                .map((p) => p.display_name || p.name)
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' & ')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <EventDateTimeBlock event={event} />
          <EventLocationBlock event={event} loading={loading} />
        </div>
        {event && <EventAccess event={event} />}
        <AboutSection event={event} loading={loading} />
        <LocationSection event={event} loading={loading} />
        <SubEventSection event={event} />
        <GallerySection event={event} loading={loading} />
        <CommunitySection event={event} />
        <HostedBySection event={event} />
        <AttendeesSection eventId={eventId} />
      </div>
    </div>
  );
}

function EventPaneHeader({ eventShortId }: { eventShortId?: string }) {
  return (
    <div className="px-3 py-2 flex gap-3 border-b sticky top-0 z-50 backdrop-blur-xl">
      <Button icon="icon-chevron-double-right" variant="tertiary-alt" size="sm" onClick={() => drawer.close()} />
      {eventShortId && (
        <>
          <Button
            iconLeft="icon-duplicate"
            variant="tertiary-alt"
            size="sm"
            onClick={() => copy(`${LEMONADE_DOMAIN}/e/${eventShortId}`, () => toast.success('Url Copied!'))}
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
        </>
      )}
    </div>
  );
}
