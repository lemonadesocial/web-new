'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '$lib/components/core';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import UserProfileEvents from './UserProfileEvents';
import { UserProfilePost } from './UserProfilePost';
import Component from 'video.js/dist/types/component';
import { User } from '$lib/graphql/generated/backend/graphql';

const pageTabsData = [
  { label: 'Feed', path: 'feed', icon: 'icon-newspaper' },
  { label: 'Events', path: 'events', icon: 'icon-ticket' },
  { label: 'Communities', path: 'communities', icon: 'icon-community' },
];

export function UserProfilePageTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const base = pathname.split('/profile')[0] + '/profile';
  const active = pageTabsData.findIndex((tab) => pathname.startsWith(`${base}/${tab.path}`));

  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-auto no-scrollbar pb-4 pt-2 md:pt-0">
        {pageTabsData.map((tab, i) => (
          <Button
            key={i}
            icon={tab.icon}
            variant={active === i ? 'secondary' : 'tertiary'}
            outlined
            onClick={() => router.push(`${base}/${tab.path}`)}
          />
        ))}
      </div>
    </div>
  );
}

const tabData = [
  { label: 'Post', key: 'feed', component: UserProfilePost },
  { label: 'Events', key: 'events', component: UserProfileEvents, requiredLemonadeUser: true },
  { label: 'Communities', key: 'communities', component: UserProfileEvents, requiredLemonadeUser: true },
];

export function UserProfileTabs({
  user,
  address,
  containerClass,
  contentClass,
}: {
  user: User;
  address?: string;
  containerClass?: string;
  contentClass?: string;
}) {
  const [active, setActive] = React.useState('feed');
  const Comp = tabData.find((t) => t.key === active)?.component || React.Fragment;
  return (
    <>
      <div
        className={twMerge(
          'w-full flex gap-4 overflow-auto no-scrollbar border-b-(length:--card-border-width) border-(--color-divider) pt-3',
          containerClass,
        )}
      >
        {tabData.map((tab, i) => {
          if (tab.requiredLemonadeUser && !user?._id) return null;
          return (
            <div
              className={clsx(
                'text-tertiary hover:text-primary cursor-pointer pb-2.5 border-b-2',
                active === tab.key ? 'text-primary! border-(--color-primary)' : 'border-b-transparent',
              )}
              key={i}
              onClick={() => setActive(tab.key)}
            >
              <p>{tab.label}</p>
            </div>
          );
        })}
      </div>

      <div className={contentClass}>
        <Comp address={address} user={user} />
      </div>
    </>
  );
}
