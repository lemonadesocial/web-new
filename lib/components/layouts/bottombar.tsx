'use client';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useAccount } from '$lib/hooks/useLens';
import { useMe } from '$lib/hooks/useMe';
import { Avatar, Button, modal } from '$lib/components/core';
import { CreatingModal } from './sidebar';
import { userAvatar } from '$lib/utils/user';

export function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const me = useMe();
  const { account } = useAccount();

  const isActive = (item: { path?: string }) => pathname === item.path;

  const menu = useMemo(() => {
    const menu: Array<{ icon: string | React.ReactElement; path?: string; custom?: boolean }> = [
      { icon: 'icon-home', path: '/' },
      { icon: 'icon-newspaper', path: '/timelines' },
      {
        icon: (
          <Button
            className="rounded-full"
            icon="icon-plus"
            onClick={() =>
              modal.open(CreatingModal, {
                className: 'm-0! rounded-b-none w-full bg-[#202022]',
                position: 'bottom',
              })
            }
          />
        ),
        custom: true,
      },
      { icon: 'icon-explore', path: '/explore' },
      // { icon: 'icon-ticket', path: '/events' },
      // { icon: 'icon-community', path: '/communities' },
    ];

    if (account || me) {
      menu.push({
        icon: <Avatar src={account?.metadata?.picture || userAvatar(me)} />,
        path: `/profile/${account?.address || me?.username}`,
      });
    }

    return menu;
  }, [account, me]);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full p-4 flex justify-center">
      <div className="flex items-center gap-2 p-2 rounded-full border bg-overlay-secondary [backdrop-filter:var(--backdrop-filter)]">
        {menu.map((item, idx) => {
          if (item.custom) return <React.Fragment key={idx}>{item.icon}</React.Fragment>;

          return (
            <div
              key={item.path}
              className={clsx(
                'h-[44px] min-w-[44px] flex items-center justify-center rounded-full cursor-pointer',
                isActive(item) && 'bg-[var(--btn-secondary)]',
              )}
              onClick={() => router.push(item.path as string)}
            >
              {typeof item.icon === 'string' ? (
                <i
                  className={clsx(item.icon, isActive(item) ? 'text-[var(--btn-secondary-content)]' : 'text-secondary')}
                />
              ) : (
                item.icon
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
