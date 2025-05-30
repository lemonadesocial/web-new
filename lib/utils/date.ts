import { format } from 'date-fns';
import { TZDate, tz } from '@date-fns/tz';

import { Maybe } from 'graphql/jsutils/Maybe';

export function convertFromUtcToTimezone(date: string, timezone?: Maybe<string>) {
  return timezone ? new TZDate(date, timezone) : new Date(date);
}

export function formatWithTimezone(date: Date, formatString: string, timezone?: Maybe<string>) {
  return timezone ? format(date, formatString, { in: tz(timezone) }) : format(date, formatString);
}
