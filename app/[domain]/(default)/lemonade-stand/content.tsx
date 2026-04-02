'use client';

import React from 'react';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppKitAccount } from '@reown/appkit/react';

import { Button, Card, Menu, MenuItem, Segment, Skeleton, drawer } from '$lib/components/core';
import { AgentDashboardCard, AgentDashboardCardSkeleton } from '$lib/components/features/ai/manage/AgentDashboardCard';
import { KnowledgeBaseListRow, KnowledgeBaseListRowSkeleton } from '$lib/components/features/ai/manage/KnowledgeBaseListRow';
import { getAiDocumentFilter, getConfigAvatarSrc, getConfigDocumentIds, type AiManageScope } from '$lib/components/features/ai/manage/shared';
import { AddKnowledgeBasePane } from '$lib/components/features/community-manage/panes/AddKnowledgeBasePane';
import { CreateAgentPane } from '$lib/components/features/community-manage/panes/CreateAgentPane';
import { CoinCard } from '$lib/components/features/coin/CoinCard';
import { CommunityHubCard, CommunityHubCardSkeleton } from '$lib/components/features/community/CommunityHubCard';
import { EventCardItem } from '$lib/components/features/EventCardItem';
import { openEventPane } from '$lib/components/features/pane';
import { GetAiDocumentsDocument, GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import type { Config, Document as AiDocument } from '$lib/graphql/generated/ai/graphql';
import {
  Event,
  GetPastEventsDocument,
  GetSpaceEventsDocument,
  GetSpacesDocument,
  GetUpcomingEventsDocument,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { Order_By, PoolCreatedDocument } from '$lib/graphql/generated/coin/graphql';
import { useQuery } from '$lib/graphql/request';
import { aiChatClient, coinClient } from '$lib/graphql/request/instances';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { generateUrl } from '$lib/utils/cnd';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { convertFromUtcToTimezone } from '$lib/utils/date';
import { userAvatar } from '$lib/utils/user';

type DashboardTab = 'events' | 'communities' | 'coins' | 'agents';
type EventPeriod = 'upcoming' | 'past';

enum EventFilterItem {
  AllEvents,
  Drafts,
  Hosting,
  Attending,
}

const DASHBOARD_TABS: Array<{ key: DashboardTab; label: string }> = [
  { key: 'events', label: 'Events' },
  { key: 'communities', label: 'Communities' },
  { key: 'coins', label: 'Coins' },
  { key: 'agents', label: 'Agents' },
];

const EVENT_FILTER_OPTIONS = {
  [EventFilterItem.AllEvents]: { label: 'All Events', icon: 'icon-house-party' },
  [EventFilterItem.Drafts]: { label: 'Drafts', icon: 'icon-document' },
  [EventFilterItem.Hosting]: { label: 'Hosting', icon: 'icon-crown' },
  [EventFilterItem.Attending]: { label: 'Attending', icon: 'icon-guests' },
};
const EVENT_PERIOD_ITEMS = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
] as const;
const MANAGED_HUB_ROLES = [SpaceRole.Creator, SpaceRole.Admin, SpaceRole.Ambassador];
const SUBSCRIBED_HUB_ROLES = [SpaceRole.Subscriber];
const MY_HUBS_QUERY_VARIABLES = { with_my_spaces: true, roles: MANAGED_HUB_ROLES };
const SUBSCRIBED_HUBS_QUERY_VARIABLES = { with_my_spaces: false, roles: SUBSCRIBED_HUB_ROLES };
const EVENT_GRID_CLASSNAME = 'grid gap-4 md:grid-cols-2 2xl:grid-cols-3';
const COMMUNITY_GRID_CLASSNAME = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5';

function getDashboardTab(value: string | null): DashboardTab {
  return DASHBOARD_TABS.some((tab) => tab.key === value) ? (value as DashboardTab) : 'events';
}

export function Content() {
  const me = useMe();

  if (!me) {
    return (
      <div className="flex h-full w-full items-center px-4 pt-12 md:px-12 md:pt-16">
        <NonLoginContent />
      </div>
    );
  }

  return <DashboardHome />;
}

function DashboardHome() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = React.useTransition();
  const activeTab = getDashboardTab(searchParams.get('tab'));

  const handleTabChange = (tab: DashboardTab) => {
    if (tab === activeTab) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);

    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  };

  return (
    <div className="flex w-full flex-col pb-16 md:pb-24">
      <div className="sticky top-0 z-10 bg-page-background/90 backdrop-blur-3xl">
        <div className="px-4 pt-10 md:px-12 md:pt-12">
          <div className="flex flex-col gap-1">
            <h1 className="font-title-default text-2xl leading-10 font-semibold text-white">
              Lemonade Stand
            </h1>
            <p className="max-w-2xl font-body-default text-base leading-6 text-white/56">
              Quickly catch up and manage your events, communities &amp; coins.
            </p>
          </div>
        </div>

        <div className="mt-2 border-b border-white/8 px-4 pt-2 md:px-12">
          <div className="no-scrollbar flex gap-4 overflow-x-auto pt-1">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={twMerge(
                  'shrink-0 border-b-2 border-transparent pb-2.5 font-body-default text-base leading-6 font-medium text-white/56 transition hover:text-white',
                  activeTab === tab.key && 'border-white text-white',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-7 md:px-12">
        {activeTab === 'events' && <EventsPanel />}
        {activeTab === 'communities' && <CommunitiesPanel />}
        {activeTab === 'coins' && <CoinsPanel />}
        {activeTab === 'agents' && <AgentsPanel />}
      </div>
    </div>
  );
}

function EventsPanel() {
  const me = useMe();
  const router = useRouter();
  const [period, setPeriod] = React.useState<EventPeriod>('upcoming');
  const [filterBy, setFilterBy] = React.useState(EventFilterItem.AllEvents);
  const [searchValue, setSearchValue] = React.useState('');
  const deferredSearchValue = React.useDeferredValue(searchValue);
  const normalizedSearch = deferredSearchValue.trim().toLocaleLowerCase();

  const host = filterBy === EventFilterItem.Hosting ? true : filterBy === EventFilterItem.Attending ? false : undefined;
  const unpublished = filterBy === EventFilterItem.Drafts ? true : undefined;
  const isSearching = Boolean(searchValue.trim());

  const variables = React.useMemo(
    () => ({
      user: me?._id || '',
      host,
      unpublished,
    }),
    [host, me?._id, unpublished],
  );
  const upcomingQueryVariables = React.useMemo(() => ({ ...variables, sort: { start: 1 } }), [variables]);
  const pastQueryVariables = React.useMemo(() => ({ ...variables, sort: { start: -1 } }), [variables]);

  const { data: upcomingData, loading: upcomingLoading } = useQuery(GetUpcomingEventsDocument, {
    variables: upcomingQueryVariables,
    skip: !me?._id || period !== 'upcoming',
  });

  const { data: pastData, loading: pastLoading } = useQuery(GetPastEventsDocument, {
    variables: pastQueryVariables,
    skip: !me?._id || period !== 'past',
  });

  const events = ((period === 'upcoming' ? upcomingData?.events : pastData?.events) as Event[]) || [];
  const filteredEvents = React.useMemo(
    () =>
      normalizedSearch
        ? events.filter((event) => event.title.toLocaleLowerCase().includes(normalizedSearch))
        : events,
    [events, normalizedSearch],
  );
  const loading = period === 'upcoming' ? upcomingLoading : pastLoading;

  return (
    <section className="flex flex-col gap-5">
      <SectionHeader
        title="My Events"
        titleClassName="font-body-default text-xl font-medium leading-none text-white"
        controls={
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            <SectionSearchField value={searchValue} onChange={setSearchValue} label="Search my events" />

            <Segment
              size="sm"
              selected={period}
              onSelect={({ value }) => setPeriod(value as EventPeriod)}
              items={EVENT_PERIOD_ITEMS}
            />

            <Menu.Root className="w-33">
              <Menu.Trigger>
                <div className="btn btn-tertiary rounded-sm">
                  <MenuItem iconRight="icon-chevrons-up-down">
                    <div className="flex flex-1 items-center gap-1.5">
                      <i className={twMerge(EVENT_FILTER_OPTIONS[filterBy].icon, 'size-4 text-tertiary')} />
                      <p className="font-default-body flex-1 text-sm font-medium text-secondary">
                        {EVENT_FILTER_OPTIONS[filterBy].label}
                      </p>
                    </div>
                  </MenuItem>
                </div>
              </Menu.Trigger>

              <Menu.Content className="p-1">
                {({ toggle }) =>
                  Object.entries(EVENT_FILTER_OPTIONS).map(([key, value]) => (
                    <MenuItem
                      key={key}
                      title={value.label}
                      iconLeft={value.icon}
                      onClick={() => {
                        setFilterBy(Number(key) as EventFilterItem);
                        toggle();
                      }}
                    />
                  ))
                }
              </Menu.Content>
            </Menu.Root>

            <Button icon="icon-plus" size="sm" variant="tertiary" onClick={() => router.push('/create/event')} />
          </div>
        }
      />

      {loading ? (
        <div className={EVENT_GRID_CLASSNAME}>
          {Array.from({ length: 4 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredEvents.length ? (
        <div className={EVENT_GRID_CLASSNAME}>
          {filteredEvents.map((event) => (
            <EventCardItem
              key={event._id}
              item={event}
              me={me}
              onClick={() => openEventPane(event._id)}
              onManage={
                [event.host, ...(event.cohosts || [])].includes(me?._id)
                  ? (e) => {
                      e.stopPropagation();
                      router.push(`/e/manage/${event.shortid}`);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="icon-confirmation-number"
          title={isSearching ? 'No events match your search' : period === 'upcoming' ? 'No events on deck' : 'No past events yet'}
          description={
            isSearching
              ? 'Try a different event name or adjust your event filter.'
              : 'Your event queue will show up here as soon as you start hosting or attending.'
          }
          actionLabel={!isSearching && period === 'upcoming' ? 'Create Event' : undefined}
          onAction={!isSearching && period === 'upcoming' ? () => router.push('/create/event') : undefined}
        />
      )}
    </section>
  );
}

function CommunitiesPanel() {
  const me = useMe();
  const router = useRouter();
  const [searchValue, setSearchValue] = React.useState('');
  const deferredSearchValue = React.useDeferredValue(searchValue);
  const normalizedSearch = deferredSearchValue.trim().toLocaleLowerCase();
  const isSearching = Boolean(searchValue.trim());
  const { data: myHubsData, loading: myHubsLoading } = useQuery(GetSpacesDocument, {
    variables: MY_HUBS_QUERY_VARIABLES,
    fetchPolicy: 'cache-and-network',
  });
  const { data: subscribedData, loading: subscribedLoading } = useQuery(GetSpacesDocument, {
    variables: SUBSCRIBED_HUBS_QUERY_VARIABLES,
    fetchPolicy: 'cache-and-network',
  });

  const myHubs = React.useMemo(
    () =>
      (((myHubsData?.listSpaces as Space[]) || []).slice()).sort(
        (a, b) => Number(!!b.personal) - Number(!!a.personal),
      ),
    [myHubsData?.listSpaces],
  );
  const subscribedHubs = React.useMemo(
    () => ((subscribedData?.listSpaces as Space[]) || []).slice(),
    [subscribedData?.listSpaces],
  );
  const filteredMyHubs = React.useMemo(
    () =>
      normalizedSearch
        ? myHubs.filter((space) => space.title.toLocaleLowerCase().includes(normalizedSearch))
        : myHubs,
    [myHubs, normalizedSearch],
  );
  const filteredSubscribedHubs = React.useMemo(
    () =>
      normalizedSearch
        ? subscribedHubs.filter((space) => space.title.toLocaleLowerCase().includes(normalizedSearch))
        : subscribedHubs,
    [normalizedSearch, subscribedHubs],
  );

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-5">
        <SectionHeader
          title="My Hubs"
          titleClassName="font-body-default text-xl font-medium leading-none text-white"
          controls={
            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
              <SectionSearchField value={searchValue} onChange={setSearchValue} label="Search my hubs and subscribed hubs" />
              <Button size="sm" variant="tertiary" icon="icon-explore" onClick={() => router.push('/explore')} />
              <Button size="sm" variant="tertiary" icon="icon-plus" onClick={() => router.push('/create/community')} />
            </div>
          }
        />

        {myHubsLoading ? (
          <div className={COMMUNITY_GRID_CLASSNAME}>
            {Array.from({ length: 5 }).map((_, index) => (
              <CommunityHubCardSkeleton key={index} view="card" />
            ))}
          </div>
        ) : filteredMyHubs.length ? (
          <div className={COMMUNITY_GRID_CLASSNAME}>
            {filteredMyHubs.map((space) => (
              <CommunityHubCard
                key={space._id}
                title={space.title}
                subtitle={`${(space.followers_count || 0).toLocaleString()} Followers`}
                view="card"
                onClick={() => router.push(`/s/manage/${space.slug || space._id}`)}
                image={{
                  src: getCommunityCardImageSrc(space, me),
                  class: twMerge('rounded-sm', space.personal && 'rounded-full'),
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="icon-community"
            title={isSearching ? 'No hubs match your search' : 'No hubs yet'}
            description={
              isSearching
                ? 'Try a different hub name to find one of your communities.'
                : 'Create your first hub to start organizing your community presence.'
            }
            actionLabel={!isSearching ? 'Create Community' : undefined}
            onAction={!isSearching ? () => router.push('/create/community') : undefined}
          />
        )}
      </div>

      <div className="flex flex-col gap-5">
        <SectionHeader
          title="Subscribed Hubs"
          titleClassName="font-body-default text-xl font-medium leading-none text-white"
        />

        {subscribedLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <SubscribedHubRowSkeleton key={index} />
            ))}
          </div>
        ) : filteredSubscribedHubs.length ? (
          <div className="flex flex-col gap-4">
            {filteredSubscribedHubs.map((space) => (
              <SubscribedHubRow key={space._id} space={space} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="icon-community"
            title={isSearching ? 'No subscribed hubs match your search' : 'No subscribed hubs'}
            description={
              isSearching
                ? 'Try a different hub name to search across the communities you follow.'
                : 'Communities you follow will appear here with their upcoming events.'
            }
            actionLabel={!isSearching ? 'Explore Communities' : undefined}
            onAction={!isSearching ? () => router.push('/explore') : undefined}
          />
        )}
      </div>
    </section>
  );
}

function SectionSearchField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <label className="flex h-8 w-full items-center gap-1.5 rounded-sm border border-primary/8 bg-background/64 px-2.5 transition-colors hover:border-quaternary focus-within:border-primary md:w-54">
      <i aria-hidden="true" className="icon-search size-4 shrink-0 text-quaternary" />
      <input
        type="search"
        value={value}
        aria-label={label}
        autoComplete="off"
        placeholder="Search"
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-primary placeholder:text-quaternary outline-none"
      />
    </label>
  );
}

function SubscribedHubRow({ space }: { space: Space }) {
  const router = useRouter();
  const endFrom = React.useMemo(() => new Date().toISOString(), []);
  const queryVariables = React.useMemo(
    () => ({
      space: space._id,
      limit: 3,
      endFrom,
      spaceTags: [],
    }),
    [endFrom, space._id],
  );
  const { data, loading } = useQuery(GetSpaceEventsDocument, {
    variables: queryVariables,
    fetchPolicy: 'cache-and-network',
  });

  const events = (data?.getEvents || []) as Event[];
  const imageSrc = getCommunityCardImageSrc(space);

  return (
    <div className="grid overflow-hidden rounded-xl border border-card-border bg-card md:grid-cols-3">
      <div className="flex flex-col gap-6 p-4 md:col-span-1">
        <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg">
          <img src={imageSrc} alt={space.title} className="size-full rounded-lg object-cover" />
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-title-default text-2xl leading-8 text-white line-clamp-2">{space.title}</p>
          <Button size="sm" variant="tertiary" className="w-fit" onClick={() => router.push(`/s/${space.slug || space._id}`)}>
            View Hub
          </Button>
        </div>
      </div>

      <div className="border-t border-card-border p-4 md:col-span-2 md:border-l md:border-t-0">
        <p className="text-sm leading-5 text-tertiary">Upcoming Events</p>

        <div className="mt-4 flex flex-col gap-3">
          {loading ? (
            <>
              <Skeleton className="h-6 w-40 rounded-md" animate />
              <Skeleton className="h-5 w-28 rounded-md" animate />
              <Skeleton className="h-6 w-32 rounded-md" animate />
            </>
          ) : events.length ? (
            events.map((event) => (
              <button
                key={event._id}
                type="button"
                onClick={() => openEventPane(event._id)}
                className="flex flex-col items-start gap-1 text-left transition hover:opacity-80"
              >
                <span className="text-base leading-6 text-white">{event.title}</span>
                <span className="text-sm leading-5 text-tertiary">
                  {format(convertFromUtcToTimezone(event.start, event.timezone), "EEE, MMM d, h:mm a")}
                </span>
              </button>
            ))
          ) : (
            <p className="text-sm leading-5 text-tertiary">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SubscribedHubRowSkeleton() {
  return (
    <div className="grid overflow-hidden rounded-xl border border-card-border bg-card md:grid-cols-3">
      <div className="flex flex-col gap-6 p-4 md:col-span-1">
        <Skeleton className="size-12 rounded-lg" animate />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 rounded-lg" animate />
          <Skeleton className="h-8 w-24 rounded-lg" animate />
        </div>
      </div>
      <div className="border-t border-card-border p-4 md:col-span-2 md:border-l md:border-t-0">
        <Skeleton className="h-5 w-28 rounded-md" animate />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-6 w-32 rounded-md" animate />
          <Skeleton className="h-5 w-24 rounded-md" animate />
          <Skeleton className="h-6 w-40 rounded-md" animate />
        </div>
      </div>
    </div>
  );
}

function getCommunityCardImageSrc(space: Space, me?: ReturnType<typeof useMe>) {
  if (space.personal) return userAvatar(me);
  if (space.image_avatar) return generateUrl(space.image_avatar_expanded);
  if (space.image_cover) return generateUrl(space.image_cover_expanded);
  return `${ASSET_PREFIX}/assets/images/default-dp.png`;
}

function CoinsPanel() {
  const router = useRouter();
  const me = useMe();
  const { address } = useAppKitAccount();

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
  }, [address, me?.kratos_wallet_address, me?.wallets_new?.ethereum]);

  const poolQueryVariables = React.useMemo(
    () => ({
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
    }),
    [userWallets],
  );
  const { data, loading } = useQuery(
    PoolCreatedDocument,
    {
      variables: poolQueryVariables,
      fetchPolicy: 'network-only',
      skip: userWallets.length === 0,
    },
    coinClient,
  );

  const pools = React.useMemo(() => (data?.PoolCreated || []).slice(0, 8), [data?.PoolCreated]);

  return (
    <section className="flex flex-col gap-5">
      <SectionHeader
        title="My Coins"
        titleClassName="font-body-default text-xl font-medium leading-none text-white"
        controls={<Button size="sm" variant="tertiary" icon="icon-plus" onClick={() => router.push('/create/coin')} />}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SimpleCardSkeleton key={index} />
          ))}
        </div>
      ) : pools.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pools.map((pool) => (
            <CoinCard key={pool.id} pool={pool} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="icon-confirmation-number"
          title="No coins yet"
          description="Coins tied to your connected wallets will appear here once they go live."
          actionLabel="Create Coin"
          onAction={() => router.push('/create/coin')}
        />
      )}
    </section>
  );
}

function AgentsPanel() {
  const me = useMe();
  const userId = me?._id;
  const scope = React.useMemo<AiManageScope | null>(
    () => (userId ? { type: 'user', userId } : null),
    [userId],
  );
  const configQueryVariables = React.useMemo(
    () => (userId ? { filter: { user_eq: userId } } : undefined),
    [userId],
  );
  const documentQueryVariables = React.useMemo(
    () => (scope ? { filter: getAiDocumentFilter(scope) } : undefined),
    [scope],
  );

  const { data: configsData, loading: configsLoading, refetch: refetchConfigs } = useQuery(
    GetListAiConfigDocument,
    {
      variables: configQueryVariables,
      fetchPolicy: 'cache-and-network',
      skip: !scope,
    },
    aiChatClient,
  );
  const { data: documentsData, loading: documentsLoading, refetch: refetchDocuments } = useQuery(
    GetAiDocumentsDocument,
    {
      variables: documentQueryVariables,
      fetchPolicy: 'cache-and-network',
      skip: !scope,
    },
    aiChatClient,
  );

  const configs = (configsData?.configs?.items ?? []) as Config[];
  const documents = (documentsData?.documents?.items ?? []) as AiDocument[];
  const configsById = React.useMemo(
    () => new Map(configs.map((config) => [config._id, config])),
    [configs],
  );

  const { configDocumentCounts, documentAgentsById } = React.useMemo(() => {
    const nextConfigDocumentCounts = new Map<string, number>();
    const nextDocumentAgentsById = new Map<
      string,
      Array<{ _id: string; avatar: string; name: string }>
    >();

    configs.forEach((config) => {
      const documentIds = getConfigDocumentIds(config);
      nextConfigDocumentCounts.set(config._id, documentIds.length);

      const agent = {
        _id: config._id,
        avatar: getConfigAvatarSrc(config),
        name: config.name,
      };

      documentIds.forEach((documentId) => {
        const existing = nextDocumentAgentsById.get(documentId);

        if (!existing) {
          nextDocumentAgentsById.set(documentId, [agent]);
          return;
        }

        if (!existing.some((item) => item._id === config._id)) {
          existing.push(agent);
        }
      });
    });

    return {
      configDocumentCounts: nextConfigDocumentCounts,
      documentAgentsById: nextDocumentAgentsById,
    };
  }, [configs]);

  const handleRefresh = React.useCallback(() => {
    void refetchConfigs();
    void refetchDocuments();
  }, [refetchConfigs, refetchDocuments]);

  const openCreateAgent = React.useCallback(() => {
    if (!scope) {
      return;
    }

    drawer.open(CreateAgentPane, {
      props: {
        scope,
        onCreated: handleRefresh,
      },
    });
  }, [handleRefresh, scope]);

  const openEditAgent = React.useCallback(
    (configId: string) => {
      if (!scope) {
        return;
      }

      const config = configsById.get(configId);

      if (!config) {
        return;
      }

      drawer.open(CreateAgentPane, {
        props: {
          config,
          scope,
          onCreated: handleRefresh,
        },
      });
    },
    [configsById, handleRefresh, scope],
  );

  const openCreateKnowledgeBase = React.useCallback(() => {
    if (!scope) {
      return;
    }

    drawer.open(AddKnowledgeBasePane, {
      props: {
        scope,
        onCreated: handleRefresh,
      },
    });
  }, [handleRefresh, scope]);

  if (!scope) {
    return null;
  }

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-5">
        <SectionHeader
          title="Agents"
          description="Create AI assistants to help explore, answer questions, and guide actions across Lemonade."
          titleClassName="font-body-default text-xl font-medium leading-none text-white"
          controls={
            <Button aria-label="Create agent" size="sm" variant="tertiary" icon="icon-plus" onClick={openCreateAgent} />
          }
        />

        {configsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <AgentDashboardCardSkeleton key={index} />
            ))}
          </div>
        ) : configs.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {configs.map((config) => (
              <AgentDashboardCard
                key={config._id}
                id={config._id}
                avatarSrc={getConfigAvatarSrc(config)}
                count={configDocumentCounts.get(config._id) ?? 0}
                description={config.description}
                isPrivate={!config.isPublic}
                job={config.job}
                name={config.name}
                onClick={openEditAgent}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="icon-robot"
            title="No agents yet"
            description="Your AI assistants will appear here as soon as you create one."
            actionLabel="Create Agent"
            onAction={openCreateAgent}
          />
        )}
      </div>

      <div className="flex flex-col gap-5">
        <SectionHeader
          title="Knowledge Bases"
          description="Add information that agents can use to give accurate and helpful responses."
          titleClassName="font-body-default text-xl font-medium leading-none text-white"
          controls={
            <Button
              aria-label="Create knowledge base"
              size="sm"
              variant="tertiary"
              icon="icon-plus"
              onClick={openCreateKnowledgeBase}
            />
          }
        />

        {documentsLoading ? (
          <Card.Root className="divide-y divide-card-border">
            {Array.from({ length: 3 }).map((_, index) => (
              <KnowledgeBaseListRowSkeleton key={index} />
            ))}
          </Card.Root>
        ) : documents.length ? (
          <Card.Root className="divide-y divide-card-border">
            {documents.map((document) => {
              return (
                <KnowledgeBaseListRow
                  key={document._id}
                  agents={documentAgentsById.get(document._id)}
                  text={document.text}
                  title={document.title}
                  trailingIcon="icon-more-horiz"
                />
              );
            })}
          </Card.Root>
        ) : (
          <EmptyState
            icon="icon-book"
            title="No knowledge bases yet"
            description="Knowledge bases you create for your agents will show up here once they’re ready."
            actionLabel="Add Knowledge Base"
            onAction={openCreateKnowledgeBase}
          />
        )}
      </div>
    </section>
  );
}

function SectionHeader({
  title,
  description,
  controls,
  titleClassName,
}: {
  title: string;
  description?: string;
  controls?: React.ReactNode;
  titleClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className={twMerge('font-body-default text-2xl leading-8 text-primary', titleClassName)}>{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-5 text-tertiary">{description}</p> : null}
      </div>
      {controls ? <div className="flex flex-wrap items-center gap-2">{controls}</div> : null}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-4 rounded-md border border-dashed border-white/8 bg-white/5 px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white/5 text-primary/72">
        <i aria-hidden="true" className={twMerge(icon, 'size-6')} />
      </div>
      <div className="space-y-1">
        <p className="text-lg leading-6 text-primary">{title}</p>
        <p className="max-w-md text-sm leading-5 text-tertiary">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <Button size="sm" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <Card.Root>
      <Card.Content className="flex gap-6">
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-5 w-28 rounded-md" animate />
          <Skeleton className="h-7 w-3/4 rounded-lg" animate />
          <Skeleton className="h-5 w-1/2 rounded-md" animate />
          <Skeleton className="h-5 w-1/3 rounded-md" animate />
        </div>
        <Skeleton className="size-22 rounded-lg md:size-30" animate />
      </Card.Content>
    </Card.Root>
  );
}

function SimpleCardSkeleton() {
  return (
    <div className="flex min-h-46 flex-col justify-between rounded-xl border border-card-border bg-card p-4 backdrop-blur-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-lg" animate />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 rounded-lg" animate />
            <Skeleton className="h-4 w-20 rounded-full" animate />
          </div>
        </div>
        <Skeleton className="size-5 rounded-full" animate />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" animate />
        <Skeleton className="h-4 w-14 rounded-full" animate />
      </div>
    </div>
  );
}

function NonLoginContent() {
  const signIn = useSignIn();

  return (
    <div className="flex w-full flex-col gap-2 pb-10">
      <div className="overflow-hidden rounded-md outline-2 outline-card-border">
        <div
          className="flex aspect-video max-h-137 w-full flex-col justify-between p-5 md:p-16"
          style={{ background: `url(${ASSET_PREFIX}/assets/images/home-bg.png) lightgray 50% / cover no-repeat` }}
        >
          <div className="flex flex-col gap-2 md:gap-4">
            <h3 className="text-xl font-semibold md:text-6xl md:leading-18">Create your Lemonade Stand</h3>
            <p className="max-w-128 text-sm text-secondary md:text-xl md:leading-9">
              Your space for events, communities, and everything in between.
            </p>
          </div>

          <div className="flex items-end justify-between">
            <Button size="lg" onClick={() => signIn()}>
              Get Started
            </Button>
            <img src={`${ASSET_PREFIX}/assets/images/waving-hand.svg`} alt="" className="size-12 md:size-24" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 py-2 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((item, index) => (
          <Card.Root key={index}>
            <Card.Content className="flex flex-row gap-4 p-5 md:flex-col">
              <div className={twMerge('flex size-14 items-center justify-center rounded-sm', item.color)}>
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
