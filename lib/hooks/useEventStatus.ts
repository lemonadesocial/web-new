import { useEffect, useState } from 'react';
import { intervalToDuration } from 'date-fns';

export type EventStatus = 'upcoming' | 'starting-soon' | 'live' | 'ended' | 'unknown';

export type EventStatusData = {
  status: EventStatus;
  timeLabel: string;
};

export function useEventStatus(start?: string, end?: string): EventStatusData {
  const [data, setData] = useState<EventStatusData>({
    status: 'unknown',
    timeLabel: '',
  });

  useEffect(() => {
    if (!start) {
      setData({ status: 'unknown', timeLabel: '' });
      return;
    }

    const updateStatus = () => {
      const now = new Date();
      const startDate = new Date(start);
      const endDate = end ? new Date(end) : null;

      if (endDate && endDate <= now) {
        setData({ status: 'ended', timeLabel: '' });
        return;
      }

      if (startDate <= now) {
        setData({ status: 'live', timeLabel: '' });
        return;
      }

      const d = intervalToDuration({ start: now, end: startDate });

      const months = d.months ?? 0;
      const days = d.days ?? 0;
      const hours = (d.hours ?? 0) + days * 24;
      const minutes = d.minutes ?? 0;
      const seconds = d.seconds ?? 0;
      const status = hours === 0 && minutes < 60 ? 'starting-soon' : 'upcoming';

      let timeLabel = '';
      if (months > 0) {
        timeLabel = days > 0 ? `${months}m ${days}d` : `${months}m`;
      } else if (days > 1) {
        timeLabel = `${days}d`;
      } else if (hours > 0) {
        timeLabel = `${hours}h`;
        if (minutes > 0) {
          timeLabel += ` ${minutes}m`;
        }
      } else if (minutes > 0) {
        timeLabel = `${minutes}m`;
        if (seconds > 0) {
          timeLabel += ` ${seconds}s`;
        }
      } else if (seconds > 0) {
        timeLabel = `${seconds}s`;
      }

      setData({ status, timeLabel });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [start, end]);

  return data;
}
