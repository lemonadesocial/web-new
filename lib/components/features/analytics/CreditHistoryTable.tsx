'use client';

import React from 'react';
import { Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { trpc } from '$lib/trpc/client';
import { format } from 'date-fns';
import clsx from 'clsx';

interface CreditTxnItem {
  id: string;
  type: string;
  amount: unknown;
  balanceAfter: unknown;
  createdAt: string | Date;
}

interface Props {
  standId: string;
}

const TYPE_STYLES: Record<string, string> = {
  purchase: 'text-success',
  usage: 'text-error',
  refund: 'text-warning',
  grant: 'text-success',
};

export function CreditHistoryTable({ standId }: Props) {
  const [cursor, setCursor] = React.useState<string | undefined>();

  const { data, isLoading, error } = trpc.analytics.getCreditTransactions.useQuery({
    standId,
    limit: 50,
    cursor,
  });

  if (error) {
    return <div className="text-error p-4">{error.message}</div>;
  }

  const items = (data?.items ?? []) as CreditTxnItem[];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-primary">Credit History</h3>

      <CardTable.Root data={items} loading={isLoading}>
        <CardTable.Header className="px-4 py-2.5">
          <div className="flex-1 text-xs font-medium">Type</div>
          <div className="w-24 text-xs font-medium">Amount</div>
          <div className="w-24 text-xs font-medium hidden md:block">Balance After</div>
          <div className="w-32 text-xs font-medium text-right">Date</div>
        </CardTable.Header>

        <CardTable.Loading rows={5}>
          <Skeleton className="h-4 w-20" animate />
          <Skeleton className="h-4 w-16" animate />
          <Skeleton className="h-4 w-16 hidden md:block" animate />
          <Skeleton className="h-4 w-24 ml-auto" animate />
        </CardTable.Loading>

        <CardTable.EmptyState title="No credit history" subtile="Credit transactions will appear here once AI features are used." icon="icon-payment" />

        {items.map((txn) => (
          <CardTable.Row key={txn.id}>
            <div className="flex px-4 py-3 items-center gap-3">
              <div className="flex-1">
                <p className={clsx('text-sm capitalize', TYPE_STYLES[txn.type] ?? 'text-secondary')}>
                  {txn.type}
                </p>
              </div>
              <div className="w-24">
                <p className={clsx(
                  'text-sm font-medium',
                  Number(txn.amount) >= 0 ? 'text-success' : 'text-error',
                )}>
                  {Number(txn.amount) >= 0 ? '+' : ''}{Number(txn.amount).toFixed(2)}
                </p>
              </div>
              <div className="w-24 hidden md:block">
                <p className="text-secondary text-sm">
                  {txn.balanceAfter != null ? Number(txn.balanceAfter).toFixed(2) : '—'}
                </p>
              </div>
              <div className="w-32 text-right">
                <p className="text-tertiary text-sm">
                  {format(new Date(txn.createdAt), 'MMM dd, HH:mm')}
                </p>
              </div>
            </div>
          </CardTable.Row>
        ))}
      </CardTable.Root>

      {data?.nextCursor && (
        <div className="flex justify-center">
          <button
            onClick={() => setCursor(data.nextCursor)}
            className="text-sm text-secondary hover:text-primary transition-colors px-4 py-2"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
