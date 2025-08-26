'use client';
import { twMerge } from 'tailwind-merge';

import { Accordion, Button, Card, Divider, drawer } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { EventCardItem, EventList, EventListCard } from '$lib/components/features/EventList';
import { useQuery } from '$lib/graphql/request';
import {
  Event,
  GetSpacesDocument,
  GetUpcomingEventsDocument,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { EventPane } from '$lib/components/features/pane';

export function Content() {
  const me = useMe();

  if (!me) return <NonLoginContent />;

  return (
    <div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Welcom, {me.name}</h3>
        <p className="text-sm text-secondary">Quickly catch up, access your events, communities & feeds.</p>
      </div>

      <div className="flex md:gap-14">
        <div className="flex-1 flex flex-col gap-4 mb-20">
          <UpcomingEventSection />
          <Divider />
          <CommunitySection />
        </div>

        <div></div>
      </div>
    </div>
  );
}

function UpcomingEventSection() {
  const router = useRouter();
  const me = useMe();
  const { data } = useQuery(GetUpcomingEventsDocument, { variables: { user: me?._id, skip: 0, limit: 3 } });

  return (
    <Accordion.Root className="border-none" open>
      <Accordion.Header chevron={false} className="px-0!">
        {({ toggle, isOpen }) => {
          return (
            <div className="flex items-center justify-between text-primary w-full">
              <div className="flex items-center gap-2">
                <Button
                  variant="tertiary"
                  className="rounded-full"
                  size="xs"
                  icon={clsx('icon-chevron-down', isOpen && 'rotate-180')}
                  onClick={() => toggle()}
                />
                <h3 className="text-xl font-semibold">Upcoming Events</h3>
              </div>
              <div className="hidden md:flex gap-2">
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  iconLeft="icon-plus"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/create/event');
                  }}
                >
                  New Event
                </Button>
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  iconRight="icon-chevron-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/events');
                  }}
                >
                  All Event
                </Button>
              </div>

              <div className="flex md:hidden gap-2">
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  icon="icon-plus"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/create/event');
                  }}
                />
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  icon="icon-chevron-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/events');
                  }}
                />
              </div>
            </div>
          );
        }}
      </Accordion.Header>
      <Accordion.Content className="pt-1! px-0! flex flex-col gap-3">
        {data?.events?.map((item) => (
          <EventCardItem
            item={item as Event}
            key={item._id}
            onClick={() => drawer.open(EventPane, { props: { eventId: item._id } })}
          />
        ))}

        <div className="hidden only:block text-center text-gray-500 py-10">
          <EmptyCard
            icon="icon-confirmation-number"
            title="No Upcoming Events"
            subtitle="When you create or join events, they’ll show up here."
          />
        </div>
      </Accordion.Content>
    </Accordion.Root>
  );
}

function CommunitySection() {
  const router = useRouter();

  const { data, loading } = useQuery(GetSpacesDocument, {
    variables: { roles: [SpaceRole.Admin, SpaceRole.Creator, SpaceRole.Ambassador] },
  });

  const getImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  return (
    <Accordion.Root className="border-none" open>
      <Accordion.Header chevron={false} className="px-0!">
        {({ toggle, isOpen }) => {
          return (
            <div className="flex items-center justify-between text-primary w-full">
              <div className="flex items-center gap-2">
                <Button
                  variant="tertiary"
                  className="rounded-full"
                  size="xs"
                  icon={clsx('icon-chevron-down', isOpen && 'rotate-180')}
                  onClick={() => toggle()}
                />
                <h3 className="text-xl font-semibold">Communities</h3>
              </div>
              <div className="hidden md:flex gap-2">
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  iconLeft="icon-plus"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/create/community');
                  }}
                >
                  New Community
                </Button>
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  iconRight="icon-chevron-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/communities');
                  }}
                >
                  All Communities
                </Button>
              </div>

              <div className="flex md:hidden gap-2">
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  icon="icon-plus"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/create/community');
                  }}
                />
                <Button
                  size="sm"
                  variant="tertiary-alt"
                  icon="icon-chevron-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/communities');
                  }}
                />
              </div>
            </div>
          );
        }}
      </Accordion.Header>
      <Accordion.Content
        className={clsx('pt-1! px-0! flex flex-col md:grid gap-3', !!data?.listSpaces.length && 'grid-cols-2')}
      >
        {(data?.listSpaces as Space[])
          ?.slice(0, 6)
          .map((item) => (
            <CardItem
              key={item._id}
              title={item.title}
              subtitle={`${item.followers_count || 0} Subscribers`}
              image={getImageSrc(item)}
              onClick={() => (window.location.href = `/manage/community/${item.slug || item._id}`)}
            />
          ))}
        <div className="hidden only:block text-center text-gray-500 py-10">
          <EmptyCard
            icon="icon-confirmation-number"
            title="No Upcoming Events"
            subtitle="When you create or join events, they’ll show up here."
          />
        </div>
      </Accordion.Content>
    </Accordion.Root>
  );
}

