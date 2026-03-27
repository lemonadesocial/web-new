'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Avatar, Skeleton } from '$lib/components/core';

export type KnowledgeBaseAgentAvatar = {
  _id: string;
  avatar?: string | null;
  name?: string | null;
};

interface KnowledgeBaseListRowProps {
  agents?: KnowledgeBaseAgentAvatar[];
  className?: string;
  text?: string | null;
  title?: string | null;
  trailingIcon?: string;
}

export const KnowledgeBaseListRow = React.memo(function KnowledgeBaseListRow({
  agents = [],
  className,
  text,
  title,
  trailingIcon,
}: KnowledgeBaseListRowProps) {
  const visibleAgents = agents.slice(0, 3);
  const overflowCount = Math.max(agents.length - visibleAgents.length, 0);

  return (
    <div className={twMerge('flex items-center gap-3 px-4 py-4', className)}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-card-border bg-white/8">
        <i aria-hidden="true" className="icon-book size-4 text-tertiary" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-primary">{title || 'Untitled'}</p>
        <p className="mt-0.5 line-clamp-1 text-sm text-tertiary">{text || 'No content added yet.'}</p>
      </div>

      {visibleAgents.length > 0 || overflowCount > 0 || trailingIcon ? (
        <div className="flex shrink-0 items-center gap-3">
          {visibleAgents.length > 0 || overflowCount > 0 ? (
            <div className="flex items-center -space-x-2">
              {visibleAgents.map((agent) => (
                <div key={agent._id} className="tooltip tooltip-top" data-tip={agent.name || 'Agent'}>
                  <Avatar src={agent.avatar || undefined} className="size-6 rounded-full border border-card-border" />
                </div>
              ))}

              {overflowCount > 0 ? (
                <div className="flex size-6 items-center justify-center rounded-full border border-card-border bg-background text-xs text-tertiary">
                  +{overflowCount}
                </div>
              ) : null}
            </div>
          ) : null}

          {trailingIcon ? <i aria-hidden="true" className={twMerge(trailingIcon, 'size-5 text-tertiary')} /> : null}
        </div>
      ) : null}
    </div>
  );
});

export function KnowledgeBaseListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <Skeleton className="size-8 rounded-lg" animate />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-32 rounded-md" animate />
        <Skeleton className="h-4 w-52 rounded-md" animate />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="size-6 rounded-full" animate />
        <Skeleton className="size-6 rounded-full" animate />
        <Skeleton className="size-5 rounded-full" animate />
      </div>
    </div>
  );
}

KnowledgeBaseListRow.displayName = 'KnowledgeBaseListRow';
