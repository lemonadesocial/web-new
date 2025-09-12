'use client';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

import { Spacer } from '$lib/components/core';
import { usePathname } from 'next/navigation';
import { mint } from '@lens-protocol/metadata';
import { useLemonhead } from '$lib/hooks/useLemonhead';

const tabs = [
  { label: 'NewsFeed', path: '/lemonheads-zone' },
  { label: 'Events', path: '/lemonheads-zone/events' },
  { label: 'Proposals', path: '/lemonheads-zone/proposals' },
  { label: 'Treasury', path: '/lemonheads-zone/treasury' },
];

export default function Layout(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useLemonhead();
  const totalMint = Number(data?.totalMinted) || 0;

  return (
    <>
      <div className="flex flex-col gap-2 pt-6 pb-2">
        <h3 className="text-2xl md:text-3xl font-semibold">LemonHeads Zone</h3>
        <p className="max-sm:text-sm text-tertiary">
          Exclusive space — connect, create and collaborate with LemonHeads.
        </p>
      </div>

      <div className="pt-8 pb-5">
        <div className="flex items-center relative">
          <div className="h-2 w-full rounded-s-full rounded-e-full bg-quaternary absolute" />
          <motion.div
            className="h-2 bg-warning-400 rounded-s-full"
            transition={{ duration: 1 }}
            animate={{ width: `calc(${(totalMint * 100) / 10000}% - 50px)` }}
          />

          <div className="">
            <div className="size-6 border-8 aspect-square rounded-full  border-warning-400"></div>
          </div>

          <div
            className={clsx(
              'size-8 aspect-square rounded-full flex items-center justify-center absolute left-[45%]',
              totalMint >= 5000
                ? 'bg-primary text-primary-invert'
                : 'bg-(--btn-tertiary) backdrop-blur-sm  text-(--btn-tertiary-content)',
            )}
          >
            <i className="icon-account-balance-outline size-4" />
          </div>

          <div
            className={clsx(
              'size-8 aspect-square rounded-full flex items-center justify-center absolute right-5',
              totalMint < 10000
                ? 'bg-(--btn-tertiary) backdrop-blur-sm text-(--btn-tertiary-content)'
                : 'bg-primary text-primary-invert',
            )}
          >
            <i className="icon-celebration size-4" />
          </div>
        </div>
      </div>
      <Spacer className="h-2" />

      <div className="pt-2 md:px-0 sticky top-0 bg-background/80 backdrop-blur-md z-10">
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

      <div className="w-full max-w-[1080px] mx-auto pt-6">{props.children}</div>
    </>
  );
}
