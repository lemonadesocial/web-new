'use client';

import React from 'react';
import { Skeleton } from '$lib/components/core';
import { trpc } from '$lib/trpc/client';

interface Props {
  eventId: string;
}

export function EventAnalyticsChart({ eventId }: Props) {
  const { data, isLoading, error } = trpc.analytics.getEventAnalytics.useQuery(
    { eventId },
    { staleTime: 5 * 60 * 1000 },
  );

  if (error) {
    return <div className="text-error p-4">{error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-overlay-primary rounded-xl p-4 space-y-2">
            <Skeleton className="h-4 w-20" animate />
            <Skeleton className="h-8 w-16" animate />
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-overlay-primary rounded-xl p-6 text-center text-tertiary">
        No analytics data available yet
      </div>
    );
  }

  const stats = [
    { label: 'Total Guests', value: Number(data.total_guests ?? 0), icon: 'icon-user-group-rounded' },
    { label: 'Checked In', value: Number(data.checked_in_count ?? 0), icon: 'icon-check-circle' },
    { label: 'Total Revenue', value: data.total_revenue ? `$${Number(data.total_revenue).toFixed(2)}` : '$0', icon: 'icon-payment' },
    { label: 'Approval Rate', value: Number(data.total_guests) ? `${Math.round((Number(data.approved_count ?? 0) / Number(data.total_guests)) * 100)}%` : '—', icon: 'icon-analytics' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-primary">Event Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-overlay-primary border border-card-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className={`${stat.icon} size-4 text-tertiary`} />
              <p className="text-xs text-tertiary">{stat.label}</p>
            </div>
            <p className="text-2xl font-semibold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
