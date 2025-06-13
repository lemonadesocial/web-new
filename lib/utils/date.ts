import { format } from 'date-fns';
import { TZDate, tz } from '@date-fns/tz';

import { Maybe } from 'graphql/jsutils/Maybe';

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
