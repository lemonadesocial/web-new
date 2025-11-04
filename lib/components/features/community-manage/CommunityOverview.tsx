'use client';
import React from 'react';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  AttachSubSpacesDocument,
  DeleteSpaceMembersDocument,
  Event,
  GetSpaceDocument,
  GetSpaceEventsDocument,
  GetSpaceMembersDocument,
  GetSpaceQuery,
  GetSpacesDocument,
  GetSubSpacesDocument,
  PublicSpace,
  RemoveSubSpacesDocument,
  Space,
  SpaceMember,
  SpaceRole,
  UpdateSubSpaceOrderDocument,
} from '$lib/graphql/generated/backend/graphql';

import { useRouter } from 'next/navigation';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  drawer,
  InputField,
  modal,
  Skeleton,
  toast,
} from '$lib/components/core';
import { twMerge } from 'tailwind-merge';
import { PendingApprovalEvents } from './PendingApprovalEvents';
import { EventCardItem } from '../EventList';
import { match } from 'ts-pattern';
import { userAvatar } from '$lib/utils/user';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';
import { CommonSection } from './shared';
import { AnimatePresence, motion } from 'framer-motion';
import { CardTable } from '$lib/components/core/table';
import { AddTeam } from './modals/AddTeam';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Pane } from '$lib/components/core/pane/pane';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { ReOrderFeatureHubs } from './modals/ReOrderFeatureHubs';
import { sub } from 'date-fns';

const LIMIT = 2;
const FROM_NOW = new Date().toISOString();

export function CommunityOverview({ space: initSpace }: { space?: Space }) {
  const { data, loading: loadingGetSpace } = useQuery(GetSpaceDocument, {
    variables: { id: initSpace?._id },
    fetchPolicy: 'cache-and-network',
    skip: !initSpace?._id,
    initData: { getSpace: initSpace } as unknown as GetSpaceQuery,
  });
  const space = data?.getSpace as Space;

  const { data: dataGetEvent, refetch } = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space._id,
      limit: LIMIT,
      skip: 0,
      endFrom: FROM_NOW,
      spaceTags: [],
    },
    skip: !space._id,
  });
  const events = (dataGetEvent?.getEvents || []) as Event[];

  return (
    <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0">
      <div className="flex flex-col gap-8 pb-20">
        <div className="flex flex-col gap-8">
          <ListActions spaceId={space?._id} />

          <div className="[&>*:only-child]:hidden flex flex-col gap-5">
            <h3 className="text-xl font-semibold">Events</h3>
            {space?._id && <PendingApprovalEvents spaceId={space._id} onCompleted={refetch} />}
            {space && <UpComingEventsSection space={space} events={events} />}
          </div>
        </div>

        <Divider />
        <AdminListSection space={space} loading={loadingGetSpace} />

        <Divider />
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            className="divide-y-(length:--card-border-width) divide-(--color-divider)"
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
          >
            <FeaturedHubSection spaceId={space._id} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const actions = [
  { icon: 'icon-ticket text-accent-400', backgroundIcon: 'bg-accent-400/16', title: 'Add Event', key: 'add_event' },
  {
    icon: 'icon-email text-[#FB923C]',
    backgroundIcon: 'bg-[#FB923C]/16',
    title: 'Send a Newsletter',
    key: 'send_news_letter',
  },
  { icon: 'icon-ticket text-alert-400', backgroundIcon: 'bg-alert-400/16', title: 'Create Post', key: 'create_post' },
  {
    icon: 'icon-ticket text-[#F472B6]',
    backgroundIcon: 'bg-[#F472B6]/16',
    title: 'Share Community',
    key: 'share_community',
  },
];

function ListActions({ spaceId }: { spaceId: string }) {
  const router = useRouter();
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {actions.map((item) => (
        <Card.Root
          key={item.key}
          className="flex-1 min-w-fit"
          onClick={() => {
            match(item.key)
              .with('add_event', () => router.push(`/create/event?space=${spaceId}`))
              .with('send_news_letter', () => toast.success('Coming soon'))
              .with('create_post', () => toast.success('Coming soon'))
              .with('share_community', () => toast.success('Coming soon'));
          }}
        >
          <Card.Content className="flex gap-3 items-center py-2 px-3">
            <div
              className={twMerge(
                'rounded-sm size-9 flex items-center justify-center aspect-square',
                item.backgroundIcon,
              )}
            >
              <i className={twMerge('size-[22px] aspect-square', item.icon)} />
            </div>
            <p>{item.title}</p>
          </Card.Content>
        </Card.Root>
      ))}
    </div>
  );
}

