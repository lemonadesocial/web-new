'use client';

import { Event } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { GetEventGuestsStatisticsDocument } from '$lib/graphql/generated/backend/graphql';
import { Skeleton } from '$lib/components/core';

interface GuestStatsAtAGlanceProps {
  event: Event;
}

interface GuestStatus {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

export function GuestStats({ event }: GuestStatsAtAGlanceProps) {
  const { data, loading } = useQuery(GetEventGuestsStatisticsDocument, {
    variables: {
      event: event._id,
    },
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton animate className="h-6 w-24 rounded" />
        <Skeleton animate className="h-2 w-full rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton animate className="h-4 w-20 rounded" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.getEventGuestsStatistics) return null;

  const stats = data.getEventGuestsStatistics;

  const guestStatuses: GuestStatus[] = [
    {
      label: 'Going',
      count: stats.going,
      color: 'text-success-500',
      bgColor: 'bg-success-500',
    },
    {
      label: 'Pending Approval',
      count: stats.pending_approval,
      color: 'text-warning-500',
      bgColor: 'bg-warning-500',
    },
    {
      label: 'Invited',
      count: stats.pending_invite,
      color: 'text-alert-400',
      bgColor: 'bg-alert-400',
    },
    {
      label: 'Not Going',
      count: stats.declined,
      color: 'text-secondary',
      bgColor: 'bg-secondary',
    },
  ];

  const totalGuests = guestStatuses.reduce((sum, status) => sum + status.count, 0);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-success-500"><span className="text-xl">{totalGuests}</span> guests</p>
      <div className="flex h-2 rounded-full overflow-hidden">
        {guestStatuses.map((status, index) => {
          const percentage = (status.count / totalGuests) * 100;
          const isLast = index === guestStatuses.length - 1;

          return (
            <div
              key={status.label}
              className={`${status.bgColor} ${isLast ? 'rounded-r-full' : ''}`}
              style={{ width: `${percentage}%` }}
            />
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap">
        {guestStatuses.map((status) => (
          <div key={status.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status.bgColor}`} />
            <p className={`${status.color} text-sm`}>
              {status.count} {status.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
