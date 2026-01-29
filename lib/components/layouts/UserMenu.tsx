'use client';
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

import { useMe } from '$lib/hooks/useMe';
import { useLogOut } from '$lib/hooks/useLogout';
import { Divider, Menu, MenuItem, Avatar, drawer } from '$lib/components/core';
import { userAvatar } from '$lib/utils/user';
import { ProfilePane } from '../features/pane';

export const UserMenu = () => {
  const me = useMe();
  const logOut = useLogOut();
  const router = useRouter();

  if (!me) return null;

  return (
    <Menu.Root>
      <Menu.Trigger>
        <div className="transition flex justify-center items-center rounded-full">
          <Avatar size="lg" src={userAvatar(me)} />
        </div>
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
              <MenuItem title="Edit Profile" onClick={() => drawer.open(ProfilePane, { dismissible: false })} />
              <MenuItem title="Settings" onClick={() => router.push('/settings')} />
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
  );
};