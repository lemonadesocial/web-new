'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { toast } from '$lib/components/core';

const menu = [
  { icon: 'icon-home', path: '/cny', label: 'Home' },
  { icon: 'icon-stacked-email', path: '/cny/envelopes', label: 'Envelopes' },
  { icon: 'icon-trophy', path: '/cny/leaderboard', label: 'Leaderboard' },
];

export function RedEnvelopesBottomBar() {
  const pathname = usePathname();

  const isActive = (item: (typeof menu)[number]) => {
    if (item.path === '/cny') {
      return pathname === '/cny';
    }
    return pathname.startsWith(item.path);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-[#5c1515] z-[9] bg-[#450A0A]">
      <div className="flex w-full gap-4 px-6 py-3">
        {menu.map((item) => {
          const content = (
            <div
              className={clsx(
                'flex-1 flex items-center justify-center rounded-full size-12',
                isActive(item) && 'bg-[var(--btn-secondary)]',
              )}
            >
              <i
                className={clsx(
                  item.icon,
                  'size-8',
                  isActive(item) ? 'text-[var(--btn-secondary-content)]' : 'text-primary',
                )}
              />
            </div>
          );

          if (item.path === '/cny/leaderboard') {
            return (
              <div
                key={item.path}
                className="flex-1 cursor-pointer flex justify-center"
                onClick={() => toast.success('Coming Soon')}
              >
                {content}
              </div>
            );
          }

          return (
            <Link href={item.path} key={item.path} className="flex-1 flex justify-center">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
