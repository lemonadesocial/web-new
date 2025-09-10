'use client';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import Header from '$lib/components/layouts/header';
import { Spacer } from '$lib/components/core';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'NewsFeed', path: '/lemonheads-zone' },
  { label: 'Events', path: '/lemonheads-zone/events' },
  { label: 'Proposals', path: '/lemonheads-zone/proposals' },
  { label: 'Treasury', path: '/lemonheads-zone/treasury' },
];

export default function Layout(props: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="flex flex-col min-h-dvh w-full no-scrollbar">
      <Header />

      <div className="w-full px-4 md:px-0 max-w-[1080px] mx-auto">
        <div className="flex flex-col gap-2 pt-6 pb-2">
          <h3 className="text-3xl font-semibold">LemonHeads Zone</h3>
          <p className="text-tertiary">Exclusive space — connect, create and collaborate with LemonHeads.</p>
        </div>
      </div>

      <Spacer className="h-6" />

      <div className="px-4 pt-2 md:px-0 sticky top-0 bg-background/80 drop-shadow-md z-[1000]">
        <div className="border-b">
          <div className="w-full max-w-[1080px] mx-auto">
            <ul className="inline-flex gap-4">
              {tabs.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.path}>
                    <p
                      className={twMerge(
                        'pb-2.5 text-tertiary hover:text-primary',
                        clsx(item.path === pathname && 'border-b-2 border-primary'),
                      )}
                    >
                      {item.label}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1080px] mx-auto pt-6 px-4 md:px-0">{props.children}</div>
    </main>
  );
}
