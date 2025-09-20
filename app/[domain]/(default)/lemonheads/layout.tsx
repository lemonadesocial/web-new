'use client';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Spacer } from '$lib/components/core';
import { usePathname } from 'next/navigation';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { LemonHeadsProgressBar } from '$lib/components/features/lemonheads/LemonHeadsProgressBar';

const tabs = [
  { label: 'NewsFeed', path: '/lemonheads' },
  { label: 'Events', path: '/lemonheads/events' },
  { label: 'Proposals', path: '/lemonheads/proposals' },
  { label: 'Treasury', path: '/lemonheads/treasury' },
  { label: 'Leaderboard', path: '/lemonheads/leaderboard' },
];

export default function Layout(props: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col gap-2 pt-6 pb-2">
        <h3 className="text-2xl md:text-3xl font-semibold">LemonHeads Zone</h3>
        <p className="max-sm:text-sm text-tertiary">
          Exclusive space — connect, create and collaborate with LemonHeads.
        </p>
      </div>

      <div className="pt-8 pb-5">
        <LemonHeadsProgressBar />
      </div>
      <Spacer className="h-2" />

      <div className="pt-2 md:px-0 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="border-b">
          <div className="w-full max-w-[1080px] mx-auto">
            <ul className="inline-flex gap-4 overflow-x-auto w-full no-scrollbar">
              {tabs.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.path}>
                    <p
                      className={twMerge(
                        'pb-2.5 text-tertiary hover:text-primary',
                        clsx(item.path === pathname && 'border-b-2 border-primary text-primary'),
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

      <div className="w-full max-w-[1080px] mx-auto pt-6">{props.children}</div>
    </>
  );
}