function UpComingEventsSection({ space, events = [] }: { space: Space; events?: Event[] }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-2 items-center">
          <p>Upcoming</p>
        </div>
        <Button
          variant="tertiary-alt"
          size="sm"
          iconRight="icon-chevron-right"
          onClick={() => router.push(`/s/manage/${space.slug || space._id}/events`)}
        >
          All Events
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="p-4 gap-3 items-center hidden only:flex">
          <i className="icon-confirmation-number size-9 aspect-square text-quaternary" />
          <div className="text-tertiary space-y-0.5">
            <p>No Events</p>
            <p className="text-sm">This community has no upcoming events.</p>
          </div>
        </div>

        {events.map((item) => (
          <EventCardItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

function AdminListSection({ space, loading }: { space: Space; loading?: boolean }) {
  const { data, refetch } = useQuery(GetSpaceMembersDocument, {
    variables: { space: space._id, limit: 100, roles: [SpaceRole.Admin, SpaceRole.Creator], skip: 0, deletion: false },
  });
  const admins = (data?.listSpaceMembers?.items || []) as SpaceMember[];

  const [removeMember] = useMutation(DeleteSpaceMembersDocument);

  const me = useMe();
  const isCreator = me?._id === space.creator;

  return (
    <CommonSection
      title="Admins"
      subtitle="Add hosts, special guests, and event managers."
      actions={[
        {
          iconLeft: 'icon-plus',
          title: 'Add Admin',
          onClick: () =>
            modal.open(AddTeam, {
              props: {
                spaceId: space._id,
                icon: 'icon-user',
                title: 'Add Admins',
                subtitle:
                  'Add admins by entering their email addresses. They don’t need to have an existing Lemonade account.',
                btnText: 'Add Admins',
                role: SpaceRole.Admin,
                onCompleted: refetch,
              },
            }),
        },
      ]}
    >
      <CardTable.Root loading={loading}>
        <CardTable.Loading rows={3}>
          <Skeleton className="size-8 aspect-square rounded-full" animate />
          <Skeleton className="h-5 w-32" animate />

          <Skeleton className="h-5 w-10" animate />

          <div className="w-[62px] px-[60px] hidden md:block">
            <Skeleton className="h-5 w-16 rounded-full" animate />
          </div>
        </CardTable.Loading>

        <CardTable.EmptyState>
          <div className="p-4 flex gap-3 items-center">
            <i className="icon-user-group-outline size-9 aspect-square text-quaternary" />
            <div className="text-tertiary space-y-0.5">
              <p>No Admins</p>
              <p className="text-sm">Add people who can manage community.</p>
            </div>
          </div>
        </CardTable.EmptyState>

        {admins.map((item) => (
          <CardTable.Row key={item._id}>
            <div key={item._id} className="flex gap-3 items-center px-4 py-3">
              <Avatar src={userAvatar(item.user)} className="size-5 aspect-square" />
              <div className="flex gap-2 flex-1 truncate">
                <p>{item.user_name || item.user?.name || item.user?.display_name || 'Anonymous'}</p>
                {item.email && <p className="truncate">{item.email || item.user?.email}</p>}
                <Badge
                  className="rounded-full"
                  title={isCreator ? 'Creator' : 'Admin'}
                  color={isCreator ? 'var(--color-success-500)' : 'var(--color-accent-400)'}
                />
              </div>

              <i
                className="icon-user-remove size-5 aspect-square text-tertiary hover:text-primary cursor-pointer"
                onClick={() =>
                  modal.open(ConfirmModal, {
                    props: {
                      icon: 'icon-user-remove',
                      title: 'Remove Admin',
                      subtitle: 'Are you sure you want to remove this admin?',
                      onConfirm: async () => {
                        const { error } = await removeMember({
                          variables: { input: { space: space._id, ids: [item._id] } },
                        });

                        if (error) {
                          toast.error(error.message);
                          return;
                        }

                        await refetch();
                      },
                    },
                  })
                }
              />
            </div>
          </CardTable.Row>
        ))}
      </CardTable.Root>
    </CommonSection>
  );
}

function FeaturedHubSection({ spaceId }: { spaceId: string }) {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GetSubSpacesDocument, {
    variables: { id: spaceId },
    skip: !spaceId,
  });
  const subSpaces = (data?.getSubSpaces || []) as PublicSpace[];

  const [removeFeatureHub] = useMutation(RemoveSubSpacesDocument, {
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateOrder] = useMutation(UpdateSubSpaceOrderDocument, { onComplete: () => refetch() });

  return (
    <CommonSection
      title="Featured Hubs"
      subtitle="Showcase other community hubs you manage on the community page."
      actions={[
        { iconLeft: 'icon-plus', title: 'Add Hub', onClick: () => drawer.open(SubFeatureHubs, { props: { spaceId } }) },
        subSpaces.length
          ? {
              icon: 'icon-arrow-up-down-line',
              onClick: () =>
                modal.open(ReOrderFeatureHubs, {
                  props: {
                    data: subSpaces,
                    onChange: (arr) => {
                      updateOrder({ variables: { id: spaceId, subSpaces: arr.map((i) => i._id) } });
                    },
                  },
                }),
            }
          : undefined,
      ]}
    >
      <CardTable.Root loading={loading}>
        <CardTable.Loading rows={7}>
          <Skeleton className="size-8 aspect-square rounded-full" animate />
          <Skeleton className="h-5 w-32" animate />

          <Skeleton className="h-5 w-10" animate />

          <div className="w-[62px] px-[60px] hidden md:block">
            <Skeleton className="h-5 w-16 rounded-full" animate />
          </div>
        </CardTable.Loading>

        <CardTable.EmptyState>
          <div className="p-4 flex gap-3 items-center">
            <i className="icon-workspaces size-9 aspect-square text-quaternary" />
            <div className="text-tertiary space-y-0.5">
              <p>No Featured Hubs</p>
              <p className="text-sm">Add people who can create or list events without needing admin approval.</p>
            </div>
          </div>
        </CardTable.EmptyState>

        {subSpaces.map((item) => (
          <CardTable.Row key={item._id}>
            <div className="flex gap-3 items-center px-4 py-3 hover:bg-card-hover flex-1">
              <Avatar
                className="size-7 md:size-5 rounded-xs!"
                src={generateUrl(item.image_avatar_expanded) || `${ASSET_PREFIX}/assets/images/default-dp.png`}
              />

              <p className="flex-1 cursor-pointer" onClick={() => router.push(`/s/${item.slug || item._id}`)}>
                {item.title}
              </p>
              <i
                className="icon-delete size-5 aspect-square text-tertiary hover:text-primary cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  modal.open(ConfirmModal, {
                    props: {
                      title: 'Remove Featured Hub',
                      subtitle: `Are you sure you want to remove ${item.title}?`,
                      onConfirm: async () => {
                        await removeFeatureHub({ variables: { id: spaceId, subSpaces: item._id } });
                        await refetch();
                        toast.success(`Remove ${item.title} success!`);
                      },
                    },
                  });
                }}
              />
            </div>
          </CardTable.Row>
        ))}
      </CardTable.Root>
    </CommonSection>
  );
}

