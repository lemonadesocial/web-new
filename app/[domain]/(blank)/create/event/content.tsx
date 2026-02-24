'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useSession } from '$lib/hooks/useSession';
import { Button } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  CreateEventDocument,
  GetSpaceDocument,
  GetSpacesDocument,
  PinEventsToSpaceDocument,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { getUserTimezoneOption } from '$lib/utils/timezone';
import { roundToNext30Minutes } from '$lib/utils/date';
import { combineDateAndTimeWithTimezone } from '$lib/utils/date';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';
import { CreateEventForm } from '$lib/components/features/event/form/CreateEventForm';
import { EventFormValue } from '$lib/components/features/event/form/utils';

export function Content() {
  const signIn = useSignIn();
  const session = useSession();
  const me = useMe();
  const searchParams = useSearchParams();
  const spaceId = searchParams.get('space');

  const { data: dataGetMySpace } = useQuery(GetSpacesDocument, {
    variables: {
      with_my_spaces: true,
      roles: [SpaceRole.Admin, SpaceRole.Creator, SpaceRole.Ambassador],
    },
  });
  const spaces = (dataGetMySpace?.listSpaces || []) as Space[];
  const personalSpace = spaces.find((item) => item._id === spaceId || item.personal);

  const { data: dataListToSpace } = useQuery(GetSpaceDocument, { variables: { id: spaceId }, skip: !spaceId });
  const space = dataListToSpace?.getSpace;

  React.useEffect(() => {
    if (!session && !me) signIn();
  }, [me, session]);

  return (
    <div className="pt-4">
      <FormContent spaces={spaces} space={personalSpace} listToSpace={space} />
    </div>
  );
}

function FormContent({ spaces, space, listToSpace }: { space?: Space; spaces: Space[]; listToSpace?: Space }) {
  const [state] = useEventTheme();
  const startDate = roundToNext30Minutes(new Date());

  const [create, { loading, client }] = useMutation(CreateEventDocument);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValue>({
    defaultValues: {
      title: '',
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
      space: space?._id,
      date: {
        start: startDate.toString(),
        end: roundToNext30Minutes(startDate).toString(),
        timezone: getUserTimezoneOption()?.value,
      },
      listToSpace: listToSpace?._id,
    },
  });

  React.useEffect(() => {
    if (listToSpace) {
      const existing = spaces.findIndex((i) => i._id === listToSpace._id);
      if (existing <= -1) setValue('listToSpace', listToSpace?._id);
    }
  }, [listToSpace, spaces.length]);

  React.useEffect(() => {
    if (space) {
      setValue('space', space._id);
    }
  }, [space]);

  const [title] = watch(['title']);

  const onSubmit = async (value: EventFormValue) => {
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

    window.location.pathname = `/e/manage/${data?.createEvent?.shortid}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CreateEventForm control={control} watch={watch} setValue={setValue} spaces={spaces} listToSpace={listToSpace}>
        <Button loading={loading} disabled={!title} className="w-full" variant="secondary" type="submit">
          Create Event
        </Button>
      </CreateEventForm>
    </form>
  );
}