function EmptyCard({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <Card.Root>
      <Card.Content className="flex gap-3 text-tertiary items-center">
        <i className={twMerge('size-9 aspect-square', icon)} />
        <div className="space-y-0.5">
          <p>{title}</p>
          <p className="text-sm">{subtitle}</p>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

const cards = [
  {
    icon: 'icon-ticket',
    color: 'bg-alert-500',
    title: () => (
      <p className="md:text-lg">
        Run <span className="text-alert-400!">events</span> that power your community.
      </p>
    ),
    subtitle: 'Create & manage events that your community won’t forget.',
  },
  {
    icon: 'icon-community',
    color: 'bg-warning-600',
    title: () => (
      <p className="md:text-lg">
        Create <span className="text-warning-400">hubs</span> where people come together.
      </p>
    ),
    subtitle: 'Bring members together in spaces that grow with you.',
  },
  {
    icon: 'icon-farcaster',
    color: 'bg-accent-500',
    title: () => (
      <p className="md:text-lg">
        Bring your Farcaster <span className="text-accent-400">channels</span> to life.
      </p>
    ),
    subtitle: 'Import them, link to your hubs, and host events seamlessly.',
  },
  {
    icon: 'icon-lens',
    color: 'bg-success-600',
    title: () => (
      <p className="md:text-lg">
        Deploy Lens <span className="text-success-400">feeds</span> for your hubs.
      </p>
    ),
    subtitle: 'Give your community a live social layer that keeps them connected.',
  },
];

function NonLoginContent() {
  const signIn = useSignIn();

  return (
    <div className="flex flex-col gap-2 mb-20 md:my-14">
      <div className="rounded-md outline-2 outline-card-border overflow-hidden">
        <div
          className="w-full aspect-video max-h-[548px] p-5 md:p-16 flex flex-col justify-between"
          style={{ background: `url(${ASSET_PREFIX}/assets/images/home-bg.png) lightgray 50% / cover no-repeat` }}
        >
          <div className="flex flex-col gap-2 md:gap-4">
            <h3 className="text-xl md:text-[60px] font-semibold md:leading-[72px] max-w-2/3">
              Create your Lemonade Stand
            </h3>
            <p className="text-sm md:text-[24px] md:leading-9 text-secondary max-w-5/6 md:max-w-1/2">
              Your space for events, communities, and everything in between.
            </p>
          </div>

          <div className="hidden md:flex justify-between items-end">
            <Button size="lg" onClick={() => signIn()}>
              Get Started
            </Button>
            <img src={`${ASSET_PREFIX}/assets/images/waving-hand.svg`} className="size-24 aspect-square" />
          </div>

          <div className="flex md:hidden justify-between items-end">
            <Button size="sm" onClick={() => signIn()}>
              Get Started
            </Button>
            <img src={`${ASSET_PREFIX}/assets/images/waving-hand.svg`} className="size-12 aspect-square" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 py-2">
        {cards.map((item, idx) => (
          <Card.Root key={idx}>
            <Card.Content className="p-5 flex flex-row md:flex-col gap-4">
              <div className={twMerge('size-14 aspect-square flex items-center justify-center rounded-sm', item.color)}>
                <i className={twMerge('size-8', item.icon)} />
              </div>

              <div className="flex flex-col gap-1">
                {item.title()}
                <p className="text-sm text-tertiary">{item.subtitle}</p>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}

function CardItem({
  image,
  title,
  subtitle,
  onClick,
}: {
  image: string;
  title: string;
  subtitle: string;
  rightContent?: React.ReactElement;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <Card.Root onClick={onClick}>
      <Card.Content className="flex gap-3">
        <img src={image} className="size-[38px] aspect-square" />
        <div className="space-y-0.5">
          <p className="text-lg">{title}</p>
          <p className="text-sm text-tertiary">{subtitle}</p>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
