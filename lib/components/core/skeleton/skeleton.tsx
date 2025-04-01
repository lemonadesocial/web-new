'use client';
import * as React from 'react';

export function Skeleton({ width = '100%', height = '1em' }) {
  return (
    <div
      style={{ width, height }}
      className="relative overflow-hidden bg-card rounded-md"
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary/[.04] to-transparent"></div>
    </div>
  );
}

export function SkeletonBox({ rows = 2 }) {
  const skeletonComponents = React.useMemo(
    () => Array.from({ length: rows }, () => `${Math.floor(Math.random() * 71) + 30}%`),
    [rows]
  );

  return (
    <div className="flex flex-col gap-4 mt-3">
      {skeletonComponents.map((width, index) => (
        <Skeleton key={index} width={width} />
      ))}
    </div>
  );
}
