'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useAtomValue } from 'jotai';

import { Accordion, Button, Card, Divider, drawer, modal, Skeleton } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { ASSET_PREFIX, SELF_VERIFICATION_CONFIG } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { EventCardItem } from '$lib/components/features/EventList';
import { useQuery } from '$lib/graphql/request';
import {
  Event,
  GetSelfVerificationStatusDocument,
  GetSpacesDocument,
  GetUpcomingEventsDocument,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { EventPane, ProfilePane } from '$lib/components/features/pane';
import { CompleteProfilePane } from '$lib/components/features/pane/CompleteProfilePane';
import { useAppKitAccount } from '@reown/appkit/react';
import { VerifyEmailModal } from '$lib/components/features/auth/VerifyEmailModal';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { GetVerifiedModal } from '$lib/components/features/modals/GetVerifiedModal';
import { useLinkFarcaster } from '$lib/hooks/useConnectFarcaster';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { Order_By, PoolCreated, PoolCreatedDocument } from '$lib/graphql/generated/coin/graphql';
import { coinClient } from '$lib/graphql/request/instances';
import { useTokenData } from '$lib/hooks/useCoin';
import { formatWallet } from '$lib/utils/crypto';

import { calculateMarketCapData } from '$lib/utils/coin';
import { useClaimUsername, useLemonadeUsername } from '$lib/hooks/useUsername';
import { chainsMapAtom } from '$lib/jotai';

export function Content() {
  const me = useMe();

  const { data: selfVerificationStatus } = useQuery(GetSelfVerificationStatusDocument, {
    variables: {
      config: SELF_VERIFICATION_CONFIG,
    },
    skip: !me,
  });

  if (!me) return <NonLoginContent />;

  return (
    <div className="pt-12 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Lemonade Stand</h1>

      <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-14">
        <div className="flex-1 flex flex-col gap-4 mb-20">
          <UpcomingEventSection />
          <Divider />
          <CommunitySection />
          <Divider />
          <AllCoins />
        </div>

        <div>
          <div className="flex md:flex-col gap-4 min-w-[264px] sticky top-12 overflow-x-auto no-scrollbar">
            {selfVerificationStatus?.getSelfVerificationStatus?.disclosures?.some((item) => !item.verified) && (
              <CardItem
                onClick={() => modal.open(GetVerifiedModal)}
                className="bg-transparent [&_.title]:text-sm"
                image={
                  <div className="bg-accent-400/16 size-[38px] flex items-center justify-center rounded-sm">
                    <i className="icon-verified-outline text-accent-400" />
                  </div>
                }
                title="Get Verified"
                subtitle={
                  <div className="flex gap-1 items-center text-tertiary">
                    <p className="title text-lg">Powered by</p>
                    <i className="icon-self size-3.5" />
                    <p className="title text-lg">Self</p>
                  </div>
                }
                rightContent={<i className="icon-chevron-right text-tertiary" />}
              />
            )}

            <CompleteYourProfile />

            <LemonHeadsZone />

            {/* <CardItem */}
            {/*   onClick={() => comingSoon()} */}
            {/*   className="bg-transparent [&_.title]:text-sm" */}
            {/*   image={ */}
            {/*     <div className="bg-alert-400/16 size-[38px] flex items-center justify-center rounded-sm"> */}
            {/*       <i className="icon-user-group-outline text-alert-400" /> */}
            {/*     </div> */}
            {/*   } */}
            {/*   title="Team" */}
            {/*   subtitle="Add people you collab with." */}
            {/*   rightContent={<i className="icon-chevron-right text-tertiary" />} */}
            {/* /> */}

            {/* <CardItem */}
            {/*   onClick={() => comingSoon()} */}
            {/*   className="bg-transparent [&_.title]:text-sm" */}
            {/*   image={ */}
            {/*     <div className="bg-success-400/16 size-[38px] flex items-center justify-center rounded-sm"> */}
            {/*       <i className="icon-government text-success-400" /> */}
            {/*     </div> */}
            {/*   } */}
            {/*   title="Vaults" */}
            {/*   subtitle="Collect payments easily." */}
            {/*   rightContent={<i className="icon-chevron-right text-tertiary" />} */}
            {/* /> */}
          </div>
        </div>
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
                  All Events
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
            me={me}
            onManage={
              [item.host, ...(item.cohosts || [])].includes(me?._id)
                ? (e) => {
                    e.stopPropagation();
                    router.push(`/e/manage/${item.shortid}`);
                  }
                : undefined
            }
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

  const { data } = useQuery(GetSpacesDocument, {
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
              onClick={() => router.push(`/s/manage/${item.slug || item._id}`)}
            />
          ))}
        <div className="hidden only:block text-center text-gray-500 py-10">
          <EmptyCard
            icon="icon-confirmation-number"
            title="No Communities Yet"
            subtitle="Communities you create and manage will appear here."
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
    <div className="flex flex-col gap-2 mb-20">
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
  rightContent,
  className,
}: {
  image?: string | React.ReactElement;
  title: string;
  subtitle: string | React.ReactElement;
  rightContent?: React.ReactElement;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}) {
  return (
    <Card.Root onClick={onClick} className={twMerge('min-w-fit', className)}>
      <Card.Content className="flex gap-3 items-center px-3 md:px-4 py-2.5 md:py-3">
        {typeof image === 'string' ? <img src={image} className="size-[38px] rounded-sm aspect-square" /> : image}
        <div className="space-y-0.5 flex-1">
          <p className="title text-lg">{title}</p>
          {typeof subtitle === 'string' ? <p className="text-sm text-tertiary">{subtitle}</p> : subtitle}
        </div>
        <div className="hidden md:block">{rightContent}</div>
      </Card.Content>
    </Card.Root>
  );
}

