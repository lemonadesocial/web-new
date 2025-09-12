import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import { startOfDay } from 'date-fns';

import {
  Button,
  drawer,
  ErrorText,
  Input,
  toast,
  Card,
  Map,
  PlaceAutoComplete,
  TextEditor,
  modal,
} from '$lib/components/core';
import { Event, UpdateEventSettingsDocument, Address, LayoutSection } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { ThemeValues } from '$lib/components/features/theme-builder/store';
import { DateTimeGroup, Timezone } from '$lib/components/core/calendar';
import { getUserTimezoneOption } from '$lib/utils/timezone';

import { useUpdateEvent } from '../store';
import { ThemeSettings } from './ThemeSettings';
import { ThemeProvider, useTheme } from '../../theme-builder/provider';
import { ReoderSectionsModal } from '../modals/ReoderSectionsModal';
import { indexOf, sortBy } from 'lodash';
import { DEFAULT_LAYOUT_SECTIONS } from '$lib/utils/constants';
import { Pane } from '$lib/components/core/pane/pane';

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
  layout_sections?: LayoutSection[];
};

export function EditEventDrawer({ event }: { event: Event }) {
  return (
    <ThemeProvider themeData={event.theme_data}>
      <EditEventDrawerContent event={event} />
    </ThemeProvider>
  );
}

function EditEventDrawerContent({ event }: { event: Event }) {
  const [timezone, setTimeZone] = React.useState(getUserTimezoneOption(event.timezone || ''));

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
      layout_sections: event.layout_sections?.map(({ __typename, ...rest }) => rest) || DEFAULT_LAYOUT_SECTIONS,
    },
  });

  const [state] = useTheme();

  const description = watch('description');
  const date = watch('date');
  const address = watch('address');
  const layoutSections = watch('layout_sections');

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
          layout_sections: values.layout_sections,
        },
      },
    });
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left className="flex items-center gap-3">
          <p className="whitespace-nowrap">Edit Event</p>
        </Pane.Header.Left>
      </Pane.Header.Root>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Pane.Content className="flex flex-col gap-6 p-4">
          <div className="space-y-4">
            <p className="text-lg">Basic Info</p>
            <div className="space-y-2">
              <Input
                {...register('title', { required: 'Title is required' })}
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
          <hr className="border-t border-t-divider" />
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
                <Input {...register('virtual_url')} placeholder="https://example.com/join" variant="outlined" />
                {watch('virtual_url') && (
                  <i
                    className="icon-cancel size-5 text-tertiary absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setValue('virtual_url', undefined)}
                  />
                )}
              </div>
            </div>

            <hr className="border" />
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-lg">Event Page Layout</p>
                <p className="text-sm text-secondary">
                  Choose the order in which sections appear on your event page for guests.
                </p>
              </div>

              <Button
                variant="tertiary-alt"
                size="sm"
                iconLeft="icon-arrow-up-down-line"
                onClick={() =>
                  modal.open(ReoderSectionsModal, {
                    props: {
                      list: layoutSections?.map((item) => item.id as string),
                      onChange: (list) => {
                        const sorted = sortBy(layoutSections, (item) => {
                          return indexOf(list, item.id);
                        });
                        setValue('layout_sections', sorted);
                      },
                    },
                  })
                }
              >
                Reorder Sections
              </Button>
            </div>
          </div>
        </Pane.Content>

        <Pane.Footer className="border-t px-4 py-3">
          <Button type="submit" variant="secondary" loading={loading} disabled={loading}>
            Update Event
          </Button>
        </Pane.Footer>
      </form>
    </Pane.Root>
  );
}
