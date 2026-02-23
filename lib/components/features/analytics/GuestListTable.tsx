'use client';

import React from 'react';
import { Avatar, InputField, Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { trpc } from '$lib/trpc/client';
import { format, formatDistance, isToday } from 'date-fns';
import clsx from 'clsx';

interface GuestItem {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  guestAvatar: string | null;
  rsvpStatus: string;
  ticketType: string | null;
  paymentAmount: unknown;
  checkedIn: boolean;
  createdAt: string | Date;
  annotation?: { tags: string[]; notes: string | null } | null;
}

interface Props {
  eventId: string;
}

const LIMIT = 50;

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  declined: 'bg-error/10 text-error',
};

export function GuestListTable({ eventId }: Props) {
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState<'approved' | 'declined' | 'pending' | undefined>();

  const { data, isLoading, error } = trpc.analytics.getEventGuests.useQuery({
    eventId,
    search: debouncedSearch || undefined,
    status: statusFilter,
    limit: LIMIT,
    offset,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  if (error) {
    return <div className="text-error p-4">{error.message}</div>;
  }

  const total = data?.total ?? 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <h3 className="flex-1 text-xl font-semibold text-primary">
          Guests {total > 0 && `(${total})`}
        </h3>
      </div>

      <div className="flex gap-2 items-center">
        <InputField
          className="flex-1"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          iconLeft="icon-search"
          placeholder="Search by name or email"
        />
        <div className="flex gap-1">
          {(['approved', 'pending', 'declined'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? undefined : status)}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-full capitalize transition-colors',
                statusFilter === status ? STATUS_STYLES[status] : 'bg-overlay-primary text-secondary hover:text-primary',
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <CardTable.Root data={(data?.items ?? []) as unknown[]} loading={isLoading}>
        <CardTable.Header className="px-4 py-2.5">
          <div className="flex-1 text-xs font-medium">Guest</div>
          <div className="w-24 text-xs font-medium hidden md:block">Status</div>
          <div className="w-24 text-xs font-medium hidden md:block">Ticket</div>
          <div className="w-24 text-xs font-medium hidden md:block">Payment</div>
          <div className="w-32 text-xs font-medium text-right">Date</div>
        </CardTable.Header>

        <CardTable.Loading rows={5}>
          <Skeleton className="size-7 rounded-full" animate />
          <Skeleton className="h-4 w-32" animate />
          <Skeleton className="h-4 w-16 hidden md:block" animate />
          <Skeleton className="h-4 w-16 hidden md:block" animate />
          <Skeleton className="h-4 w-24 ml-auto" animate />
        </CardTable.Loading>

        <CardTable.EmptyState title="No guests yet" subtile="When people register for this event, they will appear here." icon="icon-user-group-rounded" />

        {(data?.items as GuestItem[] | undefined)?.map((guest) => (
          <CardTable.Row key={guest.id}>
            <div className="flex px-4 py-3 items-center gap-3">
              <div className="flex-1 flex gap-3 items-center min-w-0">
                <Avatar className="size-7 aspect-square" src={guest.guestAvatar ?? undefined} />
                <div className="flex flex-col min-w-0">
                  <p className="text-primary truncate">{guest.guestName || 'Anonymous'}</p>
                  <p className="text-tertiary text-sm truncate">{guest.guestEmail}</p>
                </div>
              </div>
              <div className="w-24 hidden md:block">
                <span className={clsx('px-2 py-0.5 text-xs rounded-full capitalize', STATUS_STYLES[guest.rsvpStatus] ?? 'bg-overlay-primary text-secondary')}>
                  {guest.rsvpStatus}
                </span>
              </div>
              <div className="w-24 hidden md:block">
                <p className="text-secondary text-sm truncate">{guest.ticketType || '—'}</p>
              </div>
              <div className="w-24 hidden md:block">
                <p className="text-secondary text-sm">
                  {guest.paymentAmount ? `$${Number(guest.paymentAmount).toFixed(2)}` : '—'}
                </p>
              </div>
              <div className="w-32 text-right">
                <p className="text-tertiary text-sm">
                  {isToday(new Date(guest.createdAt))
                    ? formatDistance(new Date(guest.createdAt), new Date(), { addSuffix: true })
                    : format(new Date(guest.createdAt), 'MMM dd, yyyy')}
                </p>
                {guest.checkedIn && (
                  <p className="text-success text-xs">Checked in</p>
                )}
              </div>
            </div>
          </CardTable.Row>
        ))}

        {total > LIMIT && (
          <CardTable.Pagination
            skip={offset}
            limit={LIMIT}
            total={total}
            onPrev={() => setOffset((prev) => Math.max(0, prev - LIMIT))}
            onNext={() => setOffset((prev) => prev + LIMIT)}
          />
        )}
      </CardTable.Root>
    </div>
  );
}
