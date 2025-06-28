'use client';
import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAtom } from 'jotai';
import NextLink from 'next/link';

import { sessionAtom } from '$lib/jotai';
import { IDENTITY_URL, LEMONADE_DOMAIN } from '$lib/utils/constants';
import { useMe } from '$lib/hooks/useMe';
import { useLogOut } from '$lib/hooks/useLogout';
import { Divider, Menu, MenuItem, Button, Avatar, drawer } from '$lib/components/core';
import { userAvatar } from '$lib/utils/user';

import { useSignIn } from '$lib/hooks/useSignIn';
import { usePathname } from 'next/navigation';
import { ProfilePane } from '../features/pane';
import { useAccount } from '$lib/hooks/useLens';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { useLemonhead } from '$lib/hooks/useLemonhead';

type Props = {
  title?: string;
  mainMenu?: () => ReactElement;
  hideLogo?: boolean;
};

const menu = [
  { text: 'Home', path: '/', icon: 'icon-home' },
  { text: 'Events', path: '/events', icon: 'icon-ticket' },
  { text: 'Communities', path: '/communities', icon: 'icon-community' },
  { text: 'Explore', path: '/explore', icon: 'icon-explore' },
];

export function RootMenu() {
  const pathName = usePathname();

  return (
    <nav className="flex md:flex-3_1_auto w-[1080px]">
      <ul className="flex flex-1 gap-5">
        {menu.map((item, idx) => (
          <li key={idx} className="inline-flex items-center">
            <NextLink href={item.path} className={clsx('link secondary', pathName === item.path && 'active')}>
              <i className={twMerge('text-tertiary', item.icon)} />
              <span className="hidden md:block">{item.text}</span>
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Header({ title, mainMenu, hideLogo }: Props) {
  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const { account } = useAccount();
  const logOut = useLogOut();
  const signIn = useSignIn();
  const { hasLemonhead } = useLemonhead();

  console.log(hasLemonhead);

  return (
    <div className="py-3 px-4 h-[56px] flex justify-between items-center z-10 gap-4">
      <div className="flex items-center gap-3 flex-1">
        {!hideLogo && (
          <NextLink
            href="/"
            aria-label="Lemonade"
            className="text-tertiary hover:text-primary size-10 flex items-center justify-center"
          >
            <i className="icon-lemonade size-[20]" />
          </NextLink>
        )}
        {title && <h1 className="text-md text-tertiary font-medium">{title}</h1>}
      </div>

      {mainMenu?.()}

      <div className="flex flex-1 justify-end items-center">
        {/* right content here */}

        {session && me ? (
          <div className="flex gap-4 items-center">
            {!me.email_verified && (
              <Button
                onClick={() => window.open(`${IDENTITY_URL}/verification?return_to=${window.location.origin}`)}
                size="sm"
                className="rounded-full"
                variant="warning"
                iconLeft="icon-error"
                outlined
              >
                Verify Email
              </Button>
            )}
            <Menu.Root>
              <Menu.Trigger>
                {({ isOpen }) => (
                  <div
                    className={twMerge(
                      'transition p-2 flex justify-center items-center rounded-full hover:bg-primary/8',
                      clsx(isOpen && 'bg-primary/8'),
                    )}
                  >
                    <Avatar src={account ? getAccountAvatar(account) : userAvatar(me)} />
                  </div>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-0 min-w-[228px]">
                {({ toggle }) => (
                  <>
                    <div
                      className={'flex gap-2.5 px-2 py-1.5 items-center hover:bg-primary/8 rounded-t-xs cursor-pointer'}
                    >
                      <Avatar size="lg" src={account ? getAccountAvatar(account) : userAvatar(me)} />
                      <div>
                        <p className="text-md font-medium whitespace-nowrap">{account?.metadata?.name || me.name}</p>
                        <p className="text-xs font-medium text-tertiary">{me.email}</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="p-1">
                      <MenuItem title="Edit Profile" onClick={() => drawer.open(ProfilePane, { dismissible: false })} />
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
          </div>
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
