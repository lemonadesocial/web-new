import { format } from 'date-fns';
import { TZDate, tz } from '@date-fns/tz';

import { Maybe } from 'graphql/jsutils/Maybe';
import { toDate } from 'date-fns-tz';

export function convertFromUtcToTimezone(date: string, timezone?: Maybe<string>) {
  return timezone ? new TZDate(date, timezone) : new Date(date);
}

export function formatWithTimezone(date: Date, formatString: string, timezone?: Maybe<string>) {
  return timezone ? format(date, formatString, { in: tz(timezone) }) : format(date, formatString);
}

export function roundToNext30Minutes(date: Date) {
  const minutes = date.getMinutes();
  const minutesToAdd = 30 - (minutes % 30);
  const roundedDate = new Date(date);
  roundedDate.setMinutes(minutes + minutesToAdd);
  roundedDate.setSeconds(0);
  roundedDate.setMilliseconds(0);
  return roundedDate;
}

/**
 * Creates a new ISO-like string from a Date object,
 * preserving the date/time values while applying a new timezone offset.
 *
 * @param {Date} date - The original date object.
 * @param {string} offset - The new timezone offset (e.g., "+08:00" or "-05:00").
 * @returns {string} The formatted date string with the new offset.
 */
export function roundDateToHalfHour(date: Date) {
  const newDate = new Date(date.getTime());

  const minutes = newDate.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;

  // Set minutes and reset seconds/milliseconds.
  // The Date object automatically handles hour overflow if roundedMinutes is 60.
  newDate.setMinutes(roundedMinutes, 0, 0);

  return newDate;
}

export function combineDateAndTimeWithTimezone(date: Date, timeZone?: string | null) {
  if (!timeZone) return date;
  const dateWithoutTz = format(date, "yyyy-MM-dd'T'HH:mm:ss");
  return toDate(dateWithoutTz, { timeZone });
}

export function getTimeAgo(date: Date | number = Date.now()): string {
  const now = Date.now();
  const targetTime = typeof date === 'number' ? date : date.getTime();
  const diffMs = now - targetTime;
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) {
    return 'Just now';
  }
  
  if (diffHours < 1) {
    return `${diffMinutes}m ago`;
  }
  
  if (diffDays < 1) {
    return `${diffHours}h ago`;
  }
  
  return `${diffDays}d ago`;
}
