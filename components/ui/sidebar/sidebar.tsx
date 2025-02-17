'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

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

  return (
    <div className="hidden md:flex flex-col h-full size-[96] border-r border-[--border]">
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
        'transition size-[64] flex items-center justify-center rounded-xl hover:bg-[--button-secondary-background] hover:text-[--button-secondary-forceground]',
        {
          'text-[--button-secondary-forceground] bg-[--button-secondary-background]': active,
          'text-[--secondary]': !active,
        },
      )}
    >
      <i className={twMerge('size-[32]', icon)} />
    </Link>
  );
}
