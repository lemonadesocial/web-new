'use client';

import React from 'react';
import { Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { trpc } from '$lib/trpc/client';
import { format } from 'date-fns';

interface Props {
  spaceId: string;
}

export function APIUsageDashboard({ spaceId }: Props) {
  const currentPeriod = format(new Date(), 'yyyy-MM');

  const { data: dailyUsage, isLoading: loadingDaily, error: dailyError } = trpc.analytics.getApiUsage.useQuery(
    { spaceId },
    { staleTime: 5 * 60 * 1000 },
  );

  const { data: quota, isLoading: loadingQuota, error: quotaError } = trpc.analytics.getApiQuota.useQuery(
    { spaceId, period: currentPeriod },
    { staleTime: 5 * 60 * 1000 },
  );

  const error = dailyError || quotaError;
  if (error) {
    return <div className="text-error p-4">{error.message}</div>;
  }

  const isLoading = loadingDaily || loadingQuota;
  const days = (dailyUsage ?? []) as Record<string, unknown>[];

  const quotaStats = [
    { label: 'API Calls This Month', value: quota?.callCount?.toLocaleString() ?? '0' },
    { label: 'Overage Calls', value: quota?.overageCalls?.toLocaleString() ?? '0' },
    { label: 'Overage Billed', value: quota ? `$${Number(quota.overageBilled).toFixed(2)}` : '$0.00' },
    { label: 'Period', value: currentPeriod },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">API Usage</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quotaStats.map((stat) => (
          <div key={stat.label} className="bg-overlay-primary border border-card-border rounded-xl p-4">
            <p className="text-xs text-tertiary mb-1">{stat.label}</p>
            <p className="text-xl font-semibold text-primary">
              {isLoading ? <Skeleton className="h-7 w-16" animate /> : stat.value}
            </p>
          </div>
        ))}
      </div>

      <CardTable.Root data={days} loading={loadingDaily}>
        <CardTable.Header className="px-4 py-2.5">
          <div className="flex-1 text-xs font-medium">Date</div>
          <div className="w-24 text-xs font-medium">Calls</div>
          <div className="w-24 text-xs font-medium hidden md:block">Avg Response</div>
          <div className="w-24 text-xs font-medium hidden md:block">Errors</div>
        </CardTable.Header>

        <CardTable.Loading rows={5}>
          <Skeleton className="h-4 w-24" animate />
          <Skeleton className="h-4 w-12" animate />
          <Skeleton className="h-4 w-12 hidden md:block" animate />
          <Skeleton className="h-4 w-12 hidden md:block" animate />
        </CardTable.Loading>

        <CardTable.EmptyState title="No API usage" subtile="API usage data will appear here once your API keys are used." icon="icon-code" />

        {days.map((day, idx) => (
          <CardTable.Row key={idx}>
            <div className="flex px-4 py-3 items-center gap-3">
              <div className="flex-1">
                <p className="text-primary text-sm">
                  {day.day ? format(new Date(day.day as string), 'MMM dd, yyyy') : '—'}
                </p>
              </div>
              <div className="w-24">
                <p className="text-secondary text-sm">{Number(day.total_calls ?? 0).toLocaleString()}</p>
              </div>
              <div className="w-24 hidden md:block">
                <p className="text-secondary text-sm">
                  {day.avg_response_ms ? `${Math.round(Number(day.avg_response_ms))}ms` : '—'}
                </p>
              </div>
              <div className="w-24 hidden md:block">
                <p className="text-secondary text-sm">{Number(day.error_count ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </CardTable.Row>
        ))}
      </CardTable.Root>
    </div>
  );
}
