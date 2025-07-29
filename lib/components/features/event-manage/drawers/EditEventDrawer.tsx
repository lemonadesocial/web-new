import { useForm } from "react-hook-form";
import React from 'react';
import { startOfDay } from 'date-fns';

import { Button, drawer, ErrorText, Input, toast, Card, Map, PlaceAutoComplete, TextEditor } from "$lib/components/core";
import { Event, UpdateEventSettingsDocument, Address } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";
import { ThemeValues } from "$lib/components/features/theme-builder/store";
import { DateTimeGroup, Timezone } from "$lib/components/core/calendar";
import { getUserTimezoneOption } from "$lib/utils/timezone";

import { useUpdateEvent } from "../store";
import { ThemeSettings } from "./ThemeSettings";
import { ThemeProvider, useTheme } from "../../theme-builder/provider";

type FormValues = {
  title: string;
  description: string;
  theme_data: ThemeValues;
  date: {
    start: string;
    end: string;
    timezone: string;
  };
  address?: {
    address?: Address | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  virtual_url?: string;
};

export function EditEventDrawer({ event }: { event: Event }) {
  return (
    <ThemeProvider themeData={event.theme_data}>
      <EditEventDrawerContent event={event} />
    </ThemeProvider>
  );
}

function EditEventDrawerContent({ event }: { event: Event }) {
  const [timezone, setTimeZone] = React.useState(getUserTimezoneOption());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: event.title || '',
      description: event.description || '',
      theme_data: event.theme_data,
      date: {
        start: event.start || new Date().toString(),
        end: event.end || new Date().toString(),
        timezone: event.timezone || getUserTimezoneOption()?.value || 'UTC',
      },
      address: {
        address: event.address || undefined,
        latitude: event.latitude ?? undefined,
        longitude: event.longitude ?? undefined,
      },
      virtual_url: event.virtual_url || undefined,
    },
  });

  const [state] = useTheme();

  const description = watch('description');
  const date = watch('date');
  const address = watch('address');

  const updateEvent = useUpdateEvent();

  const [updateEventSettings, { loading }] = useMutation(UpdateEventSettingsDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent);
        toast.success('Event updated successfully!');
        drawer.close();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update event');
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!event._id) return;

    updateEventSettings({
      variables: {
        id: event._id,
        input: {
          title: values.title,
          description: values.description,
          theme_data: state,
          start: new Date(values.date.start).toISOString(),
          end: new Date(values.date.end).toISOString(),
          timezone: values.date.timezone,
          address: values.address?.address,
          latitude: values.address?.latitude,
          longitude: values.address?.longitude,
          virtual_url: values.virtual_url,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex flex-shrink-0">
        <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} />
        <p>Edit Event</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
        <div className="space-y-4">
          <p className="text-lg">Basic Info</p>
          <div className="space-y-2">
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Event Title"
              className="w-full"
              variant="outlined"
            />
            {errors.title && <ErrorText message={errors.title.message!} />}
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-secondary">Description</p>
            <TextEditor
              content={description}
              placeholder="Who should come? What's the event about?"
              onChange={(value) => setValue('description', value)}
            />
          </div>
        </div>
        <hr className="border" />
        <div className="space-y-4">
          <p className="text-lg">Appearance</p>
          <ThemeSettings />
        </div>
        <hr className="border" />
        <div className="space-y-4">
          <p className="text-lg">Date & Time</p>
          <div className="flex flex-wrap md:flex-nowrap gap-3 md:items-center">
            <DateTimeGroup
              placement="bottom"
              minDate={startOfDay(new Date())}
              start={date.start}
              end={date.end}
              onSelect={(dateRange) => setValue('date', { ...date, ...dateRange })}
            />
            <Timezone
              placement="bottom-end"
              onSelect={(timezoneOption) => {
                setTimeZone(timezoneOption);
                setValue('date', { ...date, timezone: timezoneOption.value });
              }}
              strategy="absolute"
              className="w-full md:w-auto"
              trigger={() => (
                <Card.Root>
                  <Card.Content className="flex md:flex-col gap-3 items-center md:items-start md:justify-between flex-1 md:w-[142px] md:h-[84px] p-2">
                    <i className="icon-globe size-5 text-tertiary" />
                    <p className="block md:hidden">{timezone?.text}</p>
                    <div className="hidden md:block">
                      <p className="text-sm">{timezone?.short}</p>
                      <p className="text-xs text-tertiary line-clamp-1 truncate">{timezone?.value}</p>
                    </div>
                  </Card.Content>
                </Card.Root>
              )}
            />
          </div>
        </div>
        <hr className="border" />
        <div className="space-y-4">
          <p className="text-lg">Location</p>
          <PlaceAutoComplete
            label="Event Location"
            value={address?.address?.title || ''}
            placeholder="What's the address?"
            onSelect={(addressData) => {
              setValue('address.latitude', addressData?.latitude || null);
              setValue('address.longitude', addressData?.longitude || null);
              setValue('address.address', addressData);
            }}
          />
          {address?.address?.latitude && address?.address?.longitude && (
            <div className="h-[144px] w-full rounded-sm overflow-hidden">
              <Map
                gestureHandling="greedy"
                defaultZoom={11}
                center={{ lat: address.address.latitude, lng: address.address.longitude }}
                markers={[{ lat: address.address.latitude, lng: address.address.longitude }]}
              />
            </div>
          )}
          <div className="space-y-1.5">
            <p className="text-lg">Join URL</p>
            <div className="relative">
              <Input
                {...register('virtual_url')}
                placeholder="https://example.com/join"
                variant="outlined"
              />
              {watch('virtual_url') && (
                <i className="icon-cancel size-5 text-tertiary absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setValue('virtual_url', undefined)} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-t-divider flex-shrink-0">
        <Button type="submit" variant="secondary" loading={loading} disabled={loading}>
          Update Event
        </Button>
      </div>
    </form>
  );
}
