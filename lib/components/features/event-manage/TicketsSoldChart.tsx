'use client';

import React, { useMemo, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

import { Card, Button, Menu, MenuItem, Segment } from '$lib/components/core';
import { GetEventTicketSoldChartDataDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { formatNumber } from '$lib/utils/number';
import { useEvent } from './store';

type TimeRange = '1H' | '1D' | '1W' | '1M' | 'All';

export function TicketsSoldChart() {
  const event = useEvent();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('All');
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);

  const timeRange = useMemo(() => {
    if (!event) {
      return { startTime: new Date(), endTime: new Date() };
    }

    const eventStart = event.stamp ? new Date(event.stamp) : null;
    const eventEnd = event.end ? new Date(event.end) : null;
    const now = new Date();

    let calculatedEndTime = now;
    if (eventEnd && eventEnd < now) {
      calculatedEndTime = eventEnd;
    }

    let calculatedStartTime: Date;

    switch (selectedRange) {
      case '1H':
        calculatedStartTime = new Date(calculatedEndTime.getTime() - 60 * 60 * 1000);
        break;
      case '1D':
        calculatedStartTime = new Date(calculatedEndTime.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1W':
        calculatedStartTime = new Date(calculatedEndTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        calculatedStartTime = new Date(calculatedEndTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'All':
        calculatedStartTime = eventStart || new Date(calculatedEndTime.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        calculatedStartTime = new Date(calculatedEndTime.getTime() - 24 * 60 * 60 * 1000);
    }

    if (eventStart && calculatedStartTime < eventStart) {
      calculatedStartTime = eventStart;
    }

    return { startTime: calculatedStartTime, endTime: calculatedEndTime };
  }, [selectedRange, event]);

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
    if (!data?.getEventTicketSoldChartData?.items) return [];

    const items = data.getEventTicketSoldChartData.items;
    if (items.length === 0) return [];

    const groupedData: Record<string, number> = {};

    items.forEach((item) => {
      const date = new Date(item.created_at);
      const intervalKey = getIntervalKey(date, selectedRange);
      
      if (!groupedData[intervalKey]) {
        groupedData[intervalKey] = 0;
      }
      groupedData[intervalKey]++;
    });

    const result: Array<{ time: string; count: number }> = [];
    const sortedKeys = Object.keys(groupedData).sort();

    sortedKeys.forEach((key) => {
      result.push({
        time: key,
        count: groupedData[key],
      });
    });

    return result;
  }, [data, selectedRange, timeRange]);

  const totalTickets = useMemo(() => {
    if (chartData.length === 0) return 0;
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  const ticketTypes = useMemo(() => {
    return event?.event_ticket_types || [];
  }, [event]);

  const timeRanges: TimeRange[] = ['1H', '1D', '1W', '1M', 'All'];

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
                  <span className="w-[66px] text-left truncate">{filterLabel}</span>
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
            items={timeRanges.map((range) => ({ value: range, label: range }))}
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
                      const timeValue = payload[0].payload.time;
                      const date = new Date(timeValue);
                      
                      switch (selectedRange) {
                        case '1H':
                          return format(date, 'h:mm');
                        case '1D':
                          return format(date, 'MMM d, h:mm a');
                        case '1W':
                        case '1M':
                        case 'All':
                          return format(date, 'MMM d, yyyy');
                        default:
                          return format(date, 'MMM d, yyyy HH:mm');
                      }
                    }
                    return '';
                  }}
                  formatter={(value: number) => [formatNumber(value, true), 'Tickets Sold']}
                />
                <Area
                  type="monotone"
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

function getIntervalKey(date: Date, range: TimeRange): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  switch (range) {
    case '1H':
      return new Date(year, month, day, hour, minute).toISOString();
    case '1D':
      return new Date(year, month, day, hour).toISOString();
    case '1W':
      return new Date(year, month, day).toISOString();
    case '1M':
      return new Date(year, month, day).toISOString();
    case 'All':
      return new Date(year, month, day).toISOString();
    default:
      return new Date(year, month, day, hour).toISOString();
  }
}

