import React from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Card } from '../card';

interface CalendarProps {
  events?: Date[];
  footer?: () => React.ReactElement | null;
  onSelectDate?: (date: Date) => void;
}

export function Calendar({ events, footer, onSelectDate }: CalendarProps) {
  const [selected, setSelected] = React.useState(new Date());
  const [active, setActive] = React.useState(new Date());

  const getWeekDaysNames = () => {
    const weekStartDate = startOfWeek(selected);
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(format(addDays(weekStartDate, day), 'EEEEE'));
    }
    return weekDays;
  };

  const getDates = () => {
    const startOfTheSelectedMonth = startOfMonth(active);
    const endOfTheSelectedMonth = endOfMonth(active);
    const startDate = startOfWeek(startOfTheSelectedMonth);
    const endDate = endOfWeek(endOfTheSelectedMonth);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  return (
    <Card.Root className="transition bg-transparent text-sm">
      <Card.Content>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium">{format(active, 'MMMM')}</span>
          <div className="flex items-center text-tertiary/[.56]">
            <button
              aria-label="prev-month"
              className="cursor-pointer hover:text-white focus:outline-none"
              onClick={() => setActive((prev) => addMonths(prev, -1))}
            >
              <i className="icon-chevron-left" />
            </button>
            <i className="icon-dot size-5" />
            <button
              aria-label="next-month"
              className="cursor-pointer hover:text-white focus:outline-none"
              onClick={() => setActive((prev) => addMonths(prev, 1))}
            >
              <i className="icon-chevron-right" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {getWeekDaysNames().map((d, idx) => (
            <span key={idx} className="text-tertiary font-medium text-center">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {getDates().map((d) => (
            <button
              aria-label={d.toString()}
              key={d.toString()}
              className={twMerge(
                'relative text-center cursor-pointer px-2.5 py-2 font-medium',
                clsx({
                  'text-tertiary/[.24]': !isSameMonth(d, active),
                  'text-tertiary/[.56]': events && !events.some((e) => isSameDay(e, d)),
                  'bg-tertiary text-black rounded-full': isEqual(selected, d),
                  'text-primary-400': isToday(d),
                }),
              )}
              onClick={() => {
                setSelected(d);
                onSelectDate?.(d);
              }}
            >
              {format(d, 'd')}
              {events && events.some((e) => isSameDay(e, d)) && (
                <div className="flex absolute bottom-0 left-0 right-0 justify-center">
                  <i className="icon-dot size-3" />
                </div>
              )}
            </button>
          ))}
        </div>
        {footer?.()}
      </Card.Content>
    </Card.Root>
  );
}
