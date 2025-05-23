'use client';
import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAtom } from 'jotai';

import { sessionAtom } from '$lib/jotai';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { useMe } from '$lib/hooks/useMe';
import { useLogOut } from '$lib/hooks/useLogout';
import { Divider, Menu, MenuItem, Button, Avatar } from '$lib/components/core';
import { userAvatar } from '$lib/utils/user';

import { useSignIn } from '$lib/hooks/useSignIn';

export default function Header({ title }: { title?: string; }) {
  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const logOut = useLogOut();
  const signIn = useSignIn();

  return (
    <div className="py-3 px-4 min-h-[56px] flex justify-between items-center z-10">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="Lemonade" className="text-tertiary hover:text-primary">
          <i className="icon-lemonade size-[20]" />
        </Link>
        {title && <h1 className="text-md text-tertiary font-medium">{title}</h1>}
      </div>

      <div>
        {session && me ? (
          <Menu.Root>
            <Menu.Trigger>
              {({ isOpen }) => (
                <div
                  className={twMerge(
                    'transition p-2 flex justify-center items-center rounded-full hover:bg-primary/8',
                    clsx(isOpen && 'bg-primary/8'),
                  )}
                >
                  <Avatar src={userAvatar(me)} />
                </div>
              )}
            </Menu.Trigger>
            <Menu.Content className="p-0 min-w-[228px]">
              {({ toggle }) => (
                <>
                  <div
                    className={'flex gap-2.5 px-2 py-1.5 items-center hover:bg-primary/8 rounded-t-xs cursor-pointer'}
                  >
                    <Avatar size="lg" src={userAvatar(me)} />
                    <div>
                      <p className="text-md font-medium whitespace-nowrap">{me.name}</p>
                      <p className="text-xs font-medium text-tertiary">{me.email}</p>
                    </div>
                  </div>
                  <Divider />
                  <div className="p-1">
                    <MenuItem
                      title="View Profile"
                      onClick={() => window.open(`${LEMONADE_DOMAIN}/u/${me.username}`, '_blank')}
                    />
                    <MenuItem title="Settings" onClick={() => window.open(`${LEMONADE_DOMAIN}/settings`, '_blank')} />
                    <MenuItem
                      title="Sign Out"
                      onClick={async () => {
                        toggle();
                        logOut();
                      }}
                    />
                  </div>
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        ) : (
          <>
            {!session && (
              <Button size="sm" variant="tertiary-alt" onClick={signIn} className="rounded-full backdrop-blur-none">
                Sign In
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