function SubFeatureHubs({ spaceId }: { spaceId: string }) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [unSelected, setUnSelected] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');

  const { data } = useQuery(GetSpacesDocument, {
    variables: { roles: [SpaceRole.Admin, SpaceRole.Creator] },
    skip: !spaceId,
  });
  const spaces = (data?.listSpaces as Space[]) || [];

  const { data: dataSubSpaces, refetch } = useQuery(GetSubSpacesDocument, {
    variables: { id: spaceId },
    skip: !spaceId,
  });
  const subSpaceIds = ((dataSubSpaces?.getSubSpaces as PublicSpace[]) || []).map((i) => i._id as string);

  const [attachFeatureHub, { loading: updating }] = useMutation(AttachSubSpacesDocument, {
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [removeFeatureHub, { loading: removing }] = useMutation(RemoveSubSpacesDocument, {
    onError: (error) => {
      toast.error(error.message);
    },
  });

  React.useEffect(() => {
    if (subSpaceIds.length) setSelected(subSpaceIds);
  }, [subSpaceIds.length]);

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>
      <Pane.Content className="p-4 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold">Add Featured Hub</h3>
          <p className="text-sm text-secondary">Highlight other community hubs you manage on this community.</p>
        </div>

        <InputField iconLeft="icon-search" placeholder="Search" value={query} onChangeText={setQuery} />

        {spaces
          .filter((i) => i._id !== spaceId)
          .filter((i) => (query ? query.toLowerCase().includes(i.title.toLowerCase()) : true))
          .map((i) => (
            <Card.Root
              key={i._id}
              onClick={() => {
                const _selected = selected.includes(i._id) ? selected.filter((s) => s !== i._id) : [...selected, i._id];
                const _unSelected = selected.includes(i._id)
                  ? [...unSelected, i._id]
                  : unSelected.filter((s) => s !== i._id);

                setSelected(_selected);
                setUnSelected(_unSelected);
              }}
            >
              <Card.Content className="py-3 flex items-center gap-3">
                <Avatar
                  className="size-[38px] rounded-sm!"
                  src={generateUrl(i.image_avatar_expanded) || `${ASSET_PREFIX}/assets/images/default-dp.png`}
                />

                <div className="flex-1">
                  <p className="text-lg">{i.title}</p>
                  <p className="text-sm text-tertiary">{i.followers_count || 0} followers</p>
                </div>

                <Checkbox id={i._id} variant="circle" value={selected.includes(i._id)} />
              </Card.Content>
            </Card.Root>
          ))}
      </Pane.Content>

      <Pane.Footer className="p-4">
        <Button
          variant="secondary"
          loading={updating || removing}
          disabled={!selected.length}
          onClick={async () => {
            if (unSelected.length > 0) await removeFeatureHub({ variables: { id: spaceId, subSpaces: unSelected } });
            if (selected.length > 0) await attachFeatureHub({ variables: { id: spaceId, subSpaces: selected } });
            toast.success('Hubs added successfully.');
            refetch();
          }}
        >
          Add Hubs
        </Button>
      </Pane.Footer>
    </Pane.Root>
  );
}
