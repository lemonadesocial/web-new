'use client';
import React from 'react';
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAtom, useAtomValue } from 'jotai';

import { Avatar, Button, Card, drawer, modal, toast } from '$lib/components/core';
import { VerifyEmailModal } from '$lib/components/features/auth/VerifyEmailModal';
import { useAccount } from '$lib/hooks/useLens';
import { useMe } from '$lib/hooks/useMe';
import { chainsMapAtom, sessionAtom } from '$lib/jotai';
import { ASSET_PREFIX, PROFILE_SOCIAL_LINKS } from '$lib/utils/constants';
import { userAvatar } from '$lib/utils/user';
import { truncateMiddle } from '$lib/utils/string';
import { useConnectWallet } from '$lib/hooks/useConnectWallet';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { ConnectWalletModal } from '$lib/components/features/auth/ConnectWalletModal';
import { SelectProfileModal } from '$lib/components/features/lens-account/SelectProfileModal';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { ProfilePane } from '$lib/components/features/pane';
import { useSignIn } from '$lib/hooks/useSignIn';
import { PageTitle } from '../shared';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { User } from '$lib/graphql/generated/backend/graphql';
import { useLinkFarcaster } from '$lib/hooks/useConnectFarcaster';
import { useFarcasterUserData } from '$lib/hooks/useFarcasterUserData';
import { ConfirmModal } from '$lib/components/features/modals/ConfirmModal';
import { useMutation } from '$lib/graphql/request';
import { DeleteUserDocument } from '$lib/graphql/generated/backend/graphql';
import { useLogOut } from '$lib/hooks/useLogout';

import { ListItem } from './list-item';
import { OAuthClient } from './oauth-client';
import { useClaimUsername, useLemonadeUsername } from '$lib/hooks/useUsername';

