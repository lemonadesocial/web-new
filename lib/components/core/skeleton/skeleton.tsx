'use client';
import clsx from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { Card } from '../card';

export function Skeleton({ className = '', animate = false }) {
  return (
    <div
      className={twMerge(
        'rounded-lg',
        clsx(animate ? 'animate-skeleton bg-linear-to-r from-primary/4 via-primary/10 to-primary/4' : 'bg-primary/4'),
        className,
      )}
      style={{ backgroundSize: '200% 100%' }}
    />
  );
}

export function SkeletonCard() {
  return (
    <Card.Root>
      <Card.Header className="h-10" />
      <Card.Content>
        <Skeleton animate className="h-4 w-[100px] rounded-full" />
        <Skeleton animate className="h-6 w-[300px] rounded-full mt-2" />
        <Skeleton animate className="h-4 w-[200px] rounded-full mt-4" />
        <Skeleton className="h-10 rounded-sm mt-4" />
      </Card.Content>
    </Card.Root>
  );
}
