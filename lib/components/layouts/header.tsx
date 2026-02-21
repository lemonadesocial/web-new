'use client';
import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAtom, useAtomValue } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import NextLink from 'next/link';

import { chainsMapAtom, sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';
import { useLogOut } from '$lib/hooks/useLogout';
import { Divider, Menu, MenuItem, Button, Avatar, drawer, modal } from '$lib/components/core';
import { userAvatar } from '$lib/utils/user';
import { useAuth } from '$lib/hooks/useAuth';
import { useAccount } from '$lib/hooks/useLens';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useConnectUnicornWallet } from '$lib/hooks/useConnectUnicornWallet';
import { useHandleFarcasterMiniApp } from '$lib/hooks/useConnectFarcaster';
import { ProfilePane } from '../features/pane';
import { ConnectWalletModal } from '../features/auth/ConnectWalletModal';
import { SelectProfileModal } from '../features/lens-account/SelectProfileModal';
import { ConnectWallet } from '../features/modals/ConnectWallet';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
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
              <i className={twMerge('text-tertiary', item.icon)} />
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
  const logOut = useLogOut();
  const signIn = useSignIn();
  // const { hasLemonhead } = useLemonhead();
  useConnectUnicornWallet();
  useHandleFarcasterMiniApp(reload);

  const router = useRouter();

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
            {/* {!me.email_verified && (
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
            )} */}

            {/* <ConnectLens /> */}

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

// function ConnectLens() {
//   const { account } = useAccount();
//   const me = useMe();
//
//   const walletVerified = me?.kratos_wallet_address || me?.kratos_unicorn_wallet_address;
//   const chainsMap = useAtomValue(chainsMapAtom);
//
//   const handleSelectWallet = () => {
//     modal.open(ConnectWallet, {
//       props: {
//         onConnect: () => {
//           modal.close();
//           setTimeout(() => {
//             modal.open(SelectProfileModal);
//           });
//         },
//         chain: chainsMap[LENS_CHAIN_ID],
//       },
//     });
//   };
//
//   // if (!walletVerified && !account)
//   //   return (
//   //     <Button
//   //       onClick={() => modal.open(ConnectWalletModal, { props: { verifyRequired: true } })}
//   //       size="sm"
//   //       className="rounded-full"
//   //       variant="warning"
//   //       iconLeft="icon-error"
//   //       outlined
//   //     >
//   //       Claim Username
//   //     </Button>
//   //   );
//
//   // if (!account)
//   //   return (
//   //     <Button
//   //       onClick={handleSelectWallet}
//   //       size="sm"
//   //       className="rounded-full"
//   //       variant="warning"
//   //       iconLeft="icon-error"
//   //       outlined
//   //     >
//   //       Claim Username
//   //     </Button>
//   //   );
//
//   if (!walletVerified)
//     return (
//       <Button
//         onClick={() => modal.open(ConnectWalletModal, { props: { verifyRequired: true } })}
//         size="sm"
//         className="rounded-full"
//         variant="warning"
//         iconLeft="icon-error"
//         outlined
//       >
//         Verify Wallet
//       </Button>
//     );
//
//   return null;
// }
