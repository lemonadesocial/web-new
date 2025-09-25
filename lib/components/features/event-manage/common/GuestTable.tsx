import { formatDistanceToNow } from 'date-fns';
import { Avatar, Chip, Skeleton } from '$lib/components/core';
import { Event, EventGuestDetail, EventJoinRequestState } from '$lib/graphql/generated/backend/graphql';
import { randomUserImage } from '$lib/utils/user';
import { GuestDetailsDrawer } from '../drawers/GuestDetailsDrawer';
import { drawer } from '$lib/components/core';

interface GuestTableProps {
  event: Event;
  guests: any[];
  loading?: boolean;
  onGuestClick?: (guest: any) => void;
}

export function GuestTable({ event, guests, loading = false, onGuestClick }: GuestTableProps) {
  const handleGuestClick = (guest: any) => {
    if (onGuestClick) {
      onGuestClick(guest);
    } else {
      drawer.open(GuestDetailsDrawer, { props: { email: guest.user.email, event: event._id } });
    }
  };

  if (loading && guests.length === 0) {
    return (
      <div className="rounded-md border border-card-border bg-card">
        <div className="divide-y divide-(--color-divider)">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="w-5 h-5 rounded-full" animate />
                <div className="flex-1 flex gap-2 items-center">
                  <Skeleton className="h-4 w-24" animate />
                  <Skeleton className="h-4 w-32" animate />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-16 rounded-full" animate />
                <Skeleton className="h-4 w-20" animate />
                <Skeleton className="h-5 w-12 rounded-full" animate />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="rounded-md border border-card-border bg-card">
        <div className="text-center py-12">
          <p className="text-tertiary">No guests found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-card-border bg-card">
      <div className="divide-y divide-(--color-divider)">
        {guests.map((guest: EventGuestDetail, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 hover:bg-card-hover cursor-pointer"
            onClick={() => handleGuestClick(guest)}
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar
                src={guest.user.image_avatar || randomUserImage(guest.user.email?.toString())}
                className="size-5"
              />
              <div className="flex-1 flex flex-col md:flex-row md:gap-2 md:items-center">
                <p className="truncate">
                  {guest.user.display_name ||
                    guest.user.name ||
                    guest.ticket?.metadata?.buyer_name ||
                    guest.join_request?.metadata?.buyer_name ||
                    'Anonymous'}
                </p>
                <p className="text-tertiary truncate text-xs md:text-base">{guest.user.email}</p>
              </div>
            </div>
            <div className="flex flex-col items-end md:flex-row gap-0.5">
              <div className="flex items-center gap-1 md:gap-3">
                {guest.ticket && (
                  <>
                    <Chip variant="secondary" size="xxs" className="rounded-full" leftIcon="icon-ticket size-3">
                      {guest.ticket?.type_expanded?.title}
                    </Chip>
                    <span className="hidden md:block text-sm text-tertiary whitespace-nowrap">
                      {guest.ticket?.created_at ? formatDistanceToNow(new Date(guest.ticket?.created_at), { addSuffix: true }) : ''}
                    </span>
                  </>
                )}
                {(!guest.join_request || guest.join_request.state === EventJoinRequestState.Approved) && (
                  <Chip variant="success" size="xxs" className="rounded-full">
                    Going
                  </Chip>
                )}
                {guest.join_request?.state === EventJoinRequestState.Pending && (
                  <Chip variant="warning" size="xxs" className="rounded-full">
                    Pending
                  </Chip>
                )}
                {guest.join_request?.state === EventJoinRequestState.Declined && (
                  <Chip variant="error" size="xxs" className="rounded-full">
                    Declined
                  </Chip>
                )}
              </div>

              <span className="block md:hidden text-xs text-tertiary whitespace-nowrap">
                {guest.ticket?.created_at ? formatDistanceToNow(new Date(guest.ticket?.created_at), { addSuffix: true }) : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
