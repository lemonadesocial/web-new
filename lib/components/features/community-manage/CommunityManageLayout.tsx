'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import clsx from 'clsx';

import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { Button, Skeleton } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { isObjectId } from '$lib/utils/helpers';
import Header from '$lib/components/layouts/header';
import { communityAvatar } from '$lib/utils/community';
import { useRequireLemonadeAccount } from '$lib/hooks/useRequireLemonadeAccount';
import { CommunityManageSpaceProvider } from './CommunityManageSpaceContext';

const menu = [
  { name: 'Overview', page: 'overview' },
  { name: 'Events', page: 'events' },
  { name: 'Submissions', page: 'submissions' },
  { name: 'People', page: 'people' },
  { name: 'Agents', page: 'agents' },
  { name: 'Newsletters', page: 'newsletters' },
  { name: 'Payments', page: 'payments' },
  { name: 'Connectors', page: 'connectors' },
  { name: 'Launchpad', page: 'launchpad' },
  { name: 'Insights', page: 'insights' },
  { name: 'Settings', page: 'settings' },
];

type Props = React.PropsWithChildren<{
  embedded?: boolean;
  onSpaceResolved?: (space: Space) => void;
}>;

function CommunityHeader({
  children,
  embedded,
  pathname,
  space,
  uid,
}: React.PropsWithChildren<{
  embedded?: boolean;
  pathname: string | null;
  space: Space;
  uid: string;
}>) {
  return (
    <>
      <div className="pt-6 sticky top-0 bg-page-background backdrop-blur-3xl z-2 border-b">
        <div className={clsx('page mx-auto min-w-0', embedded ? 'px-4 md:px-6' : 'px-4 md:px-0')}>
          <div className="flex justify-between items-center gap-3 min-w-0">
            <div className="flex gap-3 items-center min-w-0">
              <img src={communityAvatar(space)} className="size-7 shrink-0 rounded-xs border-card-border" />
              <h1 className="font-semibold text-2xl truncate">{space.title}</h1>
            </div>
            <Button
              iconRight="icon-arrow-outward"
              variant="tertiary-alt"
              size="sm"
              className="hidden shrink-0 md:block"
              onClick={() => window.open(`/s/${uid}`, '_blank')}
            >
              Community Page
            </Button>
            <Button
              icon="icon-arrow-outward"
              className="md:hidden"
              variant="tertiary-alt"
              size="sm"
              onClick={() => window.open(`/s/${uid}`, '_blank')}
            />
          </div>
          <nav className="flex gap-4 pt-3 overflow-auto no-scrollbar">
            {menu.map((item) => {
              const url = item.page === 'overview' ? `/s/manage/${uid}` : `/s/manage/${uid}/${item.page}`;
              const isActive =
                item.page === 'overview' ? pathname === `/s/manage/${uid}` || pathname === url : pathname?.includes(url);

              return (
                <NextLink
                  href={url}
                  key={item.page}
                  className={clsx(isActive && 'border-b-2 border-b-primary', 'pb-2.5')}
                >
                  <span className={clsx(isActive ? 'text-primary' : 'text-tertiary', 'font-medium')}>{item.name}</span>
                </NextLink>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </>
  );
}

export function CommunityManageLayout({ children, embedded = false, onSpaceResolved }: Props) {
  const { isAuthenticated, me } = useRequireLemonadeAccount();

  const { uid, domain } = useParams<{ uid: string; domain: string }>();
  const pathname = usePathname();
  const hostname = domain ? decodeURIComponent(domain) : '';

  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data, loading } = useQuery(GetSpaceDocument, { variables });
  const space = data?.getSpace as Space | undefined;

  React.useEffect(() => {
    if (!space) return;
    onSpaceResolved?.(space);
  }, [onSpaceResolved, space]);

  if (!isAuthenticated || !me) return null;

  if (loading) {
    return (
      <div className="font-default">
        <div className="sticky top-0 backdrop-blur-md transition-all duration-300 z-2 pt-7">
          <div className="page mx-auto px-4 md:px-0">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
            <nav className="flex gap-4 pt-1 overflow-auto no-scrollbar">
              {menu.map((item) => (
                <Skeleton key={item.page} className="h-6 w-20" />
              ))}
            </nav>
          </div>
        </div>
        <div className="page mx-auto py-7 px-4 md:px-0">
          <div className="space-y-6">
            <div className="flex gap-2 overflow-auto no-scrollbar">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-32 rounded-md" />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-md" />
              <Skeleton className="h-80 rounded-md" />
            </div>

            <Skeleton className="h-32 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.getSpace) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 font-default">
        <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i aria-hidden="true" className="icon-alert-outline size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Community Not Found</h1>
            <p className="text-secondary">The community you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button variant="tertiary" onClick={() => (window.location.href = '/')} iconLeft="icon-home">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const resolvedSpace = space as Space;
  const spaceAdmins = resolvedSpace.admins?.map((u) => u._id) || [];
  const canManage = me?._id && [resolvedSpace.creator, ...spaceAdmins].includes(me._id);

  if (!canManage) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 font-default">
        <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i aria-hidden="true" className="icon-lock size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">No Access</h1>
            <p className="text-secondary">You don't have access to manage this community.</p>
          </div>
          <Button
            variant="tertiary"
            onClick={() => (window.location.href = `/s/${resolvedSpace.slug || resolvedSpace._id}`)}
            iconRight="icon-chevron-right"
          >
            Community Page
          </Button>
        </div>
      </div>
    );
  }

  const content = (
    <CommunityManageSpaceProvider space={resolvedSpace} hostname={hostname}>
      <CommunityHeader embedded={embedded} pathname={pathname} space={resolvedSpace} uid={uid}>
        {children}
      </CommunityHeader>
    </CommunityManageSpaceProvider>
  );

  if (embedded) {
    return <div className="flex flex-col h-full overflow-auto">{content}</div>;
  }

  return (
    <main className="flex flex-col h-dvh overflow-auto">
      <Header />
      {content}
    </main>
  );
}
