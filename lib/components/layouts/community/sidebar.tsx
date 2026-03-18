'use client';
import clsx from 'clsx';
import Link from 'next/link';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { Button } from '../../core/button/button';
import { useSpaceMenu } from './hooks';

const Sidebar = ({ space }: { space: Space }) => {
  const { menu, isActive } = useSpaceMenu({ space });
  const uid = space.slug || space._id;

  return (
    <div className="hidden lg:block w-[88px] h-screen p-3 border-r z-[9]">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          aria-label="Lemonade"
          className="text-tertiary hover:text-primary w-[64px] h-[64px] aspect-square flex items-center justify-center"
        >
          <i aria-hidden="true" className="icon-lemonade size-6" />
        </Link>

        {menu.map((item) => {
          return (
            <Link href={`/s/${uid}/${item.path}`} key={item.path} className="w-[64px] h-[64px] aspect-square">
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
                  className="w-full min-h-[64px]!"
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
