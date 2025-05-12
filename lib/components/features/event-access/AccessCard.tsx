import React, { useEffect, useState } from 'react';
import { intervalToDuration } from 'date-fns';

import { useMe } from "$lib/hooks/useMe";
import { userAvatar } from "$lib/utils/user";
import { Card, Avatar } from "$lib/components/core";
import { Event } from "$lib/graphql/generated/backend/graphql";
import { useEventStatus } from '$lib/hooks/useEventStatus';

export function AccessCard({
  children,
  event,
}: {
  children: React.ReactNode;
  event: Event;
}) {
  const me = useMe();

  const { status, timeLabel } = useEventStatus(event.start, event.end);

  return (
    <Card.Root className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Avatar src={userAvatar(me)} className="size-12" />
        {
          status === 'live' && (
            <div className="flex items-center gap-1.5">
              <i className="icon-dot size-4 text-error" />
              <p className="text-error uppercase text-sm">live</p>
            </div>
          )
        }
        {(status === 'upcoming' && !event.virtual) && (
          <div className="px-2 py-1 bg-primary/8 rounded-full">
            <p className="text-xs text-tertiary">Starts in <span className="text-warning-300">{timeLabel}</span></p>
          </div>
        )}
      </div>
      {children}
    </Card.Root>
  );
}