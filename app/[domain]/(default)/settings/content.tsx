'use client';
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAtom, useAtomValue } from 'jotai';

import { Avatar, Button, Card, drawer, modal } from '$lib/components/core';
import { VerifyEmailModal } from '$lib/components/features/auth/VerifyEmailModal';
import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { useMe } from '$lib/hooks/useMe';
import { chainsMapAtom, sessionAtom } from '$lib/jotai';
import { PROFILE_SOCIAL_LINKS } from '$lib/utils/constants';
import { userAvatar } from '$lib/utils/user';
import { truncateMiddle } from '$lib/utils/string';
import { useConnectWallet } from '$lib/hooks/useConnectWallet';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { ConnectWalletModal } from '$lib/components/features/auth/ConnectWalletModal';
import { SelectProfileModal } from '$lib/components/features/lens-account/SelectProfileModal';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { ClaimLemonadeUsernameModal } from '$lib/components/features/lens-account/ClaimLemonadeUsernameModal';
import { ProfilePane } from '$lib/components/features/pane';

export function Content() {
  const [session] = useAtom(sessionAtom);
  const walletVerified = session?.wallet;

  const me = useMe();
  const { account } = useAccount();
  const { address } = useAppKitAccount();
  const { username } = useLemonadeUsername(account);

  const chainsMap = useAtomValue(chainsMapAtom);
  const { connect, isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);
  const { disconnect } = useDisconnect();

  const handleSelectWallet = () => {
    modal.open(ConnectWallet, {
      dismissible: true,
      props: {
        onConnect: () => {
          modal.close();
          setTimeout(() => {
            modal.open(SelectProfileModal, { dismissible: true });
          });
        },
        chain: chainsMap[LENS_CHAIN_ID],
      },
    });
  };

  const getSocialLink = (name: string) => {
    return account?.metadata?.attributes.find((i) => i.key === name)?.value;
  };

  return (
    <Card.Content className="max-w-[532px] bg-card backdrop-blur-lg rounded-lg border border-card-border flex flex-col  p-0 divide-y divide-(--color-divider)">
      <div className="px-[18px] py-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="size-[60px]">
            <Avatar className="w-full h-full" src={account?.metadata?.picture || userAvatar(me)} />
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
              <h3 className={clsx('text-xl font-semibold', account?.metadata?.name ? 'text-primary' : 'text-tertiary')}>
                {account?.metadata?.name || 'No Name Added'}
              </h3>
              <p className="text-tertiary">{username ? `@${username}` : 'No Username Picked'}</p>
            </div>
            {account?.metadata?.bio && <p className="text-secondary">{account?.metadata?.bio}</p>}
          </div>
          <div className="flex gap-3">
            {PROFILE_SOCIAL_LINKS.map((s, idx) => (
              <div
                key={idx}
                className="text-tertiary cursor-pointer hover:text-primary tooltip tooltip-top"
                onClick={() =>
                  getSocialLink(s.name) && window.open(`https://${s.prefix}${getSocialLink(s.name)}`, '_blank')
                }
              >
                <div className="tooltip-content z-20">
                  <p className="text-md font-medium capitalize">{s.name.replace('handle_', '').replace('_url', '')}</p>
                </div>
                <i className={twMerge(s.icon, 'size-5')} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <ListItem icon="icon-email" title="Email" placeholder={!me?.email} subtile={me?.email || 'No Email Added'}>
          {session && !session.email && (
            <Button
              onClick={() => modal.open(VerifyEmailModal, { dismissible: true })}
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
                onClick={() => modal.open(ConnectWalletModal, { dismissible: true, props: { verifyRequired: true } })}
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
                modal.open(SelectProfileModal, { dismissible: true });
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
          divide={false}
          placeholder={!username}
          subtile={username || 'No Username Picked'}
        >
          {!username && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (!account) {
                  handleSelectWallet();
                } else {
                  modal.open(ClaimLemonadeUsernameModal);
                }
              }}
            >
              Claim Username
            </Button>
          )}
        </ListItem>
      </div>
    </Card.Content>
  );
}

function ListItem({
  icon,
  title,
  placeholder,
  subtile,
  divide = true,
  children,
}: React.PropsWithChildren & {
  icon: string;
  title: string;
  subtile: string;
  placeholder?: boolean;
  divide?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="pl-4">
        <i className={twMerge('text-tertiary size-5', icon)} />
      </div>
      <div className={clsx('flex flex-1 py-3 items-center', divide && 'border-b')}>
        <div className="flex-1">
          <p className="text-sm text-tertiary">{title}</p>
          <p className={clsx(placeholder ? 'text-tertiary' : 'text-primary')}>{subtile}</p>
        </div>
        <div className="pr-4">{children}</div>
      </div>
    </div>
  );
}
