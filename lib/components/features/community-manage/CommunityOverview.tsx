'use client';

import { useQuery } from '$lib/graphql/request';
import {
  Event,
  GetSpaceDocument,
  GetSpaceEventsDocument,
  GetSubSpacesDocument,
  PublicSpace,
  Space,
} from '$lib/graphql/generated/backend/graphql';

import { isObjectId } from '$lib/utils/helpers';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, Badge, Button, Card, Divider, toast } from '$lib/components/core';
import { twMerge } from 'tailwind-merge';
import { PendingApprovalEvents } from './PendingApprovalEvents';
import { EventCardItem } from '../EventList';
import { match } from 'ts-pattern';
import { userAvatar } from '$lib/utils/user';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';

export function CommunityOverview() {
  const params = useParams<{ uid: string }>();

  const variables = isObjectId(params.uid) ? { id: params.uid, slug: params.uid } : { slug: params.uid };
  const { data, loading } = useQuery(GetSpaceDocument, { variables });
  const space = data?.getSpace as Space;

  const { data: subSpacesData } = useQuery(GetSubSpacesDocument, {
    variables: { id: space?._id },
    skip: !space?._id,
  });
  const subSpaces = (subSpacesData?.getSubSpaces || []) as PublicSpace[];

  if (loading) return <p>Loading ... </p>;

  return (
    <div className="flex flex-col gap-8 pt-7 pb-20">
      <ListActions />

      <div className="[&>*:only-child]:hidden flex flex-col gap-5">
        <h3 className="text-xl font-semibold">Events</h3>
        {space?._id && <PendingApprovalEvents spaceId={space._id} total={2} />}
        {space && <UpComingEventsSection space={space} />}
      </div>

      {space && (
        <>
          <Divider />
          <AdminListSection space={space} />
        </>
      )}

      <Divider />
      <FeaturedHubSection data={subSpaces} />
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

function ListActions() {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      {actions.map((item) => (
        <Card.Root
          key={item.key}
          className="flex-1"
          onClick={() => {
            match(item.key)
              .with('add_event', () => router.push('/create/event'))
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

const LIMIT = 2;
const FROM_NOW = new Date().toISOString();
function UpComingEventsSection({ space }: { space: Space }) {
  const router = useRouter();
  const { data } = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: space._id,
      limit: LIMIT,
      skip: 0,
      endFrom: FROM_NOW,
      spaceTags: [],
    },
    skip: !space._id,
  });
  const events = (data?.getEvents || []) as Event[];

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

function CommonSection({
  children,
  title,
  count,
  subtitle,
  actions = [],
}: React.PropsWithChildren & {
  title: string;
  count?: number;
  subtitle: string;
  actions?: Array<{ icon: string; onClick?: React.MouseEventHandler<HTMLButtonElement>; title: string }>;
}) {
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex gap-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            {count && (
              <div className="size-6 aspect-square rounded-full inline-flex items-center justify-center bg-primary/[0.08] text-tertiary">
                <p className="text-xs">{count}</p>
              </div>
            )}
          </div>

          <p className="text-secondary">{subtitle}</p>
        </div>
        {actions.map((item, idx) => (
          <Button key={idx} iconLeft={item.icon} size="sm" variant="tertiary-alt" onClick={item.onClick}>
            {item.title}
          </Button>
        ))}
      </div>
      {children}
    </div>
  );
}

function AdminListSection({ space }: { space: Space }) {
  const me = useMe();
  if (!space.admins?.length) return null;
  const isCreator = me?._id === space.creator;

  return (
    <CommonSection
      title="Admins"
      subtitle="Add hosts, special guests, and event managers."
      actions={[{ icon: 'icon-plus', title: 'Add Admin', onClick: () => toast.success('Coming soon') }]}
    >
      <Card.Root>
        <Card.Content className="p-0 divide-y divide-(--color-divider)">
          {space.admins?.map((item) => (
            <div key={item._id} className="flex gap-3 items-center px-4 py-3">
              <Avatar src={userAvatar(item)} className="size-5" />
              <div className="flex gap-2 flex-1">
                <p>{item.name || item.display_name}</p>
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
          ))}
        </Card.Content>
      </Card.Root>
    </CommonSection>
  );
}

function FeaturedHubSection({ data = [] }: { data?: PublicSpace[] }) {
  return (
    <CommonSection
      title="Featured Hubs"
      subtitle="Showcase other community hubs you manage on the community page."
      actions={[{ icon: 'icon-plus', title: 'Add Hub', onClick: () => toast.success('Coming soon') }]}
    >
      <Card.Root>
        <Card.Content className="p-0 divide-y divide-(--color-divider)">
          <div className="hidden only:flex flex-col justify-center items-center aspect-video py-12">
            <i className="icon-community size-[120px] md:size-[184px] aspect-square text-quaternary" />
            <div className="space-y-2 text-center">
              <h3 className="text-xl text-tertiary font-semibold">No Featured Hub</h3>
              <p className="text-tertiary max-sm:text-xs max-sm:w-xs md:w-[480px]"></p>
            </div>
          </div>

          {data.map((item) => (
            <div key={item._id} className="flex gap-3 items-center px-4 py-3 hover:bg-card-hover">
              {item.image_avatar_expanded && (
                <Avatar src={generateUrl(item.image_avatar_expanded)} className="size-5" />
              )}
              <p className="flex-1">{item.title}</p>
            </div>
          ))}
        </Card.Content>
      </Card.Root>
    </CommonSection>
  );
}
