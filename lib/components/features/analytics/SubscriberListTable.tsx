'use client';

import React from 'react';
import { Avatar, InputField, Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { trpc } from '$lib/trpc/client';
import { format, formatDistance, isToday } from 'date-fns';

interface Props {
  spaceId: string;
}

const LIMIT = 50;

export function SubscriberListTable({ spaceId }: Props) {
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [offset, setOffset] = React.useState(0);

  const { data, isLoading, error } = trpc.analytics.getSpaceSubscribers.useQuery({
    spaceId,
    search: debouncedSearch || undefined,
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
          Subscribers {total > 0 && `(${total})`}
        </h3>
      </div>

      <InputField
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        iconLeft="icon-search"
        placeholder="Search by name or email"
      />

      <CardTable.Root data={data?.items ?? []} loading={isLoading}>
        <CardTable.Header className="px-4 py-2.5">
          <div className="flex-1 text-xs font-medium">Subscriber</div>
          <div className="w-24 text-xs font-medium hidden md:block">Role</div>
          <div className="w-24 text-xs font-medium hidden md:block">Status</div>
          <div className="w-32 text-xs font-medium text-right">Joined</div>
        </CardTable.Header>

        <CardTable.Loading rows={5}>
          <Skeleton className="size-7 rounded-full" animate />
          <Skeleton className="h-4 w-32" animate />
          <Skeleton className="h-4 w-16 hidden md:block" animate />
          <Skeleton className="h-4 w-24 ml-auto" animate />
        </CardTable.Loading>

        <CardTable.EmptyState title="No subscribers yet" subtile="When people subscribe to your community, they will appear here." icon="icon-user-group-rounded" />

        {data?.items?.map((subscriber) => (
          <CardTable.Row key={subscriber.id}>
            <div className="flex px-4 py-3 items-center gap-3">
              <div className="flex-1 flex gap-3 items-center min-w-0">
                <Avatar className="size-7 aspect-square" src={subscriber.memberAvatar ?? undefined} />
                <div className="flex flex-col min-w-0">
                  <p className="text-primary truncate">{subscriber.memberName || 'Anonymous'}</p>
                  <p className="text-tertiary text-sm truncate">{subscriber.memberEmail}</p>
                </div>
              </div>
              <div className="w-24 hidden md:block">
                <span className="text-secondary text-sm capitalize">{subscriber.role}</span>
              </div>
              <div className="w-24 hidden md:block">
                <span className="text-secondary text-sm capitalize">{subscriber.status}</span>
              </div>
              <div className="w-32 text-right">
                <p className="text-tertiary text-sm">
                  {isToday(new Date(subscriber.joinedAt))
                    ? formatDistance(new Date(subscriber.joinedAt), new Date(), { addSuffix: true })
                    : format(new Date(subscriber.joinedAt), 'MMM dd, yyyy')}
                </p>
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
