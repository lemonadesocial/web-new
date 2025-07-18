'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useMe } from '$lib/hooks/useMe';
import { useAccount } from '$lib/hooks/useLens';
import { userAvatar } from '$lib/utils/user';
import { Avatar } from '../core';

type SidebarItemProps = {
  item: {
    icon: React.ReactNode;
    path: string;
    label: string;
  };
  isActive: (item: { path: string }) => boolean;
};

const SidebarItem = ({ item, isActive }: SidebarItemProps) => {
  return (
    <Link href={item.path} key={item.path}>
      <div className={clsx(' w-full', item?.label && 'tooltip tooltip-right')}>
        {item?.label && (
          <div className="tooltip-content">
            <p className="text-md font-medium ">{item?.label}</p>
          </div>
        )}
        <div
          className={clsx(
            'size-16 flex items-center justify-center rounded-md',
            isActive(item) && 'bg-[var(--btn-secondary)]',
          )}
        >
          {typeof item.icon === 'string' ? (
            <i className={clsx(item.icon, isActive(item) ? 'text-[var(--btn-secondary-content)]' : 'text-tertiary')} />
          ) : (
            item.icon
          )}
        </div>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const me = useMe();
  const { account } = useAccount();

  const mainMenu = useMemo(() => {
    const menu = [
      {
        icon: 'icon-home',
        path: '/',
        label: 'Home',
      },
      { icon: 'icon-explore', path: '/explore', label: 'Explore' },
      // { icon: 'icon-swipe', path: '/swipe', label: 'Swipe & Match' },  // FIXME: add back when lemonheads  are live
      { icon: 'icon-trophy', path: '/leaderboard', label: 'Leaderboard' },
    ];

    return menu;
  }, []);

  const secondaryMenu = useMemo(() => {
    const menu = [
      { icon: 'icon-ticket', path: '/events', label: 'Events' },
      { icon: 'icon-community', path: '/communities', label: 'Communities' },
    ];

    return menu;
  }, []);

  const isActive = (item: { path: string }) => pathname === item.path;

  return (
    <div className="hidden lg:block fixed left-0 h-screen border-r z-10">
      <div className="flex flex-col h-full divide-y divide-(--color-divider)">
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center justify-center h-12 cursor-pointer" onClick={() => router.push('/')}>
            <i className="icon-lemonade-logo text-[#FDE047]" />
          </div>
          {mainMenu.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={isActive} />
          ))}
        </div>
        <div className="flex flex-col gap-2 p-3 flex-1">
          <div className="flex flex-col flex-1">
            {(me || account) && (
              <>
                <SidebarItem
                  item={{
                    icon: <Avatar src={account?.metadata?.picture || userAvatar(me)} />,
                    path: '/profile',
                    label: 'Profile',
                  }}
                  isActive={isActive}
                />
              </>
            )}

            {secondaryMenu.map((item) => (
              <SidebarItem key={item.path} item={item} isActive={isActive} />
            ))}
          </div>

          {(me || account) && (
            <SidebarItem item={{ icon: 'icon-gears', label: 'Settings', path: '/settings' }} isActive={isActive} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
