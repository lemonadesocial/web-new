'use client';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

import { File, GetUpcomingEventsDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';
import { randomEventDP } from '$lib/utils/user';

export function UpcommingEventsCard() {
  const me = useMe();
  const router = useRouter();
  const { data } = useQuery(GetUpcomingEventsDocument, {
    variables: {
      limit: 3,
      user: me?._id,
    },
    skip: !me?._id,
  });

  if (!data?.events.length) return null;

  return (
    <div className="hidden lg:block rounded-md border p-4 space-y-3">
      <p className="text-tertiary">Upcomming Events</p>
      <div className="space-y-3">
        {data.events.map((event) => (
          <div
            key={event._id}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push(`/e/${event.shortid}`)}
          >
            <img
              src={
                event.new_new_photos_expanded?.[0]
                  ? generateUrl(event.new_new_photos_expanded[0] as File)
                  : randomEventDP()
              }
              className="size-8 rounded-sm border"
            />
            <div>
              <p>{event.title}</p>
              <p className="text-tertiary text-sm">{format(new Date(event.start), "EEE, MMM d 'at' h:mm a")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
