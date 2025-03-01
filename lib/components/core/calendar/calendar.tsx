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

export function Calendar({ events, footer }: { events?: Date[]; footer?: React.ReactElement }) {
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
    <Card className="transition bg-transparent text-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-medium">{format(active, 'MMMM')}</span>
        <div className="flex items-center text-tertiary/[.56]">
          <button
            className="hover:text-white focus:outline-none"
            onClick={() => setActive((prev) => addMonths(prev, -1))}
          >
            <i className="icon-chevron-left" />
          </button>
          <i className="icon-dot size-5" />
          <button
            className="hover:text-white focus:outline-none"
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
            key={d.toString()}
            className={twMerge(
              'relative text-center cursor-pointer px-2.5 py-2 font-medium',
              clsx({
                'text-tertiary/[.24]': !isSameMonth(d, active),
                'text-tertiary/[.56]': events && !events.some((e) => isSameDay(e, d)),
                'text-primary-400': isEqual(selected, d),
                'bg-tertiary/[.08] rounded-sm': isToday(d),
              }),
            )}
            onClick={() => setSelected(d)}
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
      {footer}
    </Card>
  );
}
