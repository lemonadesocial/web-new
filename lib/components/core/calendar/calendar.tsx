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
  isBefore,
  startOfDay,
} from 'date-fns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Card } from '../card';

interface CalendarProps {
  events?: Date[];
  footer?: () => React.ReactElement | null;
  selected?: Date;
  onSelectDate?: (date?: Date) => void;
  minDate?: Date;
}

export function Calendar({ events, minDate, selected: selectedDate, footer, onSelectDate }: CalendarProps) {
  const [selected, setSelected] = React.useState<Date>();
  const [active, setActive] = React.useState(new Date());

  React.useEffect(() => {
    setSelected(selectedDate);
  }, [selectedDate]);

  const getWeekDaysNames = () => {
    const weekStartDate = startOfWeek(selected || new Date());
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
          <span className="text-lg font-medium text-primary">{format(active, 'MMMM')}</span>
          <div className="flex items-center text-tertiary">
            <button
              type="button"
              aria-label="prev-month"
              className="cursor-pointer hover:text-primary focus:outline-none"
              onClick={() => setActive((prev) => addMonths(prev, -1))}
            >
              <i aria-hidden="true" className="icon-chevron-left" />
            </button>
            <i aria-hidden="true" className="icon-dot size-5" />
            <button
              type="button"
              aria-label="next-month"
              className="cursor-pointer hover:text-primary focus:outline-none"
              onClick={() => setActive((prev) => addMonths(prev, 1))}
            >
              <i aria-hidden="true" className="icon-chevron-right" />
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
              type="button"
              disabled={minDate && isBefore(d, minDate)}
              aria-label={d.toString()}
              key={d.toString()}
              className={twMerge(
                'relative text-center cursor-pointer text-sm px-2.5 py-2 font-medium size-9 hover:bg-primary/8 rounded-full',
                clsx({
                  'text-quaternary': !isSameMonth(d, active) || (minDate && isBefore(d, minDate)),
                  'cursor-not-allowed': minDate && isBefore(d, minDate),
                  'text-tertiary hover:bg-transparent': events && !events.some((e) => isSameDay(e, d)),
                  'bg-primary text-primary-invert rounded-full hover:bg-primary':
                    selected && isEqual(startOfDay(selected), d),
                  'text-accent-500': isToday(d),
                  'bg-accent-500 text-tertiary rounded-full': selected && isEqual(selected, d) && isToday(d),
                }),
              )}
              onClick={() => {
                if (events && !events.some((e) => isSameDay(e, d))) {
                  return;
                }

                let _d: Date | undefined = d;
                if (selected && isSameDay(selected, _d)) _d = undefined;
                setSelected(_d);
                onSelectDate?.(_d);
              }}
            >
              {format(d, 'd')}
              {events && events.some((e) => isSameDay(e, d)) && (
                <div className="flex absolute bottom-0 left-0 right-0 justify-center">
                  <i aria-hidden="true" className="icon-dot size-3" />
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
