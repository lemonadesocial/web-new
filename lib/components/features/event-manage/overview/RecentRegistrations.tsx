import { useRouter } from 'next/navigation';

import { Button } from '$lib/components/core';
import { Event, ListEventGuestsDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { GuestTable } from '../common/GuestTable';
import { Skeleton } from '$lib/components/core/skeleton';

interface RecentRegistrationsProps {
  event: Event;
  titleClassName?: string;
}

export function RecentRegistrations({ event, titleClassName }: RecentRegistrationsProps) {
  const router = useRouter();
  const { data, loading } = useQuery(ListEventGuestsDocument, {
    variables: {
      event: event._id,
      skip: 0,
      limit: 3,
    },
  });

  const guests = data?.listEventGuests.items || [];

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-md border border-card-border bg-card">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card">
        <i className="icon-user-group-outline size-9 text-tertiary" />
        <div>
          <p className="text-tertiary">No Guests Yet</p>
          <p className="text-tertiary text-sm">Once people register for your event, you will find them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className={titleClassName || 'text-xl font-semibold'}>
          Recent Registrations
        </h2>
        <Button
          variant="tertiary"
          iconRight="icon-chevron-right"
          size="sm"
          onClick={() => router.push(`/e/manage/${event.shortid}/guests`)}
        >
          All Guests
        </Button>
      </div>

      <GuestTable
        event={event}
        guests={guests}
        loading={loading}
        pageSize={3}
      />
    </div>
  );
}
