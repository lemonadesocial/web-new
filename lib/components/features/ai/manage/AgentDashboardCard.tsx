'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Avatar, Card, Skeleton } from '$lib/components/core';

interface AgentDashboardCardProps {
  id: string;
  avatarSrc?: string;
  count?: number;
  countIcon?: string;
  description?: string | null;
  isPrivate?: boolean;
  job?: string | null;
  name?: string | null;
  onClick?: (id: string) => void;
  className?: string;
}

export const AgentDashboardCard = React.memo(function AgentDashboardCard({
  id,
  avatarSrc,
  count = 0,
  countIcon = 'icon-book',
  description,
  isPrivate = false,
  job,
  name,
  onClick,
  className,
}: AgentDashboardCardProps) {
  const handleClick = React.useMemo(() => (onClick ? () => onClick(id) : undefined), [id, onClick]);

  return (
    <Card.Root onClick={handleClick} className={twMerge('flex min-h-46 flex-col gap-4 p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <Avatar src={avatarSrc} className="size-12 shrink-0 rounded-full" />

        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1 text-sm text-tertiary">
          <i aria-hidden="true" className={twMerge(countIcon, 'size-4 shrink-0')} />
          <span>{count}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {isPrivate ? (
              <div className="flex size-5 items-center justify-center rounded-full bg-accent-400/16">
                <i aria-hidden="true" className="icon-sparkles size-3 text-accent-400" />
              </div>
            ) : null}

            <p className="truncate font-body-default text-lg leading-6 font-medium text-white">
              {name || 'Untitled Agent'}
            </p>
          </div>

          {job ? <p className="truncate text-sm leading-5 text-tertiary">{job}</p> : null}
        </div>

        <p className="line-clamp-2 text-sm leading-5 text-secondary">
          {description || 'No description added yet.'}
        </p>
      </div>
    </Card.Root>
  );
});

export function AgentDashboardCardSkeleton() {
  return (
    <Card.Root className="flex min-h-46 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="size-12 rounded-full" animate />
        <Skeleton className="h-7 w-14 rounded-full" animate />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-6 w-32 rounded-lg" animate />
        <Skeleton className="h-5 w-24 rounded-md" animate />
        <Skeleton className="h-5 w-full rounded-md" animate />
        <Skeleton className="h-5 w-4/5 rounded-md" animate />
      </div>
    </Card.Root>
  );
}

AgentDashboardCard.displayName = 'AgentDashboardCard';
