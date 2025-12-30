'use client';

import React, { useMemo, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

import { Segment } from '$lib/components/core';
import { GetEventViewChartDataDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { formatNumber } from '$lib/utils/number';
import {
  TimeRange,
  TIME_RANGES,
  useTimeRange,
  groupDataByInterval,
  formatTooltipLabel,
} from '$lib/utils/chart';
import { useEvent } from '../store';

export function PageViewsChart() {
  const event = useEvent();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('All');

  const timeRange = useTimeRange(event, selectedRange);

  const { data, loading } = useQuery(GetEventViewChartDataDocument, {
    variables: {
      event: event?._id || '',
      start: timeRange.startTime.toISOString(),
      end: timeRange.endTime.toISOString(),
    },
    skip: !event?._id,
  });

  const chartData = useMemo(() => {
    const items = data?.getEventViewChartData?.items;
    if (!items || items.length === 0) return [];

    return groupDataByInterval(items, (item) => new Date(item.date), selectedRange);
  }, [data, selectedRange]);

  const totalViews = useMemo(() => {
    if (chartData.length === 0) return 0;
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  const formattedTotal = formatNumber(totalViews, true);

  return (
    <div>
      <div className="absolute top-4 left-0 px-4 z-10">
        <p className="text-tertiary text-sm">Page Views</p>
        <h4 className="text-2xl font-semibold">{formattedTotal}</h4>
      </div>

      <div className="flex justify-end items-center gap-2 pt-4 px-4">
        <Segment
          size="sm"
          selected={selectedRange}
          onSelect={(item) => setSelectedRange(item.value as TimeRange)}
          items={TIME_RANGES.map((range) => ({ value: range, label: range }))}
        />
      </div>

      <div className="h-[300px] w-full relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-tertiary">Loading...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-tertiary">
            <p>No view data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(253, 224, 71, 0.08)" />
                  <stop offset="100%" stopColor="rgba(253, 224, 71, 0)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                horizontal={false}
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-invert)',
                  borderRadius: '8px',
                  padding: '4px 8px'
                }}
                labelStyle={{
                  color: 'var(--color-primary-invert)',
                }}
                itemStyle={{
                  color: 'var(--color-primary-invert)',
                }}
                labelFormatter={(_, payload) => {
                  if (payload && payload[0] && payload[0].payload) {
                    return formatTooltipLabel(payload[0].payload.time, selectedRange);
                  }
                  return '';
                }}
                formatter={(value: number) => [formatNumber(value, true), 'Page Views']}
              />
              <Area
                type="linear"
                dataKey="count"
                stroke="rgba(253, 224, 71, 1)"
                fill="url(#viewsGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: 'rgba(253, 224, 71, 1)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
