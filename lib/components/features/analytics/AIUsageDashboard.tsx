'use client';

import React from 'react';
import { Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { trpc } from '$lib/trpc/client';
import { format } from 'date-fns';

interface Props {
  standId: string;
}

export function AIUsageDashboard({ standId }: Props) {
  const [dateRange] = React.useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start: start.toISOString(), end: end.toISOString() };
  });

  const { data: usageLogs, isLoading, error } = trpc.analytics.getStandUsage.useQuery(
    { standId, startDate: dateRange.start, endDate: dateRange.end },
    { staleTime: 2 * 60 * 1000 },
  );

  if (error) {
    return <div className="text-error p-4">{error.message}</div>;
  }

  const logs = (usageLogs ?? []) as Record<string, unknown>[];

  const totalTokens = logs.reduce((sum, log) => sum + (Number(log.total_tokens) || 0), 0);
  const totalCost = logs.reduce((sum, log) => sum + (Number(log.total_cost_usd) || 0), 0);
  const totalCredits = logs.reduce((sum, log) => sum + (Number(log.credits_used) || 0), 0);

  const stats = [
    { label: 'Total Requests', value: logs.length },
    { label: 'Total Tokens', value: totalTokens.toLocaleString() },
    { label: 'Total Cost', value: `$${totalCost.toFixed(4)}` },
    { label: 'Credits Used', value: totalCredits.toFixed(2) },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">AI Usage (Last 30 Days)</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-overlay-primary border border-card-border rounded-xl p-4">
            <p className="text-xs text-tertiary mb-1">{stat.label}</p>
            <p className="text-xl font-semibold text-primary">
              {isLoading ? <Skeleton className="h-7 w-16" animate /> : stat.value}
            </p>
          </div>
        ))}
      </div>

      <CardTable.Root data={logs} loading={isLoading}>
        <CardTable.Header className="px-4 py-2.5">
          <div className="flex-1 text-xs font-medium">Model</div>
          <div className="w-20 text-xs font-medium hidden md:block">Feature</div>
          <div className="w-20 text-xs font-medium hidden md:block">Tokens</div>
          <div className="w-20 text-xs font-medium hidden md:block">Cost</div>
          <div className="w-20 text-xs font-medium hidden md:block">Latency</div>
          <div className="w-32 text-xs font-medium text-right">Time</div>
        </CardTable.Header>

        <CardTable.Loading rows={5}>
          <Skeleton className="h-4 w-24" animate />
          <Skeleton className="h-4 w-16 hidden md:block" animate />
          <Skeleton className="h-4 w-12 hidden md:block" animate />
          <Skeleton className="h-4 w-16 ml-auto" animate />
        </CardTable.Loading>

        <CardTable.EmptyState title="No AI usage" subtile="AI usage logs will appear here once your AI features are used." icon="icon-sparkle" />

        {logs.map((log, idx) => (
          <CardTable.Row key={(log.request_id as string) ?? idx}>
            <div className="flex px-4 py-3 items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-primary text-sm truncate">{(log.model as string) ?? '—'}</p>
              </div>
              <div className="w-20 hidden md:block">
                <p className="text-secondary text-sm truncate">{(log.feature as string) ?? '—'}</p>
              </div>
              <div className="w-20 hidden md:block">
                <p className="text-secondary text-sm">{Number(log.total_tokens).toLocaleString()}</p>
              </div>
              <div className="w-20 hidden md:block">
                <p className="text-secondary text-sm">${Number(log.total_cost_usd).toFixed(4)}</p>
              </div>
              <div className="w-20 hidden md:block">
                <p className="text-secondary text-sm">
                  {log.latency_ms ? `${Number(log.latency_ms)}ms` : '—'}
                </p>
              </div>
              <div className="w-32 text-right">
                <p className="text-tertiary text-sm">
                  {log.created_at ? format(new Date(log.created_at as string), 'MMM dd, HH:mm') : '—'}
                </p>
              </div>
            </div>
          </CardTable.Row>
        ))}
      </CardTable.Root>
    </div>
  );
}
