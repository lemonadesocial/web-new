'use client';
import React from 'react';

import { useRouter } from 'next/navigation';

import { Avatar, Card } from '$lib/components/core';
import {
  Event,
  GetSpaceEventsDocument,
  Space,
  FollowSpaceDocument,
  UnfollowSpaceDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { formatWithTimezone } from '$lib/utils/date';
import { WidgetContent } from './WidgetContent';
import { useAtom } from 'jotai';
import { useSignIn } from '$lib/hooks/useSignIn';

import { sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';

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

  if (!upcomingEvents.length) return <EmptyUpcomingEvents space={space} />;

  return (
    <WidgetContent
      space={space}
      canSubscribe={false}
      title="Events"
      className="col-span-2"
      onClick={() => router.push(`/s/${space.slug || space._id}/events`)}
    >
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">{upcomingEvents.length}</h3>
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

function EmptyUpcomingEvents({ space }: { space: Space }) {
  const router = useRouter();

  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const signIn = useSignIn();

  const [follow] = useMutation(FollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: true } });
    },
  });
  const [unfollow] = useMutation(UnfollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: false } });
    },
  });

  const handleSubscribe = () => {
    if (!session) {
      // need to login to subscribe
      signIn();
      return;
    }

    const variables = { space: space?._id };
    if (space?.followed) unfollow({ variables });
    else follow({ variables });
  };

  const canSubscribe = ![space?.creator, ...(space?.admins?.map((p) => p._id) || [])].includes(me?._id);

  return (
    <WidgetContent
      space={space}
      canSubscribe={false}
      title="Events"
      className="col-span-2"
      onClick={() => router.push(`/s/${space.slug || space._id}/events`)}
    >
      <div className="p-6 flex gap-6 w-full">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold">0</h3>
            <p className="text-tertiary">Upcoming</p>
          </div>
          <div className="text-tertiary">
            <p>
              Subscribe to get updates <br /> on upcoming events
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5">
          <Card.Root
            className="bg-(--btn-tertiary)"
            onClick={
              canSubscribe
                ? (e) => {
                    handleSubscribe();
                    e.stopPropagation();
                  }
                : undefined
            }
          >
            <Card.Content className="flex flex-col justify-center items-center gap-3">
              <i aria-hidden="true" className="icon-user-plus" />
              <p>{space.followed ? 'Subscribed' : 'Subscribe'}</p>
            </Card.Content>
          </Card.Root>

          <Card.Root className="bg-(--btn-tertiary)">
            <Card.Content className="flex flex-col justify-center items-center gap-3">
              <i aria-hidden="true" className="icon-calendar-add" />
              <p>Submit Event</p>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </WidgetContent>
  );
}
