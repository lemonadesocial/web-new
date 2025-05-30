"use client";
import clsx from "clsx";
import Link from "next/link";

import { Space } from "$lib/graphql/generated/backend/graphql";
import { Button } from "../../core/button/button";
import { useSpaceMenu } from "./hooks";

const Sidebar = ({ space }: { space: Space; }) => {
  const { menu, isActive } = useSpaceMenu({ space });
  const uid = space.slug || space._id;

  return (
    <div className="hidden lg:block fixed left-0 top-[64px] w-[97px] h-screen p-4 border-r z-[9]">
      <div className="flex flex-col gap-2">
        {menu.map((item) => {
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
                <Button variant={isActive(item) ? "secondary" : "flat"} icon={item.icon} iconSize="size-8" size="lg" className="w-full h-[64px] md:max-h-[64px]">
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