function CompleteYourProfile() {
  const me = useMe();
  const { username } = useLemonadeUsername();
  const openClaimUsername = useClaimUsername();

  const { isConnected } = useAppKitAccount();

  const openEditProfilePane = () => drawer.open(ProfilePane);

  const { handleConnect } = useLinkFarcaster();

  const [tasks, setTasks] = React.useState([
    {
      key: 'verify_email',
      label: 'Verify Email',
      completed: !!me?.email_verified,
      show: true,
      onClick: () => modal.open(VerifyEmailModal),
    },
    {
      key: 'add_photo',
      label: 'Add Profile Photo',
      completed: !!me?.new_photos_expanded?.length,
      show: true,
      onClick: openEditProfilePane,
    },
    {
      key: 'add_display_name',
      label: 'Add display name',
      completed: !!me?.name || !!me?.display_name,
      onClick: openEditProfilePane,
    },
    { key: 'add_bio', label: 'Add bio', completed: !!me?.description, onClick: openEditProfilePane },
    {
      key: 'claim_username',
      label: 'Claim Username',
      completed: !!username,
      show: true,
      onClick: openClaimUsername,
    },
    // {key: 'verify_email', label: 'Download Lemonade app', completed: false },
    {
      key: 'connect_wallet',
      label: 'Connect wallet',
      completed: isConnected,
      onClick: () =>
        modal.open(ConnectWallet, {
          props: {
            onConnect() {
              setTasks((prev) =>
                prev.map((item) => (item.key === 'connect_wallet' ? { ...item, completed: true } : item)),
              );
            },
          },
        }),
    },
    {
      key: 'connect_farcaster',
      label: 'Connect Farcaster',
      completed: !!me?.kratos_farcaster_fid,
      show: true,
      onClick: () => handleConnect(),
    },
    // { label: 'Connect Stripe', completed: false },
    // { label: 'Connect Eventbrite', completed: false },
  ]);

  React.useEffect(() => {
    if (username) {
      setTasks((prev) => prev.map((item) => (item.key === 'claim_username' ? { ...item, completed: true } : item)));
    }
  }, [username]);

  return (
    <>
      <Card.Root className="bg-transparent hidden md:block">
        <Card.Content className="flex px-4 py-3 flex-col gap-3">
          <div className="flex justify-between items-center">
            <p>Complete Your Profile</p>
            <i
              className="icon-arrow-outward text-quaternary size-5 aspect-square cursor-pointer hover:text-primary"
              onClick={() => drawer.open(CompleteProfilePane, { props: { tasks } })}
            />
          </div>

          <div className="flex flex-col gap-2">
            {tasks
              .filter((item) => item.show)
              .map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className="text-tertiary hover:text-primary flex items-center gap-2 cursor-pointer"
                    onClick={!item.completed ? item.onClick : undefined}
                  >
                    <i
                      className={clsx(
                        'size-4',
                        item.completed ? 'icon-check-filled text-accent-400' : 'icon-circle-outline text-tertiary',
                      )}
                    />
                    <p className="text-sm text-primary">{item.label}</p>
                  </div>
                );
              })}
          </div>

          <div className="flex gap-0.5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={clsx(
                  'h-2 flex-1 first:rounded-l-full last:rounded-r-full',
                  idx < tasks.filter((item) => item.show && item.completed).length ? 'bg-accent-400' : 'bg-quaternary',
                )}
              />
            ))}
          </div>
        </Card.Content>
      </Card.Root>

      <CardItem
        onClick={() => drawer.open(CompleteProfilePane, { props: { tasks } })}
        className="block md:hidden bg-transparent [&_.title]:text-sm"
        image={
          <div className="bg-primary/8 size-[38px] flex items-center justify-center rounded-sm">
            <i className="icon-account text-primary/56" />
          </div>
        }
        title="Complete Your Profile"
        subtitle={<p className="text-xs text-warning-400">{tasks.filter((item) => !item.completed).length} pending</p>}
        rightContent={<i className="icon-chevron-right text-tertiary" />}
      />
    </>
  );
}

