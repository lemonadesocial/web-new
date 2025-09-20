'use client';
import clsx from 'clsx';
import Link from 'next/link';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { Button } from '$lib/components/core';
import { useSpaceMenu } from '$lib/components/layouts/community/hooks';

/**
 * NOTE: it will replace old community layout when done lemonheads community
 */
const Sidebar = ({ space }: { space: Space }) => {
  const { menu, isActive } = useSpaceMenu({ space });
  const uid = space.slug || space._id;

  return (
    <div className="hidden lg:block fixed left-0 top-0 w-[97px] h-screen p-3 border-r z-[9] bg-[var(--color-sidebar)]">
      <div className="flex flex-col gap-2">
        <div className="tooltip tooltip-right">
          <div className="tooltip-content">
            <p className="text-md font-medium ">Lemonade</p>
          </div>
          <Link href="/" className="flex items-center justify-center px-5 py-3">
            <i className="icon-lemonade size-6 aspect-square" />
          </Link>
        </div>

        {menu.map((item) => {
          return (
            <Link href={`/s/${uid}/${item.path}`} key={item.path}>
              <div className={clsx('w-full', item?.label && 'tooltip tooltip-right')}>
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
                ></Button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
