'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isNumber } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { startOfDay } from 'date-fns';

import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useSession } from '$lib/hooks/useSession';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';
import { randomEventDP } from '$lib/utils/user';
import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import { Button, Card, drawer, Input, Menu, modal, Toggle } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  Address,
  CreateEventDocument,
  File,
  GetSpacesDocument,
  GetSpacesQuery,
  PinEventsToSpaceDocument,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { generateUrl, EDIT_KEY } from '$lib/utils/cnd';
import { communityAvatar } from '$lib/utils/community';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { getUserTimezoneOption } from '$lib/utils/timezone';
import { DateTimeGroup, Timezone } from '$lib/components/core/calendar';
import { roundToNext30Minutes } from '$lib/utils/date';
import { AddLocationPane } from '$lib/components/features/pane';
import { uploadFiles } from '$lib/utils/file';
import { TextEditor } from '$lib/components/core/text-editor';
import { Map } from '$lib/components/core';

export function Content({ initData }: { initData: { spaces: Space[] } }) {
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
    initData: { listSpaces: initData.spaces } as unknown as GetSpacesQuery,
  });
  const spaces = (dataGetMySpace?.listSpaces || []) as Space[];
  const personalSpace = spaces.find((item) => item._id === spaceId || item.personal);

  React.useEffect(() => {
    if (!session && !me) signIn();
  }, [me, session]);

  return (
    <div className="pt-4">
      <FormContent spaces={spaces} space={personalSpace} />
    </div>
  );
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
  description: string;
  private: boolean;
  cost: number;
  currency: string;
  date: {
    start: string;
    end: string;
    timezone: string;
  };

  address?: {
    address: Address;
    latitude?: number;
    longitude?: number;
  };
  options: {
    approval_required: boolean;
    // NOTE: invite guest limit field
    guest_limit_per: number;
    // NOTE: capacity field
    guest_limit?: number;
  };
  virtual: boolean;
  virtual_url: string;
  cover?: File;
  space?: string;
};

