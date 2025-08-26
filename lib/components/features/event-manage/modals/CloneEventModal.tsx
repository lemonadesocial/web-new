import React from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { getTimezoneOffset } from 'date-fns-tz';
import { getTimezone } from 'countries-and-timezones';

import {
  Button,
  Card,
  Dropdown,
  Menu,
  InputField,
  modal,
  Segment,
  Skeleton,
  Spacer,
  MenuItem,
} from '$lib/components/core';
import { DateTimePicker, Timezone } from '$lib/components/core/calendar';
import {
  CloneEventDocument,
  Event,
  GenerateRecurringDatesDocument,
  GetEventDocument,
  GetSpacesDocument,
  RecurringRepeat,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { combineDateAndTimeWithTimezone, roundDateToHalfHour } from '$lib/utils/date';
import { getTimezoneOption } from '$lib/utils/timezone';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { communityAvatar } from '$lib/utils/community';
import { CloneEventSuccessModal } from './CloneEventSuccessModal';

const STATE_OPTS = [
  { key: false, value: 'Public', icon: 'icon-globe' },
  { key: true, value: 'Private', icon: 'icon-sparkles' },
];

type FormValues = {
  dates: string[];
  timezone?: string | null;
  community: string;
  private: boolean;
};

export function CloneEventModal({ event }: { event: Event }) {
  const { data: dataCommunity } = useQuery(GetSpacesDocument, {
    variables: { with_my_spaces: true, roles: [SpaceRole.Admin, SpaceRole.Creator] },
  });
  const communities = (dataCommunity?.listSpaces as Space[])?.slice().sort((a, _) => (a.personal ? -1 : 1)) || [];

  const today = new Date();
  const [isRecurrence, setIsRecurrence] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);

  const { control, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      dates: [roundDateToHalfHour(addDays(today, 1)).toISOString()],
      timezone: event.timezone,
      community: event.space,
      private: event.private as boolean,
    },
  });

  const [cloneEvent, { loading }] = useMutation(CloneEventDocument, {
    onComplete: async (client, data) => {
      setFetching(true);
      const promises: Promise<any>[] = [];
      data.cloneEvent.map((id) => promises.push(client.query({ query: GetEventDocument, variables: { id } })));

      const list = await Promise.all(promises);
      const events = list.map((i) => i.data.getEvent);
      modal.close();
      setTimeout(() => modal.open(CloneEventSuccessModal, { props: { events }, dismissible: false }));
    },
  });

  const onSubmit = (values: FormValues) => {
    const dates = values.dates.map((date) =>
      new Date(combineDateAndTimeWithTimezone(new Date(date), values.timezone)).toISOString(),
    );

    cloneEvent({
      variables: {
        input: {
          event: event._id,
          dates,
          overrides: {
            timezone: values.timezone,
            private: values.private,
            space: !event.subevent_parent ? values.community : undefined,
          },
        },
      },
    });
  };

  if (isRecurrence)
    return (
      <Recurrence
        onBack={() => setIsRecurrence(false)}
        start={roundDateToHalfHour(today)}
        onAdd={(dates) => setValue('dates', dates)}
      />
    );

  return (
    <Card.Root className="w-full md:w-[350px] overflow-visible bg-none">
      <Card.Header className="bg-transparent flex justify-between items-start">
        <div className="size-[56px] rounded-full flex items-center justify-center bg-(--btn-tertiary)">
          <i className="icon-duplicate " />
        </div>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <div>
          <p className="text-lg">Clone Event</p>
          <Spacer className="h-1" />
          <p className="text-lg text-tertiary">{event.title}</p>
          <Spacer className="h-2" />
          <p className="text-sm text-secondary">
            Everything except the guest list and event blasts will be copied over.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4 items-end">
            <Controller
              control={control}
              name="community"
              render={({ field }) => {
                const opt = communities.find((item) => item._id === field.value);
                return (
                  <Menu.Root disabled={event.subevent_parent} className="flex-1 w-full">
                    <Menu.Trigger>
                      <InputField
                        iconLeft={
                          <div className="size-5 rounded-xs overflow-hidden relative">
                            <img
                              className="w-full h-full outline outline-tertiary/4 rounded-xs"
                              src={communityAvatar(opt)}
                              alt={opt?.title}
                              loading="lazy"
                            />

                            {!opt?.image_avatar_expanded && (
                              <img
                                src={`${ASSET_PREFIX}/assets/images/blank-avatar.svg`}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62%] h-[62%]"
                              />
                            )}
                          </div>
                        }
                        label="Community"
                        value={opt?.title}
                        readOnly
                        right={{ icon: 'icon-chevron-down' }}
                      />
                    </Menu.Trigger>

                    <Menu.Content className="w-full p-2 max-h-[200px] overflow-auto">
                      {({ toggle }) =>
                        communities.map((item) => {
                          return (
                            <MenuItem
                              iconRight={item._id === field.value ? 'text-primary! icon-richtext-check' : undefined}
                              onClick={() => {
                                setValue('community', item._id);
                                toggle();
                              }}
                              iconLeft={
                                <div className="size-5 rounded-xs overflow-hidden relative">
                                  <img
                                    className="w-full h-full outline outline-tertiary/4 rounded-xs"
                                    src={communityAvatar(item)}
                                    alt={item?.title}
                                    loading="lazy"
                                  />

                                  {!item?.image_avatar_expanded && (
                                    <img
                                      src={`${ASSET_PREFIX}/assets/images/blank-avatar.svg`}
                                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62%] h-[62%]"
                                    />
                                  )}
                                </div>
                              }
                              title={item.title}
                            />
                          );
                        })
                      }
                    </Menu.Content>
                  </Menu.Root>
                );
              }}
            />

            <Controller
              control={control}
              name="private"
              render={({ field }) => {
                const opt = STATE_OPTS.find((item) => field.value === item.key);
                return (
                  <Menu.Root disabled={event.subevent_parent} className="w-24">
                    <Menu.Trigger>
                      <InputField iconLeft={opt?.icon} readOnly right={{ icon: 'icon-chevron-down' }} />
                    </Menu.Trigger>
                    <Menu.Content>
                      {({ toggle }) =>
                        STATE_OPTS.map((item) => (
                          <MenuItem
                            key={item.value}
                            iconLeft={item.icon}
                            title={item.value}
                            iconRight={field.value === item.key ? 'text-primary! icon-richtext-check' : ''}
                            onClick={() => {
                              setValue('private', item.key);
                              toggle();
                            }}
                          />
                        ))
                      }
                    </Menu.Content>
                  </Menu.Root>
                );
              }}
            />
          </div>

          <Controller
            control={control}
            name="dates"
            render={({ field }) => {
              return (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary text-sm font-medium">New Time</label>
                    <div className="flex flex-col gap-2 max-h-56 overflow-auto no-scrollbar">
                      {field.value.map((d) => (
                        <div key={d} className="flex items-center justify-between gap-3">
                          <DateTimePicker
                            className="flex w-full [&_.trigger-date]:flex-1 [&_button]:w-full [&_button]:justify-start"
                            minDate={today}
                            value={d}
                            onSelect={(date) => {
                              setValue(
                                'dates',
                                field.value.map((item) => (item === d ? date : item)),
                              );
                            }}
                          />
                          {field.value.length > 1 && (
                            <Button
                              icon="icon-x"
                              variant="tertiary"
                              className="size-[36px]!"
                              onClick={() =>
                                setValue(
                                  'dates',
                                  field.value.filter((item) => item !== d),
                                )
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="tertiary-alt"
                      iconLeft="icon-plus"
                      size="sm"
                      onClick={() => {
                        const newDate = addDays(new Date(field.value.at(-1) as string), 1).toISOString();
                        setValue('dates', [...field.value, newDate]);
                      }}
                    >
                      Add Time
                    </Button>

                    <Button
                      variant="tertiary-alt"
                      iconLeft="icon-layers-outline"
                      size="sm"
                      onClick={() => setIsRecurrence(true)}
                    >
                      Recurrence
                    </Button>
                  </div>
                </div>
              );
            }}
          />

          <Controller
            name="timezone"
            control={control}
            render={({ field }) => {
              const zone = getTimezoneOption(field.value as string);
              return (
                <Timezone
                  value={zone}
                  trigger={() => (
                    <button
                      type="button"
                      className="btn btn-tertiary inline-flex items-center w-full rounded-sm h-[40px] pl-3.5 pr-2.5"
                    >
                      <div className="flex flex-1 w-3xs md:w-auto items-center gap-2.5 truncate">
                        <i className="icon-globe size-[20px]" />
                        <span className="truncate w-fit">{zone?.text}</span>
                      </div>
                      <i className="icon-chevron-down size-[20px]" />
                    </button>
                  )}
                  onSelect={(data) => {
                    setValue('timezone', data.value);
                  }}
                />
              );
            }}
          />

          <Button type="submit" variant="secondary" loading={loading || fetching}>
            Clone Event
          </Button>
        </form>
      </Card.Content>
    </Card.Root>
  );
}

const RepeatOpts = [
  { key: RecurringRepeat.Daily, value: 'Daily' },
  { key: RecurringRepeat.Weekly, value: 'Weekly' },
  { key: RecurringRepeat.Monthly, value: 'Monthly' },
];

type RecurrenceFormValues = {
  start: string;
  frequency: RecurringRepeat;
  dayOfWeeks: number[];
};

function Recurrence({
  onBack,
  start,
  timezone,
  onAdd,
}: {
  onBack: () => void;
  start: Date;
  timezone?: string;
  onAdd: (dates: string[]) => void;
}) {
  const [isUntilMode, setIsUntilMode] = React.useState(false);

  const [count, setCount] = React.useState(5);
  const [end, setEnd] = React.useState(addDays(start, 28));

  const weekDays = React.useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 0 }); // Start the calculation from Sunday

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    // Rearrange to display Monday first
    const orderedDaysOfWeek = [...daysOfWeek.slice(1), daysOfWeek[0]];

    return orderedDaysOfWeek;
  }, []);

  const { control, setValue, watch } = useForm<RecurrenceFormValues>({
    defaultValues: {
      start: roundDateToHalfHour(start).toISOString(),
      frequency: RecurringRepeat.Weekly,
      dayOfWeeks: [start.getDay()],
    },
  });

  const [frequency, dayOfWeeks] = watch(['frequency', 'dayOfWeeks']);

  const { data, loading } = useQuery(GenerateRecurringDatesDocument, {
    variables: {
      input: {
        start,
        utcOffsetMinutes: timezone ? Math.floor(getTimezoneOffset(timezone) / (1000 * 60)) : 0,
        repeat: frequency,
        count: isUntilMode ? undefined : count,
        end: isUntilMode ? new Date(end.setHours(23, 59, 59, 999)).toISOString() : undefined,
        dayOfWeeks: frequency === 'weekly' ? dayOfWeeks : undefined,
      },
    },
  });

  const toggleDay = (day: number) => {
    if (dayOfWeeks.includes(day)) {
      setValue(
        'dayOfWeeks',
        dayOfWeeks.filter((d) => d !== day),
      );
      return;
    }

    setValue('dayOfWeeks', [...dayOfWeeks, day]);
  };

  return (
    <Card.Root className="w-full md:w-[350px] overflow-visible bg-transparent">
      <Card.Header className="bg-transparent flex justify-between items-center">
        <Button icon="icon-chevron-left" size="xs" variant="tertiary" className="rounded-full" onClick={onBack} />
        <p className="flex-1 text-center">Choose Times</p>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <Controller
          control={control}
          name="start"
          render={({ field }) => {
            return (
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary text-sm font-medium">Starting on </label>
                <DateTimePicker
                  className="flex w-full [&_.trigger-date]:flex-1 [&_button]:w-full [&_button]:justify-start"
                  minDate={new Date()}
                  value={field.value}
                  onSelect={(date) => setValue('start', date)}
                />
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="frequency"
          render={({ field }) => {
            return (
              <div className="flex items-center justify-between">
                <p>Repeats</p>
                <div className="w-32">
                  <Dropdown
                    options={RepeatOpts}
                    value={RepeatOpts.find((item) => item.key === field.value)}
                    onSelect={(opt) => setValue('frequency', opt.key as RecurringRepeat)}
                  />
                </div>
              </div>
            );
          }}
        />

        {frequency === RecurringRepeat.Weekly && (
          <Controller
            control={control}
            name="dayOfWeeks"
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary text-sm font-medium">Days of the week</label>

                <div className="flex justify-between gap-1">
                  {weekDays.map((item) => (
                    <Button
                      className="rounded-full w-[40px]"
                      key={item.getDay()}
                      onClick={() => toggleDay(item.getDay())}
                      variant={field.value.includes(item.getDay()) ? 'primary' : 'tertiary'}
                    >
                      {format(item, 'EEEEE')}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          />
        )}

        <div className="flex items-center justify-between gap-2">
          <Segment
            className="[&_button]:px-3.5!"
            selected="for"
            items={[
              { value: 'until', label: 'Until' },
              { value: 'for', label: 'For' },
            ]}
            onSelect={(item) => setIsUntilMode(item.value === 'until')}
          />

          <i className="icon-chevron-right text-tertiary" />

          {isUntilMode ? (
            <div className="flex-1">
              <DateTimePicker
                className="flex w-full [&_.trigger-date]:flex-1 [&_button]:w-full [&_button]:justify-start"
                value={end.toISOString()}
                onSelect={(date) => setEnd(new Date(date))}
                showTime={false}
              />
            </div>
          ) : (
            <div className="flex-1">
              <InputField
                type="number"
                value={count.toString()}
                subfix={frequency.replace('ily', 'ys').replace('ly', 's')}
                onChangeText={(val) => {
                  setCount(Number(val));
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between gap-2 border-2 border-dashed rounded-sm p-1">
          {loading ? (
            <Skeleton className="h-[68px] w-full rounded-sm" animate />
          ) : (
            <RecurrenceDates dates={data?.generateRecurringDates} />
          )}
        </div>

        {count < 1 && <p className="text-warning-400">Value must be greater than or equal to 1.</p>}
        {count > 29 && <p className="text-warning-400">Value must be less than or equal to 29.</p>}

        <Button
          variant="secondary"
          disabled={count < 1 || count > 29}
          onClick={() => {
            onAdd(data?.generateRecurringDates as string[]);
            onBack();
          }}
        >
          Add {count} Times
        </Button>
      </Card.Content>
    </Card.Root>
  );
}

function RecurrenceDates({ dates }: { dates?: Date[] }) {
  if (!dates?.length) return <></>;

  if (dates.length <= 5)
    return (
      <>
        {dates.map((date, idx) => (
          <DateBlock key={idx} date={date} />
        ))}
        {Array.from({ length: 5 - dates.length }).map((_, idx) => (
          <div key={idx} className="flex-1" />
        ))}
      </>
    );

  return (
    <>
      {dates.slice(0, 2).map((date, idx) => (
        <DateBlock key={idx} date={date} />
      ))}
      <div className="flex items-center justify-center">
        <p className="text-tertiary">+{dates.length - 4}</p>
      </div>
      {dates.slice(dates.length - 2, dates.length).map((date, idx) => (
        <DateBlock key={idx} date={date} />
      ))}
    </>
  );
}

function DateBlock({ date }: { date: Date }) {
  return (
    <div className="flex-1 px-2 py-1.5 flex flex-col rounded-sm bg-(--btn-tertiary) items-center">
      <p className="text-secondary text-xs">{format(date, 'MMM')}</p>
      <p>{format(date, 'dd')}</p>
      <p className="text-tertiary text-xs">{format(date, 'EEE')}</p>
    </div>
  );
}

export function CancelEventModal({
  title,
  subtitle,
  onConfirm,
}: {
  onConfirm: () => Promise<void> | void;
  title: string;
  subtitle: string;
}) {
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[448px]">
      <div className="p-3 rounded-full bg-danger-400/16 w-fit">
        <i className="icon-ticket text-danger-400" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm font-medium text-secondary">{subtitle}</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button
          variant="danger"
          className="flex-1 w-full"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await onConfirm();
            setLoading(false);
            modal.close();
          }}
        >
          Cancel Event
        </Button>

        <p className="text-danger-400 text-sm">The event will be permanently deleted</p>
      </div>
    </div>
  );
}
