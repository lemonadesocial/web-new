'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useClient } from '$lib/request';

const MENU = [
  [
    {
      icon: 'icon-home',
      path: '/',
    },
    {
      icon: 'icon-newsfeed',
      path: '/new-feed',
    },
    {
      icon: 'icon-explore',
      path: '/explore',
    },
    {
      icon: 'icon-leaderboard',
      path: '/leaderboard',
    },
  ],
  [
    {
      icon: 'icon-community',
      path: '/communities',
    },
    {
      icon: 'icon-collectible',
      path: '/collectibles',
    },
    {
      icon: 'icon-bell',
      path: '/notifications',
    },
  ],
  [
    {
      icon: 'icon-insights',
      path: '/insights',
    },
    {
      icon: 'icon-settings',
      path: '/settings',
    },
  ],
];

export default function Sidebar() {
  const pathname = usePathname();

  const { client } = useClient();
  console.log(client);

  return (
    <div className="hidden md:flex flex-col h-full min-w-[96] max-w-[96] border-r border-[--border]">
      <div className="flex flex-col justify-center items-center gap-[16] py-[16] border-b border-[--border]">
        {MENU[0].map((item) => (
          <MenuItem key={item.path} path={item.path} icon={item.icon} active={pathname === item.path} />
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-between items-center py-[16]">
        <div className="flex flex-col gap-[16]">
          {MENU[1].map((item) => (
            <MenuItem key={item.path} path={item.path} icon={item.icon} active={pathname === item.path} />
          ))}
        </div>
        <div className="flex flex-col gap-[16]">
          {MENU[2].map((item) => (
            <MenuItem key={item.path} path={item.path} icon={item.icon} active={pathname === item.path} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ path, icon, active }: { path: string; icon: string; active?: boolean }) {
  return (
    <Link
      href={path}
      className={clsx(
        'transition size-[64] flex items-center justify-center rounded-md hover:bg-tertiary/[.08] hover:text-tertiary',
        {
          'text-black bg-tertiary': active,
          'text-tertiary/[.56]': !active,
        },
      )}
    >
      <i className={twMerge('size-[32]', icon)} />
    </Link>
  );
}
