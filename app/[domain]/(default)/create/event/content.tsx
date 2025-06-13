'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useSession } from '$lib/hooks/useSession';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';
import { randomEventDP } from '$lib/utils/user';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import { Button, Card, Input, Menu } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { GetSpacesDocument, GetSpacesQuery, Space, SpaceRole } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { communityAvatar } from '$lib/utils/community';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { getUserTimezoneOption } from '$lib/utils/timezone';
import { DateTimeGroup, Timezone } from '$lib/components/core/calendar';
import { roundToNext30Minutes } from '$lib/utils/date';

export function Content({ initData }: { initData: { spaces: Space[] } }) {
  const signIn = useSignIn();
  const session = useSession();
  const me = useMe();

  const { data: dataGetMySpace } = useQuery(GetSpacesDocument, {
    variables: {
      with_my_spaces: true,
      roles: [SpaceRole.Admin, SpaceRole.Creator, SpaceRole.Ambassador],
    },
    initData: { listSpaces: initData.spaces } as unknown as GetSpacesQuery,
  });
  const spaces = (dataGetMySpace?.listSpaces || []) as Space[];
  const personalSpace = spaces.find((item) => item.personal);

  React.useEffect(() => {
    if (!session && !me) signIn();
  }, [me, session]);

  return <FormContent spaces={spaces} space={personalSpace} />;
}

const PUBLIC_OPTIONS = [
  {
    title: 'Public',
    subtitle: 'Shown on your community & eligible to be featured',
    icon: 'icon-globe',
    private: false,
  },
  {
    title: 'Private',
    subtitle: 'Unlisted. Only people with the link can register.',
    icon: 'icon-sparkles',
    private: true,
  },
];

type EventFormValue = {
  title: string;
  date: {
    start: string;
    end: string;
    timezone: string;
  };
  private: boolean;
  startDate: string;
  endDate: string;
  timezone: string;
  duration: number;
  approval_required: boolean;
  description: string;
  cost: number;
  currency: string;
  payment_optional: boolean;
  address?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  guest_limit?: undefined;
  guest_limit_per: number;
  virtual: boolean;
  virtual_url: string;
  cover: '';
  space?: string;
  // listToSpace: string;
};

