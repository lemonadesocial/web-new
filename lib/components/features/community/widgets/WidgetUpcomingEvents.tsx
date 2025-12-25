'use client';
import { useRouter } from 'next/navigation';

import { Avatar, Card } from '$lib/components/core';
import { Event, GetSpaceEventsDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { formatWithTimezone } from '$lib/utils/date';
import { WidgetContent } from './WidgetContent';

interface Props {
  space: Space;
}

const FROM_NOW = new Date().toISOString();

export function WidgetUpcomingEvents({ space }: Props) {
  const router = useRouter();

  const { data, loading } = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space?._id,
      limit: 2,
      skip: 0,
      endFrom: FROM_NOW,
      spaceTags: [],
    },
    skip: !space?._id,
  });

  if (loading) return null;
  const upcomingEvents = (data?.getEvents || []) as Event[];

  return (
    <WidgetContent
      space={space}
      canSubscribe={false}
      title="Events"
      className="col-span-2"
      onClick={() => router.push('/events')}
    >
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">12</h3>
          <p className="text-tertiary">Upcoming</p>
        </div>
        {upcomingEvents.map((item) => (
          <Card.Root
            key={item._id}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/e/${item.shortid}`);
            }}
          >
            <Card.Content>
              <div className="flex gap-3">
                {item.new_new_photos_expanded?.[0] && <Avatar src={generateUrl(item.new_new_photos_expanded[0])} />}
                <div className="space-y-0.5">
                  <p>{item.title}</p>
                  <p className="text-sm text-tertiary">
                    {formatWithTimezone(new Date(item.start), `EEE dd 'at' hh:mma`, item.timezone)}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </WidgetContent>
  );
}
