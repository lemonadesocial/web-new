'use client';
import clsx from 'clsx';
import Link from 'next/link';

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useMe } from "$lib/hooks/useMe";
import { useAccount } from "$lib/hooks/useLens";
import { Avatar } from "../core";
import { userAvatar } from "$lib/utils/user";

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
        <div className={clsx("size-16 flex items-center justify-center rounded-md", isActive(item) && "bg-[var(--btn-secondary)]")}>
          {
            typeof item.icon === 'string' ? (
              <i className={clsx(item.icon, isActive(item) ? 'text-[var(--btn-secondary-content)]' : 'text-tertiary')} />
            ) : (
              item.icon
            )
          }
        </div>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
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
      { icon: 'icon-swipe', path: '/swipe', label: 'Swipe & Match' },
      { icon: 'icon-trophy', path: '/leaderboard', label: 'Leaderboard' },
    ];

    return menu;
  }, [pathname]);

  const secondaryMenu = useMemo(() => {
    const menu = [
      { icon: 'icon-ticket', path: '/events', label: 'Events' },
      { icon: 'icon-community', path: '/communities', label: 'Communities' },
    ];

    return menu;
  }, [pathname]);

  const isActive = (item: { path: string }) => pathname === item.path;

  return (
    <div className="hidden lg:block fixed left-0 h-screen border-r z-[9]">
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-center h-12">
          <i className="icon-lemonade-logo text-[#FDE047]" />
        </div>
        {mainMenu.map((item) => (
          <SidebarItem key={item.path} item={item} isActive={isActive} />
        ))}
      </div>
      <hr className="border-t border" />
      <div className="flex flex-col gap-2 p-3">
        {
          (me || account) && (
            <>
              <SidebarItem
                item={{ icon: <Avatar src={account?.metadata?.picture || userAvatar(me)} />, path: '/profile', label: 'Profile' }}
                isActive={isActive}
              />
            </>
          )
        }
        {secondaryMenu.map((item) => (
          <SidebarItem key={item.path} item={item} isActive={isActive} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
