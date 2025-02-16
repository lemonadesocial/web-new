'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const MENU = [
  [
    {
      icon: 'icon-home size-[32]',
      path: '/',
    },
  ],
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full size-[96] border-r border-[--border]">
      <div className="flex justify-center gap-16 py-[16]">
        {MENU[0].map((item) => (
          <MenuItem key={item.path} path={item.path} icon={item.icon} active={pathname === item.path} />
        ))}
      </div>
    </div>
  );
}

function MenuItem({ path, icon, active }: { path: string; icon: string; active?: boolean }) {
  return (
    <Link
      href={path}
      className={clsx('size-[64] flex items-center justify-center', {
        'text-[--button-secondary-forceground] bg-[--button-secondary-background]': active,
        'text-[--secondary]': !active,
      })}
    >
      <i className={icon} />
    </Link>
  );
}
