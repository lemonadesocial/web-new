'use client';

import React, { useMemo, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

import { Card, Button, Menu, MenuItem, Segment } from '$lib/components/core';
import { GetEventTicketSoldChartDataDocument } from '$lib/graphql/generated/backend/graphql';
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

export function TicketsSoldChart() {
  const event = useEvent();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('All');
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);

  const timeRange = useTimeRange(event, selectedRange);

  const { data, loading } = useQuery(GetEventTicketSoldChartDataDocument, {
    variables: {
      event: event?._id || '',
      start: timeRange.startTime.toISOString(),
      end: timeRange.endTime.toISOString(),
      types: selectedTicketType ? [selectedTicketType] : undefined,
    },
    skip: !event?._id,
  });

  const chartData = useMemo(() => {
    const items = data?.getEventTicketSoldChartData?.items;
    if (!items || items.length === 0) return [];

    return groupDataByInterval(items, (item) => new Date(item.created_at), selectedRange);
  }, [data, selectedRange]);

  const totalTickets = useMemo(() => {
    if (chartData.length === 0) return 0;
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  const ticketTypes = useMemo(() => {
    return event?.event_ticket_types || [];
  }, [event]);

  const formattedTotal = formatNumber(totalTickets, true);

  const selectedTicketTypeData = ticketTypes.find((t) => t._id === selectedTicketType);
  const filterLabel = selectedTicketTypeData ? selectedTicketTypeData.title : 'All Tickets';

  return (
    <Card.Root>
      <Card.Content className="p-0 relative">
        <div className="absolute top-4 left-0 px-4 z-10">
          <p className="text-tertiary text-sm">Tickets Sold</p>
          <h4 className="text-2xl font-semibold">{formattedTotal}</h4>
        </div>

        <div className="flex justify-end items-center gap-2 pt-4 px-4">
          {ticketTypes.length > 0 && (
            <Menu.Root>
              <Menu.Trigger>
                <Button size="sm" variant="tertiary" iconLeft="icon-filter-line" iconRight="icon-chevron-down">
                  <span className="w-[72px] text-left truncate">{filterLabel}</span>
                </Button>
              </Menu.Trigger>
              <Menu.Content className="w-[184px] p-0">
                {({ toggle }) => (
                  <>
                    <div className="p-1 max-h-[200px] overflow-auto no-scrollbar">
                      <MenuItem
                        title="All Tickets"
                        iconRight={selectedTicketType === null ? 'text-primary! icon-check-filled' : undefined}
                        onClick={() => {
                          setSelectedTicketType(null);
                          toggle();
                        }}
                      />
                      <hr className="border-t border-t-divider my-2 -mx-1" />
                      {ticketTypes.map((ticketType) => (
                        <MenuItem
                          key={ticketType._id}
                          iconRight={selectedTicketType === ticketType._id ? 'text-primary! icon-check-filled' : undefined}
                          onClick={() => {
                            setSelectedTicketType(ticketType._id);
                            toggle();
                          }}
                        >
                          <p className="text-sm text-secondary truncate w-[136px]">{ticketType.title}</p>
                        </MenuItem>
                      ))}
                    </div>
                  </>
                )}
              </Menu.Content>
            </Menu.Root>
          )}

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
              <p>No ticket data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(168, 85, 247, 0.08)" />
                    <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
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
                  formatter={(value: number) => [formatNumber(value, true), 'Tickets Sold']}
                />
                <Area
                  type="linear"
                  dataKey="count"
                  stroke="rgba(168, 85, 247, 1)"
                  fill="url(#ticketsGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: 'rgba(168, 85, 247, 1)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card.Content>
    </Card.Root>
  );
}
