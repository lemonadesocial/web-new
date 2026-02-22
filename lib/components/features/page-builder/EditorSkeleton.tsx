'use client';

import { Skeleton } from '$lib/components/core';

/**
 * EditorSkeleton — loading placeholder for the page builder editor shell.
 * Used by both the event and space editor route pages.
 */
export function EditorSkeleton() {
  return (
    <div className="flex flex-col h-dvh">
      {/* Top bar skeleton */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-5 w-32" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-20 rounded-sm" />
        <Skeleton className="h-8 w-20 rounded-sm" />
      </div>
      {/* Canvas skeleton */}
      <div className="flex-1 flex items-center justify-center bg-primary/4">
        <div className="w-full max-w-3xl mx-6 space-y-4">
          <Skeleton className="h-48 rounded-md" />
          <Skeleton className="h-32 rounded-md" />
          <Skeleton className="h-24 rounded-md" />
        </div>
      </div>
      {/* Bottom bar skeleton */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-sm" />
          <Skeleton className="h-7 w-16 rounded-sm" />
          <Skeleton className="h-7 w-16 rounded-sm" />
        </div>
        <div className="flex gap-1 items-center">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </div>
    </div>
  );
}
