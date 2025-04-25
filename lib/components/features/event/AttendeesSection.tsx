import React, { useMemo } from 'react';

import { useQuery } from '$lib/request';
import { Avatar } from '$lib/components/core';
import { PeekEventGuestsDocument, User } from '$lib/generated/backend/graphql';
import { userAvatar } from '$lib/utils/user';

interface AttendeesSectionProps {
  eventId: string;
  limit?: number;
}

export function AttendeesSection({ eventId, limit = 5 }: AttendeesSectionProps) {
  const { data } = useQuery(PeekEventGuestsDocument, {
    variables: { id: eventId, limit },
    skip: !eventId,
  });

  const guests = useMemo(() => data?.peekEventGuests?.items || [], [data]);
  const totalAttendees = useMemo(() => data?.peekEventGuests?.total || 0, [data]);

  const visibleAttendees = useMemo(() => {
    return guests.slice(0, 2).map(guest => guest.name).filter(Boolean);
  }, [guests]);

  const othersCount = totalAttendees - visibleAttendees.length;

  if (!guests.length) return null;

  return (
    <div>
      <p className="text-sm text-secondary">
        {totalAttendees} Going
      </p>

      <hr className="mt-2 mb-4 border-t border-t-divider" />

      <div className="flex -space-x-1.5 overflow-hidden">
        {guests.map((guest, index) => (
          <Avatar
            key={index}
            src={userAvatar(guest as User)}
            size="md"
            className="border border-card-border"
          />
        ))}
      </div>

      <p className="text-sm mt-2">
        {visibleAttendees.join(', ')}
        {othersCount > 0 && ` & ${othersCount} ${othersCount === 1 ? 'other' : 'others'}`}
      </p>
    </div>
  );
}