export function Content() {
  const [session] = useAtom(sessionAtom);
  const signIn = useSignIn();
  const [mounted, setMounted] = React.useState(false);

  const me = useMe();
  const walletVerified = session?.wallet || me?.kratos_unicorn_wallet_address || me?.kratos_wallet_address;

  const logOut = useLogOut();
  const { account } = useAccount();
  const { address } = useAppKitAccount();
  const { username } = useLemonadeUsername();

  const chainsMap = useAtomValue(chainsMapAtom);
  const { connect, isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);
  const { disconnect } = useDisconnect();
  const { handleConnect } = useLinkFarcaster();
  const openClaimUsername = useClaimUsername();

  const { userData } = useFarcasterUserData(me?.kratos_farcaster_fid ? me?.kratos_farcaster_fid.replace('farcaster:', '') : null);

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

  const getSocialLink = (name: string) => {
    return account?.metadata?.attributes.find((i) => i.key === name)?.value || me?.[name as keyof Partial<User>];
  };

  const [deleteUser] = useMutation(DeleteUserDocument);

  const handleDeletePost = async () => {
    try {
      await deleteUser({});
      toast.success('Account deleted successfully');
      logOut(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteAccountClick = () => {
    modal.open(ConfirmModal, {
      props: {
        title: 'Delete Account',
        subtitle: 'Are you sure you want to delete your account?',
        icon: 'icon-delete',
        onConfirm: handleDeletePost,
        buttonText: 'Delete',
      },
    });
  };

  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!me && !session && mounted) signIn(false);
  }, [me, session, mounted]);

  if (!me && !session) return null;

  return (
    <div className="flex flex-col gap-8 mt-6 pb-24 md:my-11 max-w-[532px]">
      <PageTitle title="Settings" subtitle="Choose how you are displayed as a host or guest." />

      <Card.Content className="bg-card backdrop-blur-lg rounded-lg border border-card-border flex flex-col p-0 divide-y divide-(--color-divider)">
        <div className="px-[18px] py-4 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="size-[60px]">
              <Avatar
                className="w-full h-full"
                src={account ? account?.metadata?.picture || getAccountAvatar(account) : userAvatar(me)}
              />
            </div>
            <Button
              variant="tertiary-alt"
              iconLeft="icon-user-edit-outline"
              size="sm"
              onClick={() => drawer.open(ProfilePane)}
            >
              Edit Profile
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <h3
                  className={clsx(
                    'text-xl font-semibold',
                    account?.metadata?.name || me?.name ? 'text-primary' : 'text-tertiary',
                  )}
                >
                  {account?.metadata?.name || me?.name || 'No Name Added'}
                </h3>
                <p className="text-tertiary">{username ? `@${username}` : 'No Username Picked'}</p>
              </div>
              {account?.metadata?.bio ||
                (me?.description && <p className="text-secondary">{account?.metadata?.bio || me?.description}</p>)}
            </div>
            <div className="flex gap-3">
              {PROFILE_SOCIAL_LINKS.map((s, idx) => {
                const link = getSocialLink(s.name);
                if (!link) return null;
                return (
                  <div
                    key={idx}
                    className="text-tertiary cursor-pointer hover:text-primary tooltip tooltip-top"
                    onClick={() =>
                      getSocialLink(s.name) && window.open(`https://${s.prefix}${getSocialLink(s.name)}`, '_blank')
                    }
                  >
                    <div className="tooltip-content z-20">
                      <p className="text-md font-medium capitalize">
                        {s.name.replace('handle_', '').replace('_url', '')}
                      </p>
                    </div>
                    <i className={twMerge(s.icon, 'size-5')} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <ListItem icon="icon-email" title="Email" placeholder={!me?.email} subtile={me?.email || 'No Email Added'}>
            {!me?.email_verified && (
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
          </ListItem>

          <ListItem
            icon="icon-wallet"
            title="Wallet"
            placeholder={!address}
            subtile={address ? truncateMiddle(address, 6, 6) : 'No Wallet Connected'}
          >
            {isReady ? (
              !walletVerified ? (
                <Button
                  onClick={() => modal.open(ConnectWalletModal, { props: { verifyRequired: true } })}
                  size="sm"
                  variant="warning"
                  iconLeft="icon-error"
                  outlined
                >
                  Verify Wallet
                </Button>
              ) : (
                <Button iconLeft="icon-logout rotate-180" variant="tertiary-alt" size="sm" onClick={() => disconnect()}>
                  Disconnect
                </Button>
              )
            ) : (
              <Button variant="secondary" size="sm" onClick={() => connect()}>
                Connect Wallet
              </Button>
            )}
          </ListItem>

          <ListItem
            icon="icon-lens"
            title="Profile"
            placeholder={!account?.metadata?.name}
            subtile={account?.metadata?.name || 'No Profile Selected'}
          >
            <Button
              iconLeft={account ? 'icon-renew' : ''}
              variant={account ? 'tertiary-alt' : 'secondary'}
              size="sm"
              onClick={() => {
                if (account) {
                  modal.open(SelectProfileModal);
                } else {
                  handleSelectWallet();
                }
              }}
            >
              {account ? 'Switch' : 'Select Profile'}
            </Button>
          </ListItem>

          <ListItem
            icon="icon-alternate-email"
            title="Username"
            placeholder={!username}
            subtile={username || 'No Username Picked'}
          >
            {!username && (
              <Button
                variant="secondary"
                size="sm"
                onClick={openClaimUsername}
              >
                Claim Username
              </Button>
            )}
          </ListItem>

          <ListItem
            icon="icon-farcaster"
            title="Farcaster"
            placeholder={!me?.kratos_farcaster_fid}
            subtile={userData?.username || 'No Account Connected'}
          >
            {!me?.kratos_farcaster_fid && (
              <Button variant="secondary" size="sm" onClick={() => handleConnect()}>
                Connect Farcaster
              </Button>
            )}
          </ListItem>

          <ListItem
            icon={<img src={`${ASSET_PREFIX}/assets/images/wallet-unicorn.png`} className="size-5" />}
            title="Unicorn Wallet"
            placeholder={!me?.kratos_unicorn_wallet_address}
            subtile={me?.kratos_unicorn_wallet_address || 'No Wallet Connected'}
            divide={false}
          />
        </div>
      </Card.Content>

      {!!me?.oauth2_allow_creation && (
        <div className="bg-card backdrop-blur-lg rounded-lg border border-card-border">
          <OAuthClient />
        </div>
      )}

      <div className="bg-card backdrop-blur-lg rounded-lg border border-card-border">
      <div
          className="flex gap-4 items-center cursor-pointer py-3 px-4"
          onClick={() => logOut(true)}
        >
          <i className="icon-exit size-5 text-tertiary" />
          <p>Sign Out</p>
        </div>
        <hr className="border-t ml-8" />
        <div
          className="flex gap-4 items-center cursor-pointer py-3 px-4"
          onClick={handleDeleteAccountClick}
        >
          <i className="icon-delete size-5 text-error" />
          <p className="text-error">Delete Account</p>
        </div>
      </div>
    </div>
  );
}
