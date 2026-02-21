import React, { useMemo } from 'react';

import { useQuery } from '$lib/graphql/request';
import { Avatar, Skeleton } from '$lib/components/core';
import { Event, PeekEventGuestsDocument, User } from '$lib/graphql/generated/backend/graphql';
import { userAvatar } from '$lib/utils/user';

interface AttendeesSectionProps {
  event?: Event;
  limit?: number;
}

export function AttendeesSection({ event, limit = 5 }: AttendeesSectionProps) {
  const { data, loading } = useQuery(PeekEventGuestsDocument, {
    variables: { id: event?._id, limit },
    skip: !event?._id,
  });

  const guests = useMemo(() => data?.peekEventGuests?.items || [], [data]);
  const totalAttendees = useMemo(() => data?.peekEventGuests?.total || 0, [data]);

  const visibleAttendees = useMemo(() => {
    return guests.slice(0, 2).map((guest) => guest.first_name || guest.display_name || guest.name || 'Anonymous');
  }, [guests]);

  const othersCount = totalAttendees - visibleAttendees.length;

  if (loading) {
    return (
      <div>
        <Skeleton className="h-4 w-16 rounded-md" animate />
        <hr className="mt-2 mb-4 border-t border-t-divider" />
        <div className="flex -space-x-1.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="size-8 rounded-full" animate />
          ))}
        </div>
      </div>
    );
  }

  if (!guests.length || event?.hide_attending === true) return null;

  return (
    <div>
      <p className="text-sm text-secondary">{totalAttendees} Going</p>

      <hr className="mt-2 mb-4 border-t border-t-divider" />

      <div className="flex -space-x-1.5">
        {guests.map((guest, index) => (
          <div key={index} className="tooltip sm:tooltip">
            <div className="tooltip-content">
              <p className="text-sm font-medium">{guest.display_name || guest.name || 'Anonymous'}</p>
            </div>
            <Avatar
              src={userAvatar(guest as User)}
              size="md"
              className="border border-card-border tooltip tooltip-open"
            />
          </div>
        ))}
      </div>

      <p className="text-sm mt-2">
        {visibleAttendees.join(', ')}
        {othersCount > 0 && ` & ${othersCount} ${othersCount === 1 ? 'other' : 'others'}`}
      </p>
    </div>
  );
}
