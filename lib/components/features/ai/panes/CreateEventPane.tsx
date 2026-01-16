'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useMutation, useQuery } from '$lib/graphql/request';
import {
  CreateEventDocument,
  GetSpaceDocument,
  GetSpacesDocument,
  PinEventsToSpaceDocument,
  Space,
  Event,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { getUserTimezoneOption } from '$lib/utils/timezone';
import { roundToNext30Minutes } from '$lib/utils/date';
import { combineDateAndTimeWithTimezone } from '$lib/utils/date';
import { EventThemeProvider, useEventTheme } from '$lib/components/features/theme-builder/provider';
import { CreateEventForm } from '$lib/components/features/event/form/CreateEventForm';

import { Pane } from '$lib/components/core/pane/pane';
import { Button } from '$lib/components/core';
import { EventFormValue } from '$lib/components/features/event/form/utils';

export function CreateEventPane(_props: Partial<Event>) {
  return (
    <EventThemeProvider>
      <FormContent />
    </EventThemeProvider>
  );
}

function FormContent() {
  const [state] = useEventTheme();
  const startDate = roundToNext30Minutes(new Date());

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValue>({
    defaultValues: {
      title: '123',
      description: '',
      private: false,
      cost: 0,
      currency: 'USD',
      address: undefined,
      virtual: true,
      virtual_url: '',
      options: {
        approval_required: false,
        guest_limit_per: 0,
      },
      // space: space?._id,
      date: {
        start: startDate.toString(),
        end: roundToNext30Minutes(startDate).toString(),
        timezone: getUserTimezoneOption()?.value,
      },
      // listToSpace: listToSpace?._id,
    },
  });

  const { data } = useQuery(GetSpacesDocument, {
    variables: {
      with_my_spaces: true,
      roles: [SpaceRole.Admin, SpaceRole.Creator, SpaceRole.Ambassador],
    },
  });

  const spaces = (data?.listSpaces || []) as Space[];

  const [create, { loading, client }] = useMutation(CreateEventDocument);

  const onSubmit = async (value: EventFormValue) => {
    console.log(value);
    return;
    const startDate = combineDateAndTimeWithTimezone(new Date(value.date.start), value.date.timezone);
    const endDate = combineDateAndTimeWithTimezone(new Date(value.date.end), value.date.timezone);

    const { data } = await create({
      variables: {
        input: {
          title: value.title,
          description: value.description,
          private: value.private,
          cost: value.cost,
          currency: value.currency,
          virtual: value.virtual,
          virtual_url: value.virtual_url,
          new_new_photos: value.cover?._id ? [value.cover?._id] : undefined,
          space: value.space,
          start: new Date(startDate).toISOString(),
          end: new Date(endDate).toISOString(),
          timezone: value.date.timezone,
          theme_data: state,
          ...value.address,
          ...value.options,
        },
      },
    });

    if (data?.createEvent?._id) {
      if (value.space) {
        const variables = { events: [data?.createEvent?._id], space: value.space };
        await client.query({ query: PinEventsToSpaceDocument, variables, fetchPolicy: 'network-only' });
      }

      if (value?.listToSpace) {
        const variables = { events: [data?.createEvent?._id], space: value?.listToSpace };
        await client.query({ query: PinEventsToSpaceDocument, variables, fetchPolicy: 'network-only' });
      }
    }
  };

  const [title] = watch(['title']);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Pane.Root>
        <Pane.Header.Root>
          <Pane.Header.Left showBackButton />
          <Pane.Header.Center className="flex items-center justify-center">
            <p>Create Event</p>
          </Pane.Header.Center>
          <Pane.Header.Right>
            <Button type="submit" variant="secondary" size="sm" loading={loading} disabled={!title}>
              Create
            </Button>
          </Pane.Header.Right>
        </Pane.Header.Root>

        <Pane.Content className="p-4">
          <CreateEventForm control={control} watch={watch} setValue={setValue} spaces={spaces} mobile />
        </Pane.Content>
      </Pane.Root>
    </form>
  );
}