function FormContent({ spaces, space }: { space?: Space; spaces: Space[] }) {
  const [state] = useEventTheme();
  const [timezone, setTimeZone] = React.useState(getUserTimezoneOption());
  const startDate = roundToNext30Minutes(new Date());

  const { control, setValue } = useForm<EventFormValue>({
    defaultValues: {
      title: '',
      private: false,
      duration: 3,
      approval_required: false,
      description: '',
      cost: 0,
      currency: 'USD',
      payment_optional: false,
      address: undefined,
      guest_limit: undefined,
      guest_limit_per: 0,
      virtual: true,
      virtual_url: '',
      space: space?._id,
      cover: '',
      date: {
        start: startDate.toString(),
        end: roundToNext30Minutes(startDate).toString(),
        timezone: getUserTimezoneOption()?.value,
      },
    },
  });

  return (
    <form>
      <div className={clsx('flex gap-[72px]', state.theme && state.config.color)}>
        <div className="hidden md:flex w-[296px] flex-col gap-6">
          <Controller
            control={control}
            name="cover"
            render={({ field }) => (
              <div className="flex flex-col gap-4">
                {field.value ? (
                  <img src={generateUrl(field.value)} />
                ) : (
                  <img className="aspect-square object-contain border rounded-md" src={randomEventDP()} />
                )}
                <EventThemeBuilder />
              </div>
            )}
          />
        </div>
        <div className="flex flex-col flex-1 w-full gap-6">
          <div className="flex items-center justify-between">
            <Controller
              control={control}
              name="space"
              render={({ field }) => {
                const data = spaces.find((i) => i._id === field.value);
                return (
                  <Menu.Root placement="bottom-start">
                    <Menu.Trigger>
                      <Button size="sm" variant="tertiary" iconRight="icon-chevron-down">
                        <div className="flex items-center gap-1.5 flex-1 line-clamp-1 w-[110px]">
                          <div className="size-4 rounded-xs overflow-hidden relative">
                            <img
                              className="w-full h-full outline outline-tertiary/4 rounded-xs"
                              src={communityAvatar(data)}
                              alt={data?.title}
                              loading="lazy"
                            />
                            {!data?.image_avatar_expanded && (
                              <img
                                src={`${ASSET_PREFIX}/assets/images/blank-avatar.svg`}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62%] h-[62%]"
                              />
                            )}
                          </div>
                          <p className="w-full text-start truncate line-clamp-1">{data?.title}</p>
                        </div>
                      </Button>
                    </Menu.Trigger>
                    <Menu.Content className="w-[272px] p-1">
                      {({ toggle }) => (
                        <>
                          <p className="text-xs text-tertiary py-1 px-2">Choose the community of the event:</p>
                          {spaces.map((item) => (
                            <div
                              key={item._id}
                              className="flex px-2 py-1.5 items-center gap-2.5 cursor-pointer hover:bg-[var(--btn-tertiary)]"
                              onClick={() => {
                                setValue('space', item._id);
                                toggle();
                              }}
                            >
                              <div className="flex items-center gap-2.5 flex-1">
                                <div className="size-4 rounded-xs overflow-hidden relative">
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
                                <p className="text-sm text-secondary">{item.title}</p>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </Menu.Content>
                  </Menu.Root>
                );
              }}
            />

            <Controller
              control={control}
              name="private"
              render={({ field }) => (
                <Menu.Root>
                  <Menu.Trigger>
                    <Button
                      size="sm"
                      variant="tertiary"
                      className="w-[112px]"
                      iconLeft={PUBLIC_OPTIONS.find((item) => item.private === field.value)?.icon}
                      iconRight="icon-chevron-down"
                    >
                      {!field.value ? 'Public' : 'Private'}
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content className="w-[280px] p-1">
                    {({ toggle }) => (
                      <>
                        {PUBLIC_OPTIONS.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex gap-1.5 rounded-xs px-2 py-1.5 items-center cursor-pointer hover:bg-[var(--btn-tertiary)]"
                            onClick={() => {
                              setValue('private', item.private);
                              toggle();
                            }}
                          >
                            <i className={twMerge('size-5 text-tertiary', item.icon)} />
                            <div className="flex-1">
                              <p className="text-sm">{item.title}</p>
                              <p className="text-xs text-tertiary">{item.subtitle}</p>
                            </div>
                            <i className={clsx('hidden size-5 icon-check', item.private === field.value && 'block!')} />
                          </div>
                        ))}
                      </>
                    )}
                  </Menu.Content>
                </Menu.Root>
              )}
            />
          </div>

          <Controller
            name="title"
            control={control}
            render={() => (
              <Input className="bg-transparent rounded-none border-none text-3xl p-0" placeholder="Event Title" />
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <div className="flex gap-3 items-center">
                <DateTimeGroup start={field.value.start} end={field.value.end} onSelect={() => {}} />
                <Timezone
                  placement="bottom-end"
                  onSelect={(timezone) => {
                    setTimeZone(timezone);
                  }}
                  trigger={() => (
                    <Card.Root>
                      <Card.Content className="flex flex-col justify-between w-[142px] h-[84px] p-2">
                        <i className="icon-globe size-5" />
                        <div>
                          <p className="text-sm">{timezone?.short}</p>
                          <p className="text-xs text-tertiary line-clamp-1 truncate">{timezone?.value}</p>
                        </div>
                      </Card.Content>
                    </Card.Root>
                  )}
                />
              </div>
            )}
          />

          <div className="flex gap-3">
            <Controller
              control={control}
              name="address"
              render={({ field }) => {
                return (
                  <Card.Root className="flex-1">
                    <Card.Content className="flex gap-2 items-start content-stretch">
                      <i className="icon-location-outline size-5" />
                      <div>
                        <p>Add Location</p>
                        <p className="text-sm text-tertiary">for offline events</p>
                      </div>
                    </Card.Content>
                  </Card.Root>
                );
              }}
            />

            <Controller
              control={control}
              name="virtual_url"
              render={({ field }) => {
                return (
                  <Card.Root className="flex-1">
                    <Card.Content className="flex gap-2">
                      <i className="icon-location-outline" />
                      <div>
                        <p>Add Virtual Link</p>
                        <p className="text-sm text-tertiary">for offline events</p>
                      </div>
                    </Card.Content>
                  </Card.Root>
                );
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
