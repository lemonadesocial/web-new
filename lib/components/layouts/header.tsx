'use client';
import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAtom, useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

import { chainsMapAtom, sessionAtom } from '$lib/jotai';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { useMe } from '$lib/hooks/useMe';
import { useLogOut } from '$lib/hooks/useLogout';
import { Divider, Menu, MenuItem, Button, Avatar, drawer, modal } from '$lib/components/core';
import { userAvatar } from '$lib/utils/user';
import { useLogOut as useLensLogOut } from '$lib/hooks/useLens';

import { useAccount } from '$lib/hooks/useLens';
import { useSignIn } from '$lib/hooks/useSignIn';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { useConnectUnicornWallet } from '$lib/hooks/useConnectUnicornWallet';
// import { useLemonhead } from '$lib/hooks/useLemonhead';
import { ProfilePane } from '../features/pane';
import { VerifyEmailModal } from '../features/auth/VerifyEmailModal';
import { ConnectWalletModal } from '../features/auth/ConnectWalletModal';
import { SelectProfileModal } from '../features/lens-account/SelectProfileModal';
import { ConnectWallet } from '../features/modals/ConnectWallet';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';

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
    <nav className="hidden md:flex md:flex-3_1_auto w-[1080px]">
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
  console.log("Header render");

  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const { account } = useAccount();
  const logOut = useLogOut();
  const { logOut: lensLogOut } = useLensLogOut();
  const signIn = useSignIn();
  // const { hasLemonhead } = useLemonhead();
  useConnectUnicornWallet();

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
          <div className="flex gap-2 items-center">
            {session && !session.email && (
              <Button
                onClick={() => modal.open(VerifyEmailModal)}
                size="sm"
                className="rounded-full"
                variant="warning"
                iconLeft="icon-error"
                outlined
              >
                Verify Email
              </Button>
            )}

            <ConnectLens />

            {/* { */}
            {/*   hasLemonhead ? ( */}
            {/*     <div className="px-2.5 py-1.5 h-8 rounded-sm flex gap-1.5 items-center bg-accent-400/16"> */}
            {/*       <i className="icon-passport size-5 text-accent-400" /> */}
            {/*       <p className="text-sm text-accent-400">Citizen</p> */}
            {/*     </div> */}
            {/*   ) : ( */}
            {/*     <div className="px-2.5 py-1.5 h-8 rounded-sm bg-primary/8"> */}
            {/*       <p className="text-sm text-tertiary">Visitor</p> */}
            {/*     </div> */}
            {/*   ) */}
            {/* } */}
            <Menu.Root>
              <Menu.Trigger>
                {({ isOpen }) => (
                  <div
                    className={twMerge(
                      'transition p-2 flex justify-center items-center rounded-full hover:bg-primary/8',
                      clsx(isOpen && 'bg-primary/8'),
                    )}
                  >
                    <Avatar size="lg" src={account ? getAccountAvatar(account) : userAvatar(me)} />
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
                      {account && (
                        <>
                          <MenuItem
                            title="Switch Profile"
                            onClick={() => {
                              toggle();
                              modal.open(SelectProfileModal);
                            }}
                          />
                          <MenuItem
                            title="Disconnect"
                            onClick={() => {
                              toggle();
                              lensLogOut();
                            }}
                          />
                        </>
                      )}
                      <MenuItem
                        title="Sign Out"
                        onClick={async () => {
                          toggle();
                          logOut();

                          if (account) {
                            lensLogOut();
                          }
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

function ConnectLens() {
  const { account } = useAccount();
  const [session] = useAtom(sessionAtom);

  const walletVerified = session?.wallet;
  const chainsMap = useAtomValue(chainsMapAtom);

  const handleSelectWallet = () => {
    modal.open(ConnectWallet, {
      props: {
        onConnect: () => {
          modal.close();
          setTimeout(() => {
            modal.open(SelectProfileModal);
          });
        },
        chain: chainsMap[LENS_CHAIN_ID],
      },
    });
  };

  if (!walletVerified && !account)
    return (
      <Button
        onClick={() => modal.open(ConnectWalletModal, { props: { verifyRequired: true } })}
        size="sm"
        className="rounded-full"
        variant="warning"
        iconLeft="icon-error"
        outlined
      >
        Claim Username
      </Button>
    );

  if (!account)
    return (
      <Button
        onClick={handleSelectWallet}
        size="sm"
        className="rounded-full"
        variant="warning"
        iconLeft="icon-error"
        outlined
      >
        Claim Username
      </Button>
    );

  if (!walletVerified)
    return (
      <Button
        onClick={() => modal.open(ConnectWalletModal, { props: { verifyRequired: true } })}
        size="sm"
        className="rounded-full"
        variant="warning"
        iconLeft="icon-error"
        outlined
      >
        Verify Wallet
      </Button>
    );

  return null;
}
