'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '$lib/components/core';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { User } from '$lib/graphql/generated/backend/graphql';

import UserProfileEvents from './UserProfileEvents';
import { UserProfilePost } from './UserProfilePost';
import { UserProfileCommunities } from './UserProfileCommunities';
import { isAddress } from 'ethers';

const tabData = [
  { label: 'Post', key: 'feed', component: UserProfilePost },
  { label: 'Events', key: 'events', component: UserProfileEvents, requiredLemonadeUser: true },
  { label: 'Communities', key: 'communities', component: UserProfileCommunities, requiredLemonadeUser: true },
];

export function UserProfileTabs({
  user,
  address,
  containerClass,
  contentClass,
  sticky = false,
}: {
  user: User;
  address?: string;
  containerClass?: string;
  contentClass?: string;
  sticky?: boolean;
}) {
  const [active, setActive] = React.useState(isAddress(address) ? 'feed' : 'events');
  const Comp = tabData.find((t) => t.key === active)?.component || React.Fragment;

  return (
    <>
      <div
        className={twMerge(
          'w-full flex gap-4 overflow-auto no-scrollbar border-b-(length:--card-border-width) border-(--color-divider) pt-3 backdrop-blur-sm',
          containerClass,
          sticky && 'sticky top-0 z-50 bg-page-background-overlay',
        )}
      >
        {tabData.map((tab, i) => {
          if (tab.key === 'feed' && !isAddress(address)) return null;
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
