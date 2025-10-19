'use client';
import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

import { Skeleton } from '$lib/components/core';

const tabs = [
  { label: 'Display', path: 'display' },
  { label: 'Team', path: 'team' },
  { label: 'Tags', path: 'tags' },
  { label: 'Advanced', path: 'advanced' },
  { label: 'Embed', path: 'embed' },
  { label: 'Send Limit', path: 'send-limit' },
  { label: 'Lemonade Pro', path: 'lemonade-pro' },
];

function SettingsCommunityLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const { uid } = useParams<{ uid: string }>();

  return (
    <>
      <div className="bg-card sticky top-28 z-50 backdrop-blur-sm">
        <nav className="page flex gap-4 px-4 md:px-0 pt-2 mx-auto overflow-auto no-scrollbar">
          {tabs.map((item) => {
            const url =
              item.path === 'display' ? `/s/manage/${uid}/settings` : `/s/manage/${uid}/settings/${item.path}`;
            const isActive =
              item.path === 'display' ? pathname === `/s/manage/${uid}/settings` || pathname === url : pathname === url;

            return (
              <Link
                href={url}
                key={item.path}
                className={clsx('min-w-fit', isActive && 'border-b-2 border-b-primary', 'pb-2.5')}
              >
                <span className={clsx(isActive ? 'text-primary' : 'text-tertiary', 'font-medium')}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </>
  );
}

export default SettingsCommunityLayout;
