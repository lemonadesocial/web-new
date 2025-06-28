"use client";
import clsx from "clsx";
import Link from "next/link";

import { Button } from "$lib/components/core/button/button";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  
  const menu = useMemo(() => {
    const menu = [
      {
        icon: 'icon-home',
        path: '/',
        label: 'Home',
      },
      { icon: 'icon-explore', path: '/explore', label: 'Explore' },
      { icon: 'icon-swipe', path: '/swipe', label: 'Swipe & Match' },
      { icon: 'icon-trophy', path: '/leaderboard', label: 'Leaderboard' },
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
        {menu.map((item) => {
          return (
            <Link href={item.path} key={item.path}>
              <div className={clsx(" w-full", item?.label && "tooltip tooltip-right")}>
                {item?.label && (
                  <div className="tooltip-content">
                    <p className="text-md font-medium ">
                      {item?.label}
                    </p>
                  </div>
                )}
                <Button variant={isActive(item) ? "secondary" : "flat"} icon={item.icon} iconSize="size-8" size="lg" className="w-16 h-16 md:max-h-16">
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
      <hr className="border-t border" />
    </div>
  );
};

export default Sidebar;