function LemonHeadsZone() {
  const router = useRouter();
  const { data, loading } = useLemonhead();

  const onClick = () => router.push('/lemonheads');

  //NOTE: prevent click to claim lemonheads. IMPORTANT: MUST WAITING FOR CHECKING
  if (loading) return null;

  if (data && data.tokenId > 0) {
    return (
      <CardItem
        className="bg-transparent [&_.title]:text-sm"
        image={
          <div className="size-[38px] aspect-square flex items-center justify-center rounded-sm">
            <img src={data.image} className="w-full h-full rounded-sm" />
          </div>
        }
        title="LemonHeads Zone"
        subtitle={`LemonHead #${data.tokenId}`}
        rightContent={<i className="icon-chevron-right text-tertiary" />}
        onClick={onClick}
      />
    );
  }

  return (
    <CardItem
      className="bg-transparent [&_.title]:text-sm"
      image={
        <div className="bg-[#A3E635]/16 size-[38px] flex items-center justify-center rounded-sm">
          <i className="icon-lemonade-logo text-[#A3E635]" />
        </div>
      }
      title="LemonHeads Zone"
      subtitle="Claim your LemonHead"
      rightContent={<i className="icon-chevron-right text-tertiary" />}
      onClick={onClick}
    />
  );
}

function AllCoins() {
  const router = useRouter();
  const me = useMe();
  const { address } = useAppKitAccount();

  const handleCreateCoin = () => {
    router.push('/create/coin');
  };

  const userWallets = React.useMemo(() => {
    const wallets: string[] = [];

    if (address) {
      wallets.push(address.toLowerCase());
    }

    if (me?.wallets_new?.ethereum) {
      me.wallets_new.ethereum.forEach((wallet: string) => {
        if (wallet) {
          wallets.push(wallet.toLowerCase());
        }
      });
    }

    if (me?.kratos_wallet_address) {
      wallets.push(me.kratos_wallet_address.toLowerCase());
    }

    return [...new Set(wallets)];
  }, [address, me?.wallets_new?.ethereum, me?.kratos_wallet_address]);

  const { data, loading } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        orderBy: [
          {
            blockTimestamp: Order_By.Desc,
          },
        ],
        offset: 0,
        where:
          userWallets.length > 0
            ? {
                paramsCreator: {
                  _in: userWallets,
                },
              }
            : undefined,
      },
      fetchPolicy: 'network-only',
      skip: userWallets.length === 0,
    },
    coinClient,
  );

  const pools = data?.PoolCreated || [];

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
                <h3 className="text-xl font-semibold">Coins</h3>
              </div>
              <div className="hidden md:flex gap-2">
                <Button size="sm" variant="tertiary-alt" iconLeft="icon-plus" onClick={handleCreateCoin}>
                  New Coin
                </Button>
              </div>

              <div className="flex md:hidden gap-2">
                <Button size="sm" variant="tertiary-alt" icon="icon-plus" onClick={handleCreateCoin} />
              </div>
            </div>
          );
        }}
      </Accordion.Header>
      <Accordion.Content className={clsx('pt-1! px-0! flex flex-col md:grid gap-3', !!pools.length && 'grid-cols-2')}>
        {loading ? (
          <Card.Root className="min-w-fit">
            <Card.Content className="flex gap-3 items-center px-3 md:px-4 py-2.5 md:py-3">
              <Skeleton className="size-[38px] rounded-sm" animate />
              <Skeleton className="h-9 w-24 rounded-md" animate />
            </Card.Content>
          </Card.Root>
        ) : (
          <>
            {pools.map((pool) => (
              <CoinItem key={pool.id} pool={pool} />
            ))}
            <div className="hidden only:block text-center text-gray-500">
              <EmptyCard
                icon="icon-confirmation-number"
                title="No Coins Yet"
                subtitle="Coins you create and manage will appear here."
              />
            </div>
          </>
        )}
      </Accordion.Content>
    </Accordion.Root>
  );
}

