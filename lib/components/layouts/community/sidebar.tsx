"use client";

import Link from "next/link";
import { Button } from "../../core/button/button";
import clsx from "clsx";
import { usePathname } from "next/navigation";
const Menu = [{
  icon: 'icon-home',
  path: '',
},
{
  icon: 'icon-newsfeed',
  path: 'timeline',
  label: 'Timeline'
}, {
  icon: 'icon-explore',
  path: 'featured-hubs',
  label: 'Featured Hubs'
}];

const Sidebar = ({ uid }: { uid: string; }) => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block fixed left-0 top-[64px] w-[97px] h-screen p-4 border-r z-[9]">
      <div className="flex flex-col gap-2">
        {Menu.map((item) => {
          const isActive = item.path === ''
            ? pathname === `/s/${uid}`
            : pathname === `/s/${uid}/${item.path}`;

          return (
            <Link href={`/s/${uid}/${item.path}`} key={item.path}>
              <div className={clsx(" w-full", item?.label && "tooltip tooltip-right")}>
                {item?.label && (
                  <div className="tooltip-content">
                    <p className="text-md font-medium ">
                      {item?.label}
                    </p>
                  </div>
                )}
                <Button variant={isActive ? "secondary" : "flat"} icon={item.icon} iconSize="size-8" size="lg" className="w-full h-[64px] md:max-h-[64px]">
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
