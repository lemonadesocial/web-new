'use client';
import clsx from 'clsx';
import Link from 'next/link';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { Avatar, Button } from '$lib/components/core';
import { useSpaceMenu } from '$lib/components/layouts/community/hooks';
import { useMe } from '$lib/hooks/useMe';
import { usePathname } from 'next/navigation';
import { userAvatar } from '$lib/utils/user';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { useAccount } from '$lib/hooks/useLens';

/**
 * NOTE: it will replace old community layout when done lemonheads community
 */
const Sidebar = ({ space }: { space: Space }) => {
  const { menu, isActive } = useSpaceMenu({ space });
  const uid = space.slug || space._id;

  const { account } = useAccount();
  const me = useMe();
  const pathname = usePathname();

  return (
    <div className="hidden lg:block fixed left-0 top-0 w-[88px] h-screen border-r z-[9] bg-[var(--color-sidebar)]">
      <div className="flex flex-col h-full justify-between divide-y">
        <div className="flex flex-1 flex-col gap-2 p-3">
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
                    className="h-[64px] md:max-h-[64px] aspect-square"
                  ></Button>
                </div>
              </Link>
            );
          })}
        </div>

        {me && (
          <div className="py-3 flex flex-col gap-2 items-center">
            <Link href={`/s/${uid}/profile`}>
              <Button
                variant={pathname === '/s/lemonheads/profile' ? 'secondary' : 'flat'}
                size="lg"
                className="max-h-[64px]! aspect-square"
              >
                <Avatar
                  className="size-8 rounded-full aspect-square"
                  src={account ? account?.metadata?.picture || getAccountAvatar(account) : userAvatar(me)}
                />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
