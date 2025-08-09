import React from 'react';
import { addHours, format, isBefore } from 'date-fns';
import { FloatingPortal, Placement } from '@floating-ui/react';
import clsx from 'clsx';

import { TimezoneOption, timezoneOptions } from '$lib/utils/timezone';

import { Menu } from '../menu';
import { Button } from '../button';
import { Calendar } from './calendar';
import { Card } from '../card';
import { Spacer } from '../spacer';
import { Input } from '../input';

export function DateTimeGroup({
  start,
  end,
  onSelect,
  placement = 'top',
  minDate,
}: {
  start: string;
  end: string;
  minDate?: Date;
  onSelect: (value: { start: string; end: string }) => void;
  placement?: 'top' | 'bottom';
}) {
  const [startTime, setStartTime] = React.useState(start || new Date().toISOString());
  const [endTime, setEndTime] = React.useState(end || new Date().toISOString());

  return (
    <Card.Root style={{ overflow: 'inherit' }} className="w-full">
      <Card.Content className="pl-3.5 py-1 pr-1">
        <div className="flex relative flex-col">
          <div className="border-dashed border-l-2 border-l-[var(--color-divider)] absolute h-full left-1 top-4 z-10">
            <div className="size-2 backdrop-blur-lg bg-quaternary rounded-full -ml-[5px] -mt-1 absolute">
              <div className="size-2 rounded-full bg-quaternary" />
            </div>
          </div>

          <div className="ml-7.5 flex justify-between items-center">
            <p className="text-secondary">Start</p>
            <DateTimePicker
              minDate={minDate}
              placement={placement}
              value={startTime}
              onSelect={(datetime) => {
                let _endTime = endTime;
                if (isBefore(endTime, datetime)) {
                  _endTime = addHours(datetime, 1).toISOString();
                }

                setStartTime(datetime);
                setEndTime(_endTime);
                onSelect({ start: datetime, end: _endTime });
              }}
            />
          </div>
        </div>

        <Spacer className="h-1" />
        <div className="flex flex-col relative">
          <div className="border-dashed border-l-2 border-l-transparent absolute h-full left-1 top-3.5 z-10">
            <div className="size-2 border rounded-full -ml-[5px] absolute border-quaternary">
              <div className="size-2 rounded-full " />
            </div>
          </div>

          <div className="ml-7.5 flex justify-between items-center">
            <p className="text-secondary">End</p>
            <DateTimePicker
              value={endTime}
              minDate={minDate}
              placement={placement}
              onSelect={(datetime) => {
                let endTime = datetime;
                if (isBefore(endTime, startTime)) {
                  endTime = addHours(startTime, 1).toISOString();
                }

                setEndTime(endTime);
                onSelect({ start: startTime, end: endTime });
              }}
            />
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

export function DateTimePicker({
  value = '',
  onSelect,
  placement = 'top',
  minDate,
}: {
  value?: string;
  onSelect: (datetime: string) => void;
  placement?: 'top' | 'bottom';
  minDate?: Date;
}) {
  const times = React.useMemo(() => {
    const formatTime = (hour: number, minutes: number) => {
      const period = hour < 12 ? 'AM' : 'PM';
      const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return {
        value: `${hour.toString().padStart(2, '0')}:${formattedMinutes}`,
        label: `${formattedHour}:${formattedMinutes} ${period}`,
      };
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 2 }, (_, i) => i * 30);

    return hours.flatMap((hour) => minutes.map((minute) => formatTime(hour, minute)));
  }, []);

  const handleSelect = (args: { value: Date; timezone?: string }) => {
    onSelect(args.value.toISOString());
  };

  return (
    <div className="flex gap-0.5">
      <Menu.Root placement={placement}>
        <Menu.Trigger>
          <Button variant="tertiary" size="sm" className="rounded-e-none! min-w-[110px]! text-primary! min-h-[36px]! text-base">
            {format(value ? new Date(value) : new Date(), 'EEE, dd MMM')}
          </Button>
        </Menu.Trigger>
        <FloatingPortal>
          <Menu.Content className="w-[296px] p-0 rounded-lg">
            {({ toggle }) => (
              <Calendar
                minDate={minDate}
                selected={value ? new Date(value) : undefined}
                onSelectDate={(date = new Date()) => {
                  const datetime = value ? new Date(value) : new Date();
                  datetime.setFullYear(date.getFullYear());
                  datetime.setMonth(date.getMonth());
                  datetime.setDate(date.getDate());
                  handleSelect({ value: datetime });
                  toggle();
                }}
              />
            )}
          </Menu.Content>
        </FloatingPortal>
      </Menu.Root>
      <Menu.Root placement={placement}>
        <Menu.Trigger>
          <Button variant="tertiary" size="sm" className="rounded-s-none! min-w-[84px] text-primary! min-h-[36px]! text-base">
            {format(value ? new Date(value) : new Date(), 'hh:mm a')}
          </Button>
        </Menu.Trigger>
        <FloatingPortal>
          <Menu.Content className="w-[100px] no-scrollbar rounded-lg overflow-auto h-[200px] p-2">
            {({ toggle }) => {
              return (
                <div>
                  {times.map((t, i) => (
                    <Button
                      key={i}
                      variant="flat"
                      className="hover:bg-quaternary! w-full whitespace-nowrap"
                      onClick={() => {
                        const [hours, minutes] = t.value.split(':').map(Number);
                        const datetime = value ? new Date(value) : new Date();
                        datetime.setHours(hours);
                        datetime.setMinutes(minutes);
                        handleSelect({ value: datetime });
                        toggle();
                      }}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
              );
            }}
          </Menu.Content>
        </FloatingPortal>
      </Menu.Root>
    </div>
  );
}

export function Timezone({
  value,
  trigger,
  onSelect,
  placement = 'top',
  className,
  strategy = 'fixed',
}: {
  trigger: () => React.ReactElement;
  value?: TimezoneOption;
  onSelect: (zone: TimezoneOption) => void;
  placement?: Placement;
  className?: string;
  strategy?: 'fixed' | 'absolute';
}) {
  const [zones, setZone] = React.useState(timezoneOptions);
  const [query, setQuery] = React.useState('');

  return (
    <Menu.Root strategy={strategy} className={className} placement={placement}>
      <Menu.Trigger>{trigger()}</Menu.Trigger>
      <Menu.Content className="p-0 border-0 rounded-md!">
        {({ toggle }) => (
          <Card.Root>
            <Card.Header className="p-0">
              <Input
                className="rounded-none border-none"
                value={query}
                autoFocus
                onChange={(e) => {
                  const text = e.target.value;
                  setQuery(text);
                  if (!text) setZone(timezoneOptions);
                  else setZone(timezoneOptions.filter((p) => p.value.toLowerCase().includes(text.toLowerCase())));
                }}
              />
            </Card.Header>
            <Card.Content className="p-0 md:w-[446px]">
              <div className="p-1 overflow-auto h-[170px]">
                {zones.map((zone, i) => {
                  return (
                    <div
                      key={i}
                      className={clsx(
                        'flex justify-between items-center text-sm px-2 py-1.5 cursor-pointer hover:bg-[var(--btn-tertiary)]',
                        value?.value === zone.value,
                      )}
                      onClick={() => {
                        onSelect(zone);
                        setQuery('');
                        toggle();
                      }}
                    >
                      <p>{zone.value}</p>
                      <p>{zone.short}</p>
                    </div>
                  );
                })}
              </div>
            </Card.Content>
          </Card.Root>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
