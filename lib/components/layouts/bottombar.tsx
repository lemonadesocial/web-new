'use client';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useMemo } from 'react';

import { useAccount } from '$lib/hooks/useLens';
import { useMe } from '$lib/hooks/useMe';
import { Button, modal } from '$lib/components/core';
import { CreatingModal } from './sidebar';

export function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const me = useMe();
  const { account } = useAccount();

  const isActive = (item: { path?: string }) => pathname === item.path;

  const menu = useMemo(() => {
    const menu: Array<{ icon: string | React.ReactElement; path?: string; custom?: boolean }> = [
      { icon: 'icon-home', path: '/' },
      { icon: 'icon-explore', path: '/explore' },
      {
        icon: (
          <Button
            className="rounded-full"
            icon="icon-plus"
            onClick={() =>
              modal.open(CreatingModal, { dismissible: false, className: 'm-0!  w-full', position: 'bottom' })
            }
          />
        ),
        custom: true,
      },
      { icon: 'icon-ticket', path: '/events' },
      { icon: 'icon-community', path: '/communities' },
    ];

    return menu;
  }, [account, me]);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full p-4 flex justify-center">
      <div className="flex items-center gap-2 p-2 rounded-full border bg-overlay-secondary [backdrop-filter:var(--backdrop-filter)]">
        {menu.map((item) => {
          if (item.custom) return item.icon;

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
