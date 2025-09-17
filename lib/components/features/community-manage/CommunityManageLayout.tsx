'use client';

import NextLink from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import { useEffect, useState, useRef } from 'react';

import { Event, PublishEventDocument, GetEventDocument, GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { Button, drawer, toast, Skeleton } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { hosting } from '$lib/utils/event';
import { isObjectId } from '$lib/utils/helpers';
import Header from '$lib/components/layouts/header';
import { communityAvatar } from '$lib/utils/community';

const menu = [
  { name: 'Overview', page: 'overview' },
  { name: 'Events', page: 'events' },
  { name: 'Vaults', page: 'vaults' },
];

export function CommunityManageLayout({ children }: React.PropsWithChildren) {
  const { uid } = useParams<{ uid: string }>();
  const pathname = usePathname();

  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data, loading } = useQuery(GetSpaceDocument, { variables });

  if (loading) {
    return (
      <div className="font-default">
        <div className="sticky top-0 backdrop-blur-md transition-all duration-300 z-1 pt-7">
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
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i className="icon-alert-outline size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Event Not Found</h1>
            <p className="text-secondary">The event you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button variant="tertiary" onClick={() => (window.location.href = '/')} iconLeft="icon-home">
            Go Home
          </Button>
        </div>
      </div>
    );
  }


  // if (!isHost) {
  //   return (
  //     <div className="page mx-auto py-7 px-4 md:px-0 font-default">
  //       <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
  //         <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
  //           <i className="icon-lock size-8 text-warning-500" />
  //         </div>
  //         <div className="space-y-2">
  //           <h1 className="text-2xl font-semibold">No Access</h1>
  //           <p className="text-secondary">You don't have access to manage this event.</p>
  //         </div>
  //         <Button
  //           variant="tertiary"
  //           onClick={() => (window.location.href = `/e/${shortid}`)}
  //           iconRight="icon-chevron-right"
  //         >
  //           Event Page
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  const space = data.getSpace as Space;

  return (
    <div>
      <Header />
      <div className="page mx-auto px-4 md:px-0 pt-6">

        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <img src={communityAvatar(space)} className="size-7 rounded-xs border-card-border" />
            <h1 className="font-semibold text-2xl">{space.title}</h1>
          </div>
          <Button
              iconRight="icon-arrow-outward"
              variant="tertiary-alt"
              size="sm"
              className="hidden md:block"
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
            const url = `/e/manage/${uid}/${item.page}`;
            const isActive =
              item.page === 'overview' ? pathname === `/s/manage/${uid}` || pathname === url : pathname === url;

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
      <hr className="w-screen -mx-[50vw] ml-[calc(-50vw+50%)] border-t border-t-divider" />
      <div className="page mx-auto py-7 px-4 md:px-0">{children}</div>
    </div>
  );
}
