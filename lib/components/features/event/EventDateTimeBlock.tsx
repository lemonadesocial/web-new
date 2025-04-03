import React from 'react';
import { format } from 'date-fns';

import { Divider, SkeletonComp } from '$lib/components/core';
import { Event } from '$lib/generated/backend/graphql';
import { convertFromUtcToTimezone } from '$lib/utils/date';
import { getEventDateBlockRange, getEventDateBlockStart } from '$lib/utils/event';

interface Props {
  event?: Event;
}

export function EventDateTimeBlock({ event }: Props) {
  if (!event) return <EventDateTimeBlockSkeleton />;

  return (
    <div className="flex gap-4 flex-1">
      <div className="border rounded-sm size-12 text-secondary flex flex-col justify-center items-center font-medium">
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
  );
}

function EventDateTimeBlockSkeleton() {
  return (
    <div className="flex gap-4 flex-1">
      <div className="border rounded-sm size-12 text-secondary flex flex-col justify-center items-center font-medium">
        <span className="py-0.5 text-xs"></span>
        <Divider className="h-1 w-full" />
        <span className="h-3"></span>
      </div>
      <div className="flex flex-col justify-between">
        <SkeletonComp animate className="w-40 h-6" />
        <SkeletonComp animate className="w-24 h-4" />
      </div>
    </div>
  );
}
