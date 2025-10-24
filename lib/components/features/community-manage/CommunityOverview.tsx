'use client';

import { useQuery } from '$lib/graphql/request';
import {
  Event,
  GetSpaceDocument,
  GetSpaceEventsDocument,
  GetSpaceQuery,
  GetSubSpacesDocument,
  PublicSpace,
  Space,
} from '$lib/graphql/generated/backend/graphql';

import { useRouter } from 'next/navigation';
import { Avatar, Badge, Button, Card, Divider, modal, Skeleton, toast } from '$lib/components/core';
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

  const { data: subSpacesData, loading } = useQuery(GetSubSpacesDocument, {
    variables: { id: space?._id },
    skip: !space?._id,
  });
  const subSpaces = (subSpacesData?.getSubSpaces || []) as PublicSpace[];

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
            <FeaturedHubSection data={subSpaces} loading={loading} />
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

  if (!events.length) return null;

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
      {events.map((item) => (
        <EventCardItem key={item._id} item={item} />
      ))}
    </div>
  );
}

function AdminListSection({ space, loading }: { space: Space; loading?: boolean }) {
  const me = useMe();
  if (!space.admins?.length) return null;
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
                icon: 'icon-user',
                title: 'Add Admins',
                subtitle:
                  'Add admins by entering their email addresses. They don’t need to have an existing Lemonade account.',
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

        <CardTable.EmptyState icon="icon-community" title="No Featured Hub" />

        {space.admins.map((item) => (
          <CardTable.Row key={item._id}>
            <div key={item._id} className="flex gap-3 items-center px-4 py-3">
              <Avatar src={userAvatar(item)} className="size-5" />
              <div className="flex gap-2 flex-1">
                <p>{item.username || item.name || item.display_name || 'Anonymous'}</p>
                {item.email && <p>{item.email}</p>}
                <Badge
                  className="rounded-full"
                  title={isCreator ? 'Creator' : 'Admin'}
                  color={isCreator ? 'var(--color-success-500)' : 'var(--color-accent-400)'}
                />
              </div>

              <i
                className="icon-edit-sharp size-5 aspect-square text-tertiary hover:text-primary cursor-pointer"
                onClick={() => toast.success('Coming soon')}
              />
            </div>
          </CardTable.Row>
        ))}
      </CardTable.Root>
    </CommonSection>
  );
}

function FeaturedHubSection({ loading, data = [] }: { data?: PublicSpace[]; loading?: boolean }) {
  const router = useRouter();
  return (
    <CommonSection
      title="Featured Hubs"
      subtitle="Showcase other community hubs you manage on the community page."
      actions={[{ iconLeft: 'icon-plus', title: 'Add Hub', onClick: () => toast.success('Coming soon') }]}
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

        <CardTable.EmptyState icon="icon-community" title="No Featured Hub" />

        {data.map((item) => (
          <CardTable.Row key={item._id}>
            <div className="flex gap-3 items-center px-4 py-3 hover:bg-card-hover">
              {item.image_avatar_expanded && (
                <Avatar src={generateUrl(item.image_avatar_expanded)} className="size-5" />
              )}
              <p className="flex-1 cursor-pointer" onClick={() => router.push(`/s/${item.slug || item._id}`)}>
                {item.title}
              </p>
            </div>
          </CardTable.Row>
        ))}
      </CardTable.Root>
    </CommonSection>
  );
}
