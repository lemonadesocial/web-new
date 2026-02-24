'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button, toast } from '$lib/components/core';

export const RedEnvelopesSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { icon: 'icon-home', path: '/cny', label: 'Home' },
    { icon: 'icon-stacked-email', path: '/cny/envelopes', label: 'Envelopes' },
    { icon: 'icon-trophy', path: '/cny/leaderboard', label: 'Leaderboard' },
  ];

  const isActive = (item: { path: string }) => {
    if (item.path === '/cny') {
      return pathname === '/cny';
    }
    return pathname.startsWith(item.path);
  };

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-screen p-4 border-r z-[9] bg-[#450A0A]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center h-12 cursor-pointer" onClick={() => router.push('/')}>
          <i aria-hidden="true" className="icon-lemonade-logo text-[#FDE047]" />
        </div>
        {menu.map((item) => {
          const content = (
            <div className={clsx(' w-full', item?.label && 'tooltip tooltip-right')}>
              {item?.label && (
                <div className="tooltip-content">
                  <p className="text-md font-medium ">{item?.label}</p>
                </div>
              )}
              <Button
                variant={isActive(item) ? 'secondary' : 'flat'}
                icon={item.icon}
                iconSize="size-8"
                size="lg"
                className="w-full h-[64px] md:max-h-[64px]"
              />
            </div>
          );

          if (item.path === '/cny/leaderboard') {
            return (
              <div
                key={item.path}
                onClick={() => toast.success('Coming Soon')}
                className="cursor-pointer"
              >
                {content}
              </div>
            );
          }

          return (
            <Link href={item.path} key={item.path}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};