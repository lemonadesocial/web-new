import { useMemo } from 'react';
import { format } from 'date-fns';

import { Event } from '$lib/graphql/generated/backend/graphql';

export type TimeRange = '1H' | '1D' | '1W' | '1M' | 'All';

export const TIME_RANGES: TimeRange[] = ['1H', '1D', '1W', '1M', 'All'];

export function useTimeRange(event: Event | null | undefined, selectedRange: TimeRange) {
  return useMemo(() => {
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
}

export function getIntervalKey(date: Date, range: TimeRange): string {
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
    case '1M':
    case 'All':
      return new Date(year, month, day).toISOString();
    default:
      return new Date(year, month, day, hour).toISOString();
  }
}

export function groupDataByInterval<T>(
  items: T[],
  getDate: (item: T) => Date,
  range: TimeRange
): Array<{ time: string; count: number }> {
  const groupedData: Record<string, number> = {};

  items.forEach((item) => {
    const date = getDate(item);
    const intervalKey = getIntervalKey(date, range);

    if (!groupedData[intervalKey]) {
      groupedData[intervalKey] = 0;
    }
    groupedData[intervalKey]++;
  });

  const sortedKeys = Object.keys(groupedData).sort();

  return sortedKeys.map((key) => ({
    time: key,
    count: groupedData[key],
  }));
}

export function formatTooltipLabel(timeValue: string, range: TimeRange): string {
  const date = new Date(timeValue);

  switch (range) {
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

export function getIntervalLabel(range: TimeRange): string {
  switch (range) {
    case '1H':
      return 'M';
    case '1D':
      return 'H';
    case '1W':
    case '1M':
    case 'All':
      return 'D';
    default:
      return 'H';
  }
}