function CoinItem({ pool }: { pool: PoolCreated }) {
  const router = useRouter();
  const chainsMap = useAtomValue(chainsMapAtom);

  const chain = chainsMap[pool.chainId.toString()];
  const { tokenData, isLoadingTokenData } = useTokenData(chain, pool.memecoin, pool.tokenURI as string);

  const { formattedAmount, percentageChange } = calculateMarketCapData(
    pool.latestMarketCapETH,
    pool.previousMarketCapETH,
  );

  if (isLoadingTokenData)
    return (
      <Card.Root className="min-w-fit">
        <Card.Content className="flex gap-3 items-center px-3 md:px-4 py-2.5 md:py-3">
          <Skeleton className="size-[38px] rounded-sm" animate />
          <div className="space-y-0.5 flex-1">
            <Skeleton className="h-5 w-24 rounded-md" animate />
            <Skeleton className="h-4 w-32 rounded-md" animate />
          </div>
        </Card.Content>
      </Card.Root>
    );

  if (!tokenData) return null;

  const displaySymbol = tokenData?.symbol || formatWallet(pool.memecoin);

  return (
    <CardItem
      key={pool.id}
      title={displaySymbol}
      subtitle={formatWallet(pool.memecoin)}
      image={tokenData.metadata?.imageUrl || undefined}
      onClick={() => router.push(`/coin/${chain.code_name}/${pool.memecoin}`)}
      rightContent={
        <div className="flex flex-col items-end">
          <p className="text-primary">{formattedAmount}</p>
          {percentageChange !== null && (
            <p className={clsx('text-sm', percentageChange > 0 ? 'text-success-500' : 'text-danger-500')}>
              {percentageChange > 0 && '+'}
              {percentageChange.toFixed(2)}%
            </p>
          )}
        </div>
      }
    />
  );
}
