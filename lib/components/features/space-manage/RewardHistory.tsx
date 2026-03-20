'use client';

import { format } from 'date-fns';
import clsx from 'clsx';

import type { AtlasRewardTransaction } from '$lib/types/atlas';

interface RewardHistoryProps {
  transactions: AtlasRewardTransaction[];
  loading: boolean;
}

const statusBadge: Record<AtlasRewardTransaction['status'], { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning-300/16 text-warning-300' },
  completed: { label: 'Completed', className: 'bg-success-500/16 text-success-500' },
  expired: { label: 'Expired', className: 'bg-danger-500/16 text-danger-500' },
};

const typeIcon: Record<AtlasRewardTransaction['type'], string> = {
  cashback: 'icon-arrow-down-left',
  redemption: 'icon-arrow-up-right',
  bonus: 'icon-gift',
};

export function RewardHistory({ transactions, loading }: RewardHistoryProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-md border border-card-border animate-pulse">
            <div className="size-8 rounded-full bg-overlay-secondary" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-2/3 rounded bg-overlay-secondary" />
              <div className="h-2.5 w-1/3 rounded bg-overlay-secondary" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <i aria-hidden="true" className="icon-receipt size-8 text-quaternary mb-2" />
        <p className="text-secondary text-sm">No reward transactions yet</p>
        <p className="text-quaternary text-xs mt-0.5">Purchase event tickets to start earning rewards</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => {
        const badge = statusBadge[tx.status];
        const isPositive = tx.type !== 'redemption';

        return (
          <div
            key={tx.id}
            className="flex items-center gap-3 p-3 rounded-md border border-card-border bg-overlay-secondary"
          >
            <span className="size-8 rounded-full bg-accent-400/10 flex items-center justify-center shrink-0">
              <i aria-hidden="true" className={clsx(typeIcon[tx.type], 'size-4 text-accent-400')} />
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-primary text-sm truncate">{tx.description}</p>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-quaternary">
                  {format(new Date(tx.created_at), 'MMM d, yyyy')}
                </span>
                {tx.event_title && (
                  <>
                    <span className="text-quaternary">&middot;</span>
                    <span className="text-tertiary truncate">{tx.event_title}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={clsx('text-sm font-medium', isPositive ? 'text-success-500' : 'text-primary')}>
                {isPositive ? '+' : '-'}
                {tx.amount} {tx.currency}
              </span>
              <span className={clsx('px-1.5 py-0.5 rounded text-[10px] font-medium', badge.className)}>
                {badge.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
