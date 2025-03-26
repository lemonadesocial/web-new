import { format } from 'date-fns';
import { toZonedTime, format as formatTZ } from 'date-fns-tz';

export function convertFromUtcToTimezone(date: string, timezone?: string) {
  return timezone ? toZonedTime(date, timezone) : new Date(date);
}

export function formatWithTimezone(date: Date, formatString: string, timezone?: string) {
  return timezone ? formatTZ(date, formatString, { timeZone: timezone }) : format(date, formatString);
}
