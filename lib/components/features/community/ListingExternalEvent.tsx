import React from 'react';
import clsx from 'clsx';
import { addHours } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { isDate } from 'lodash';
import ct from 'countries-and-timezones';
import { skipToken } from '@tanstack/react-query';

import { Button, Card, Map, modal, toast } from '$lib/components/core';
import { DateTimeGroup, Timezone } from '$lib/components/core/calendar';
import { getUserTimezoneOption, TimezoneOption, timezoneOptions } from '$lib/utils/timezone';

import {
  CreateExternalEventDocument,
  PinEventsToSpaceDocument,
  SpaceTag,
  SpaceTagType,
} from '$lib/graphql/generated/backend/graphql';
import { useClient } from '$lib/graphql/request';
import { PlaceAutoComplete } from '$lib/components/core/map/place-autocomplete';

import { AddTags } from './ListingEvent';
import { trpc } from '$lib/trpc/client';

type FormValues = {
  external_url?: string;
  title?: string;
  location?: {
    address?: any;
    latitude?: number;
    longitude?: number;
  };
  datetime?: {
    timezone?: string;
    start?: string;
    end?: string;
  };

  /** this not match - just show - DONT DO ANYTHING */
  host?: string;
};

export function ListingExternalEvent({ spaceId }: { spaceId: string }) {
  const [tags, setTags] = React.useState<SpaceTag[]>([]);
  const now = new Date();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      host: '',
      location: {
        address: {},
        latitude: 0,
        longitude: 0,
      },
      datetime: {
        start: now.toISOString(),
        end: addHours(now, 1).toISOString(),
        timezone: getUserTimezoneOption()?.value,
      },
    },
  });

  const { client } = useClient();

  const [title, external_url, location, datetime] = watch(['title', 'external_url', 'location', 'datetime']);

  const onSubmit = async (values: FormValues) => {
    const { data, error } = await client.query({
      query: CreateExternalEventDocument,
      variables: {
        input: {
          private: false,
          published: true,
          title: values.title,
          start: new Date(values.datetime?.start as string).toISOString(),
          end: new Date(values.datetime?.end as string).toISOString(),
          longitude: values.location?.longitude,
          latitude: values.location?.latitude,
          timezone: values.datetime?.timezone,
          address: values.location?.address,
          external_hostname: values.host,
          external_url: values.external_url,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const event = data?.createEvent;

    if (event) {
      await client.query({
        query: PinEventsToSpaceDocument,
        variables: { events: [event._id], tags: tags.map((item) => item._id), space: spaceId },
        fetchPolicy: 'network-only',
      });
      modal.close();
      toast.success('Submitted');
    }
  };

  return (
    <div className="w-[350] md:w-[480] max-h-[700px] overflow-auto no-scrollbar">
      <Card.Header className="flex justify-between items-center">
        <p className="text-lg font-medium">Submit Lemonade Event</p>
        <Button
          icon="icon-x size-[14]"
          variant="tertiary"
          className="rounded-full"
          size="xs"
          onClick={() => modal.close()}
        />
      </Card.Header>
      <Card.Content className="overflow-inherit!">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <InputFieldCustom
            onStartExtract={() => reset()}
            onChange={(data) => {
              setValue('title', data.title);
              setValue('datetime.start', data.startDate);
              setValue('datetime.end', data.endDate);
              setValue('external_url', data.external_url);
              setValue('host', data.host);
              setValue('location', data.location);
              const country = ct.getCountry(data.location?.address?.country);
              setValue('datetime.timezone', country?.timezones?.[0]);
            }}
          />

          <Controller
            control={control}
            name="title"
            rules={{ required: true }}
            render={({ field }) => (
              <InputField
                label="Event Name *"
                value={field.value}
                onChange={field.onChange}
                placeholder="Happy Hour Drinks"
              />
            )}
          />

          <Controller
            control={control}
            name="location"
            render={({ field }) => {
              return (
                <>
                  <PlaceAutoComplete
                    label="Event Location"
                    value={field.value?.address?.title}
                    placeholder="What’s the address?"
                    onSelect={(address) => {
                      if (address?.latitude) setValue('location.latitude', address.latitude);
                      if (address?.longitude) setValue('location.longitude', address.longitude);
                      setValue('location.address', address);
                    }}
                  />
                  {location?.address?.latitude && location?.address?.longitude && (
                    <div className="aspect-video h-[240px] rounded-sm overflow-hidden">
                      <Map
                        gestureHandling="greedy"
                        defaultZoom={11}
                        center={{ lat: location?.address?.latitude, lng: location?.address?.longitude }}
                        markers={[{ lat: location?.address?.latitude, lng: location?.address?.longitude }]}
                      />
                    </div>
                  )}
                </>
              );
            }}
          />

          <Controller
            control={control}
            name="host"
            render={({ field }) => (
              <InputField
                label="Host"
                value={field.value}
                onChange={field.onChange}
                placeholder="Friends of the City"
              />
            )}
          />

          <Controller
            control={control}
            name="datetime"
            render={() => (
              <DateTimeWithTimeZone
                label="Event Time"
                start={datetime?.start}
                end={datetime?.end}
                country={location?.address?.country}
                onSelect={({ start, end }) => {
                  setValue('datetime.start', start);
                  setValue('datetime.end', end);
                }}
              />
            )}
          />

          <AddTags type={SpaceTagType.Event} spaceId={spaceId} onChange={(value) => setTags(value)} />

          <div className="p-1 flex flex-col gap-3 items-start">
            <Button
              disabled={!title || !external_url}
              variant="secondary"
              type="submit"
              loading={isSubmitting}
              className="w-full"
            >
              Submit Event
            </Button>
          </div>
        </form>
      </Card.Content>
    </div>
  );
}

function InputFieldCustom({
  onStartExtract,
  onChange,
}: {
  onStartExtract?: () => void;
  onChange?: (data: any) => void;
}) {
  const [value, setValue] = React.useState('');

  const { data, isLoading } = trpc.openGraph.extractUrl.useQuery(value ? { url: value } : skipToken);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);

    if (text) onStartExtract?.();
  };

  React.useEffect(() => {
    if (data?.error) {
      toast.error('Cannot extract url');
      return;
    }

    if (data?.result && value) {
      const result = data.result;
      let startDate = isDate(result.articlePublishedTime) ? result.articlePublishedTime : new Date();
      let endDate = isDate(result.articleExpirationTime) ? result.articleExpirationTime : new Date();
      let host = '';
      let location = {};

      if ('jsonLD' in result && result.jsonLD?.length) {
        startDate = result.jsonLD.find((item: any) => item.startDate)?.startDate || null;
        endDate = result.jsonLD.find((item: any) => item.endDate)?.endDate || null;
        host = result.jsonLD.find((item: any) => item.organizer)?.organizer?.name || null;

        const _location = result.jsonLD.find((item: any) => item.location)?.location || null;
        location = {
          address: {
            street_1: _location?.address?.streetAddress,
            city: _location?.address?.addressLocality,
            region: _location?.address?.addressRegion,
            postal: _location?.address?.postalCode,
            country: _location?.address?.addressCountry,
            title: _location?.name,
          },
        };
      }

      onChange?.({
        title: result.ogTitle,
        startDate,
        endDate,
        host,
        external_url: value,
        location,
      });
    }
  }, [data, value]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-secondary font-medium">Event Page URL *</label>
        <div
          className={twMerge(
            'transition opacity-0 text-tertiary flex items-center gap-1.5',
            clsx(isLoading && 'opacity-100'),
          )}
        >
          <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Parsing URL...</p>
        </div>
      </div>

      <div className="bg-background/64 border flex py-1 px-3.5 rounded-sm items-center h-[44px] focus-within:border-primary">
        <input
          className="flex-1 outline-none"
          value={value}
          placeholder="https://eventbrite.com/e/some-event"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

function InputField({
  label,
  iconLeft,
  placeholder,
  value,
  readOnly = false,
  onChange,
}: {
  label: string;
  iconLeft?: string;
  placeholder?: string;
  value?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-secondary font-medium">{label}</label>
      <div
        className={twMerge(
          'bg-background/64 border flex py-1 px-3.5 rounded-sm items-center h-[44px] focus-within:border-primary',
          clsx(iconLeft && 'px-3.5 gap-2.5'),
        )}
      >
        {iconLeft && <i className={iconLeft} />}
        <input
          readOnly={readOnly}
          className="flex-1 outline-none"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function DateTimeWithTimeZone({
  label,
  start,
  end,
  timezone = getUserTimezoneOption()?.value,
  country,
  onSelect,
}: {
  label?: string;
  start?: string;
  end?: string;
  country?: string;
  timezone?: string;
  onSelect: (value: { start: string; end: string }) => void;
}) {
  const [startTime, setStartTime] = React.useState(start || new Date().toISOString());
  const [endTime, setEndTime] = React.useState(end || new Date().toISOString());
  const [zone, setZone] = React.useState<TimezoneOption>(
    timezoneOptions.find((item) => item.value === timezone) as TimezoneOption,
  );

  // TODO: double check start/end correct with timezone response from be
  const handleSelect = ({ start, end }: { start: string; end: string; timezone?: TimezoneOption }) => {
    onSelect({
      start,
      end,
      // start: timezone ? formatWithTimezone(new Date(start), timezone.value) : start,
      // end: timezone ? formatWithTimezone(new Date(start), timezone.value) : end,
    });
  };

  React.useEffect(() => {
    if (start) setStartTime(start);
    if (end) setEndTime(end);

    /** @description work around with list timezoneOptions - there some some timezone not match */
    if (country) {
      const tz = timezoneOptions.find((item) => item.text.includes(country)) || getUserTimezoneOption();
      setZone(tz as TimezoneOption);
    }
  }, [start, end, country]);

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm text-secondary font-medium">{label}</label>}
      <DateTimeGroup start={startTime} end={endTime} onSelect={(value) => handleSelect({ ...value, timezone: zone })} />
      <Timezone
        value={zone}
        trigger={() => (
          <button
            type="button"
            className="btn btn-tertiary inline-flex items-center w-full rounded-sm h-[40px] pl-3.5 pr-2.5"
          >
            <div className="flex flex-1 w-3xs md:w-auto items-center gap-2.5">
              <i className="icon-globe size-[20px]" />
              <span className="truncate w-fit">{zone?.text}</span>
            </div>
            <i className="icon-chevron-down size-[20px]" />
          </button>
        )}
        onSelect={(data) => {
          setZone(data);
          handleSelect({ start: startTime, end: endTime, timezone: data });
        }}
      />
    </div>
  );
}
