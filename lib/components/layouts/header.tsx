'use client';
import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

import { sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';
import { Button } from '$lib/components/core';
import { useAuth } from '$lib/hooks/useAuth';

import { useSignIn } from '$lib/hooks/useSignIn';
import { useConnectUnicornWallet } from '$lib/hooks/useConnectUnicornWallet';
import { useHandleFarcasterMiniApp } from '$lib/hooks/useConnectFarcaster';

import { UserMenu } from './UserMenu';

type Props = {
  title?: string;
  mainMenu?: () => ReactElement;
  hideLogo?: boolean;
  className?: string;
  showUI?: boolean;
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
    <nav className="hidden md:flex md:flex-3_1_auto w-[1080px]">
      <ul className="flex flex-1 gap-5">
        {menu.map((item, idx) => (
          <li key={idx} className="inline-flex items-center">
            <NextLink href={item.path} className={clsx('link secondary', pathName === item.path && 'active')}>
              <i aria-hidden="true" className={twMerge('text-tertiary', item.icon)} />
              <span className="hidden md:block">{item.text}</span>
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Header({ showUI = true, title, mainMenu, hideLogo, className }: Props) {
  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const { reload } = useAuth();
  const signIn = useSignIn();
  useConnectUnicornWallet();
  useHandleFarcasterMiniApp(reload);

  if (!showUI) return null;

  return (
    <div className={twMerge('p-4 h-[56px] flex justify-between items-center z-10 gap-4 font-default', className)}>
      <div className="flex items-center gap-3 flex-1">
        {!hideLogo && (
          <NextLink
            href="/"
            aria-label="Lemonade"
            className="text-tertiary hover:text-primary size-10 flex items-center justify-center"
          >
            <i aria-hidden="true" className="icon-lemonade size-[20]" />
          </NextLink>
        )}
        {title && <h1 className="text-md text-tertiary font-medium">{title}</h1>}
      </div>

      {mainMenu?.()}

      <div className="flex flex-1 justify-end items-center">
        {/* right content here */}

        {session && me ? (
          <div className="flex gap-2 items-center">
            <UserMenu />
          </div>
        ) : (
          <>
            {!session && (
              <Button
                size="sm"
                variant="tertiary-alt"
                onClick={() => signIn()}
                className="rounded-full backdrop-blur-none"
              >
                Sign In
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