function FormContent({ spaces, space }: { space?: Space; spaces: Space[] }) {
  const [state] = useEventTheme();
  const [timezone, setTimeZone] = React.useState(getUserTimezoneOption());
  const startDate = roundToNext30Minutes(new Date());

  const fileInputRef = React.useRef<any>(null);
  const [uploading, setUploading] = React.useState(false);

  const [create, { loading, client }] = useMutation(CreateEventDocument);

  const { control, watch, setValue, handleSubmit } = useForm<EventFormValue>({
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
    },
  });

  const [title, address] = watch(['title', 'address']);

  const onSubmit = async (value: EventFormValue) => {
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
          start: new Date(value.date.start).toISOString(),
          end: new Date(value.date.end).toISOString(),
          timezone: value.date.timezone,
          theme_data: state,
          ...value.address,
          ...value.options,
        },
      },
    }); 

    if (data?.createEvent?._id && value.space) {
      const variables = { events: [data?.createEvent?._id], space: value.space };
      await client.query({ query: PinEventsToSpaceDocument, variables, fetchPolicy: 'network-only' });
    }

    window.location.pathname = `/manage/event/${data?.createEvent?.shortid}`;
  };

  // Function to handle changes in the file input (when a file is selected)
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        setUploading(true);
        const res = await uploadFiles([files[0]], 'event');
        setValue('cover', res[0] as File);
        setUploading(false);
      } catch (_e) {
        setUploading(false);
      }
    }
  };

  return (
    <form
      className={clsx('grid gap-[36px] grid-cols-1 pb-10 md:flex md:gap-[72px]', state.theme && state.config.color)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="md:w-[296px] flex-col gap-6">
        <Controller
          control={control}
          name="cover"
          render={({ field }) => (
            <div className="flex flex-col gap-4">
              <div className="relative">
                {!!field.value ? (
                  <img src={generateUrl(field.value, EDIT_KEY.EVENT_PHOTO)} className="aspect-square" />
                ) : (
                  <img className="aspect-square object-contain border rounded-md" src={randomEventDP()} />
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-hidden="true"
                />
                <Button
                  icon="icon-upload-sharp"
                  className="rounded-full size-[40px]! absolute bottom-2.5 right-2.5 border-[var(--btn-secondary-content)]!"
                  variant="secondary"
                  loading={uploading}
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
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
                        <div className="max-h-[210px] overflow-auto no-scrollbar">
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
                        </div>
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
          rules={{ required: true }}
          control={control}
          render={({ field }) => (
            <Input
              value={field.value}
              className="bg-transparent rounded-none border-none text-3xl p-0 h-[68px]"
              placeholder="Event Title"
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <div className="flex flex-wrap md:flex-nowrap gap-3 md:items-center">
              <DateTimeGroup
                placement="bottom"
                minDate={startOfDay(new Date())}
                start={field.value.start}
                end={field.value.end}
                onSelect={(date) => setValue('date', { ...field.value, ...date })}
              />
              <Timezone
                placement="bottom-end"
                onSelect={(timezone) => {
                  setTimeZone(timezone);
                  setValue('date', { ...field.value, timezone: timezone.value });
                }}
                strategy="absolute"
                className="w-full md:w-auto"
                trigger={() => (
                  <Card.Root>
                    <Card.Content className="flex md:flex-col gap-3 items-center md:items-start md:justify-between flex-1 md:w-[142px] md:h-[84px] p-2">
                      <i className="icon-globe size-5" />
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
          )}
        />

        <div className="flex gap-3">
          <Controller
            control={control}
            name="address"
            render={() => {
              const address = watch('address');
              return (
                <Card.Root
                  className="flex-1"
                  onClick={() => {
                    drawer.open(AddLocationPane, {
                      props: {
                        address: address?.address,
                        onConfirm: (value) => {
                          setValue('address.address', value.address as Address);
                          setValue('address.latitude', value.address?.latitude as number);
                          setValue('address.longitude', value.address?.longitude as number);
                        },
                      },
                    });
                  }}
                >
                  <Card.Content className="flex gap-2">
                    <p>
                      <i className="icon-location-outline size-5 text-tertiary" />
                    </p>
                    <div className=" w-full">
                      <div className="flex items-center justify-between">
                        <p className="line-clamp-1">{address?.address ? address.address.title : 'Add Location'}</p>
                        {address?.address && (
                          <p>
                            <i
                              className="icon-x size-5 text-tertiary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setValue('address', undefined);
                              }}
                            />
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-tertiary line-clamp-1">
                        {address?.address ? getLocation(address.address) : 'for offline events'}
                      </p>
                    </div>
                  </Card.Content>
                </Card.Root>
              );
            }}
          />

          <Controller
            control={control}
            name="virtual_url"
            render={() => {
              const url = watch('virtual_url');
              return (
                <Card.Root
                  className="flex-1"
                  onClick={() =>
                    modal.open(VirtualModal, {
                      props: {
                        onConfirm: (value) => {
                          let _url = value;
                          if (!/^(?:f|ht)tps?\:\/\//.test(_url)) {
                            _url = 'https://' + _url;
                          }
                          setValue('virtual_url', _url);
                          setValue('virtual', true);
                        },
                      },
                    })
                  }
                >
                  <Card.Content className="flex gap-2">
                    <p>
                      <i className="icon-video size-5 text-tertiary" />
                    </p>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="line-clamp-1">{url ? 'Virtual' : 'Add Virtual Link'}</p>
                        {url && (
                          <p>
                            <i
                              className="icon-x size-5 text-tertiary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setValue('virtual', false);
                                setValue('virtual_url', '');
                              }}
                            />
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-tertiary line-clamp-1">{url || 'for offline events'}</p>
                    </div>
                  </Card.Content>
                </Card.Root>
              );
            }}
          />
        </div>

        {address?.latitude && address?.longitude && (
          <div className="aspect-video h-[240px] rounded-sm overflow-hidden">
            <Map
              gestureHandling="greedy"
              defaultZoom={11}
              center={{ lat: address?.latitude, lng: address?.longitude }}
              markers={[{ lat: address?.latitude, lng: address?.longitude }]}
            />
          </div>
        )}

        <Controller
          control={control}
          name="description"
          render={() => {
            const desc = watch('description');
            return (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Event Description</label>
                <TextEditor
                  content={desc}
                  placeholder="Who should come? What's the event about?"
                  onChange={(value) => setValue('description', value)}
                />
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="options"
          render={({ field }) => {
            const options = watch('options');
            return (
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-secondary">Event Options</p>
                <Card.Root>
                  <Card.Content className="p-0">
                    <OptionLineItem icon="icon-list-check" label="Require Approval">
                      <Toggle
                        id="approval_required"
                        checked={field.value.approval_required}
                        onChange={(value) => setValue('options.approval_required', value)}
                      />
                    </OptionLineItem>

                    <OptionLineItem icon="icon-vertical-align-top" label="Capacity">
                      <Button
                        variant="flat"
                        iconRight="icon-edit-sharp"
                        className="px-0 text-tertiary! hover:text-primary!"
                        onClick={() =>
                          modal.open(CapacityModal, {
                            props: {
                              value: options.guest_limit,
                              onSetLimit: (value) => setValue('options.guest_limit', !!value ? value : undefined),
                            },
                          })
                        }
                      >
                        {options.guest_limit || 'Unlimited'}
                      </Button>
                    </OptionLineItem>

                    <OptionLineItem icon="icon-ticket-plus" label="Invites by Guests" divide={false}>
                      <Button
                        variant="flat"
                        iconRight="icon-edit-sharp"
                        className="px-0 text-tertiary! hover:text-primary!"
                        onClick={() =>
                          modal.open(InviteByGuestModal, {
                            props: {
                              value: options.guest_limit_per,
                              onSetLimit: (value) => setValue('options.guest_limit_per', value),
                            },
                          })
                        }
                      >
                        {options.guest_limit_per || 'Off'}
                      </Button>
                    </OptionLineItem>
                  </Card.Content>
                </Card.Root>
              </div>
            );
          }}
        />

        <Button loading={loading} disabled={!title} className="w-full" variant="secondary" type="submit">
          Create Event
        </Button>
      </div>
    </form>
  );
}

function OptionLineItem({
  icon,
  label,
  divide = true,
  children,
}: React.PropsWithChildren & { icon: string; label: string; divide?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="pl-3.5">
        <i className={twMerge('size-5 text-tertiary', icon)} />
      </div>
      <div className={clsx('flex flex-1 items-center py-2.5 pr-3.5', divide && 'border-b')}>
        <p className="flex-1">{label}</p>
        {children}
      </div>
    </div>
  );
}

function VirtualModal({ url, onConfirm }: { url?: string; onConfirm?: (url: string) => void }) {
  const [value, setValue] = React.useState(url);
  return (
    <Card.Root className="w-[480px]">
      <Card.Header className="flex justify-between items-center">
        <p className="text-lg font-medium">Add Virtual Link</p>
        <Button
          icon="icon-x size-[14]"
          variant="tertiary"
          className="rounded-full"
          size="xs"
          onClick={() => modal.close()}
        />
      </Card.Header>
      <Card.Content className="p-0">
        <div className="flex flex-col gap-3 p-5">
          <Input
            value={value}
            className="bg-background/64!"
            placeholder="https://meet.google.com/abc-defg-hij"
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            variant="secondary"
            className="w-full"
            disabled={!isValidUrl(value)}
            onClick={() => {
              onConfirm?.(value as string);
              modal.close();
            }}
          >
            Confirm
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

function CapacityModal({ value: limit = 0, onSetLimit }: { value?: number; onSetLimit: (value: number) => void }) {
  const [value, setValue] = React.useState(limit);
  return (
    <Card.Root className="w-[340px]">
      <Card.Header className="flex justify-between items-start bg-transparent">
        <div className="size-[56px] rounded-full bg-[var(--btn-tertiary)] flex items-center justify-center">
          <i className="icon-vertical-align-top" />
        </div>

        <Button
          icon="icon-x size-[14]"
          variant="tertiary"
          className="rounded-full"
          size="xs"
          onClick={() => modal.close()}
        />
      </Card.Header>

      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Max Capacity</p>
          <p className="text-sm text-secondary">
            Auto-close registration when the capacity is reached. Only approved guests count toward the cap.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Capacity</label>
          <Input
            className="bg-background/64"
            value={value}
            onChange={(e) => {
              const num = Number(e.target.value?.replace(/[^0-9]/g, ''));
              setValue(isNumber(num) ? num : 0);
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="tertiary"
            onClick={() => {
              setValue(0);
              onSetLimit(0);
              modal.close();
            }}
          >
            Remove Limit
          </Button>
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => {
              onSetLimit(value);
              modal.close();
            }}
          >
            Set Limit
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

function InviteByGuestModal({ value: limit = 0, onSetLimit }: { value?: number; onSetLimit: (value: number) => void }) {
  const [value, setValue] = React.useState(limit);
  return (
    <Card.Root className="w-[340px]">
      <Card.Header className="flex justify-between items-start bg-transparent">
        <div className="size-[56px] rounded-full bg-[var(--btn-tertiary)] flex items-center justify-center">
          <i className="icon-user-plus" />
        </div>

        <Button
          icon="icon-x size-[14]"
          variant="tertiary"
          className="rounded-full"
          size="xs"
          onClick={() => modal.close()}
        />
      </Card.Header>

      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Invites by Guests</p>
          <p className="text-sm text-secondary">
            Let your guests bring friends by sharing a referral link or sending email invites.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Capacity</label>
          <Input
            className="bg-background/64"
            value={value}
            onChange={(e) => {
              const num = Number(e.target.value?.replace(/[^0-9]/g, ''));
              setValue(isNumber(num) ? num : 0);
            }}
          />
        </div>

        <Button
          className="flex-1"
          variant="secondary"
          onClick={() => {
            onSetLimit(value);
            modal.close();
          }}
        >
          Confirm
        </Button>
      </Card.Content>
    </Card.Root>
  );
}

function getLocation(address: Address) {
  const location = [];
  if (address.street_1) return address.street_1;
  if (address.city) location.push(address.city);
  if (address.country) location.push(address.country);
  return location.join(', ');
}

function isValidUrl(url?: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(url);
}
