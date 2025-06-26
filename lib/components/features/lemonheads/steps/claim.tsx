'use client';
import clsx from 'clsx';
import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { Button, Menu, MenuItem, modal, Skeleton } from '$lib/components/core';
import { useConnectWallet } from '$lib/hooks/useConnectWallet';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { chainsMapAtom, sessionClientAtom } from '$lib/jotai';
import { SelectProfileModal } from '../../lens-account/SelectProfileModal';
import { ClaimLemonadeUsernameModal } from '../../lens-account/ClaimLemonadeUsernameModal';
import { ProfileMenu } from '../../lens-account/ProfileMenu';
import { useClient } from '$lib/graphql/request';
import { useDisconnect } from '@reown/appkit/react';

const steps = [
  {
    title: 'Connect Account',
    subtitle: 'Link your crypto wallet to get started and securely mint your LemonHead on-chain.',
    component: ConnectAccount,
  },
  {
    title: 'Claim Username',
    subtitle: 'Secure your Lemonade username—it’ll also be the official name of your LemonHead.',
    component: ClaimLemonadeUsername,
  },
  {
    title: 'Mint LemonHead',
    subtitle: 'You’re ready to mint! Lock in your LemonHead forever for 0.01337 ETH and show it off.',
    component: MintLemonHead,
  },
];

export function ClaimStep() {
  const { account: myAccount } = useAccount();
  const [currentStep, setCurrentStep] = React.useState(0);
  console.log(currentStep);

  React.useEffect(() => {
    if (!myAccount) setCurrentStep(0);
  }, [myAccount]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Claim LemonHead</h3>
        <p className="text-tertiary">
          Let’s bring your avatar to life. Just follow these quick steps to mint your one-of-a-kind LemonHead.
        </p>
      </div>

      <div>
        <div className="flex flex-col">
          {steps.map((i, idx) => {
            const Comp = i.component;

            return (
              <div key={idx} className="flex">
                <div className="flex flex-col items-center relative">
                  <div className="bg-background backdrop-blur-2xl absolute top-1 z-10">
                    {currentStep <= idx && (
                      <div
                        className={clsx(
                          'border-2 w-6 h-6 flex items-center justify-center rounded-full',
                          currentStep === idx && ' border-success-600',
                        )}
                      >
                        <p className={clsx('text-sm', currentStep === idx ? 'text-success-600' : 'text-tertiary')}>
                          {idx + 1}
                        </p>
                      </div>
                    )}

                    {currentStep > idx && currentStep < steps.length && <i className=" icon-check text-success-600" />}
                  </div>
                  {idx < 2 && (
                    <div
                      className={clsx(
                        'h-full border-l-2 absolute top-3 ',
                        currentStep > idx
                          ? 'border-success-600 border-solid'
                          : 'border-dashed border-[var(--color-divider)]',
                      )}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-4 pb-8 pl-8">
                  <div className="flex flex-col gap-2">
                    <h3 className={clsx('text-xl font-medium text-primary', currentStep <= idx && 'opacity-50')}>
                      {i.title}
                    </h3>
                    <p className={clsx('font-medium text-secondary', currentStep <= idx + 1 && 'opacity-50')}>
                      {i.subtitle}
                    </p>
                  </div>
                  <Comp onHandleStep={(value: number) => setCurrentStep(value)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConnectAccount({ onHandleStep }: { onHandleStep?: (value: number) => void }) {
  const { account: myAccount } = useAccount();
  const { username, isLoading, refetch } = useLemonadeUsername(myAccount);

  const chainsMap = useAtomValue(chainsMapAtom);
  const { connect, isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);

  const { disconnect } = useDisconnect();
  const { client } = useClient();
  const setSessionClient = useSetAtom(sessionClientAtom);

  React.useEffect(() => {
    if (isReady && myAccount) {
      onHandleStep?.(1);
    }
  }, [isReady, myAccount]);

  if (isLoading) return <Skeleton animate className="h-8 w-1/2 rounded" />;

  if (myAccount) {
    return (
      <div className="flex gap-2">
        <Button iconLeft="icon-lens" variant="tertiary" className="hover:bg-[var(--btn-tertiary)]!">
          {myAccount.username?.value.replace('lens/', '')}
        </Button>

        <ProfileMenu options={{ canView: false, canEdit: false }}>
          <Button variant="tertiary-alt" icon="icon-more-vert" className="w-[40px] h-[40px]" />
        </ProfileMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={() => {
          if (!isReady) connect();
          if (!myAccount) modal.open(SelectProfileModal, { dismissible: true });
          else modal.open(ClaimLemonadeUsernameModal, { props: { onComplete: () => refetch() } });
        }}
      >
        {isReady ? (myAccount && !username ? 'Claim Your Username' : 'Select Account') : 'Connect Wallet'}
      </Button>

      {isReady && (
        <Menu.Root>
          <Menu.Trigger>
            <Button variant="tertiary-alt" icon="icon-more-vert" className="w-[40px] h-[40px]" />
          </Menu.Trigger>
          <Menu.Content className="p-1">
            {({ toggle }) => (
              <MenuItem
                onClick={async () => {
                  disconnect();
                  client.resetCustomerHeader();
                  setSessionClient(null);
                  toggle();
                }}
              >
                <div className="flex items-center gap-2.5">
                  <i className="icon-exit size-4 text-error" />
                  <p className="text-sm text-error">Disconnect</p>
                </div>
              </MenuItem>
            )}
          </Menu.Content>
        </Menu.Root>
      )}
    </div>
  );
}

function ClaimLemonadeUsername({ onHandleStep }: { onHandleStep?: (value: number) => void }) {
  const { account: myAccount } = useAccount();
  const chainsMap = useAtomValue(chainsMapAtom);
  const { isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);

  const { username, isLoading, refetch } = useLemonadeUsername(myAccount);

  React.useEffect(() => {
    if (isReady && username) onHandleStep?.(2);
  }, [isReady, username]);

  if (!isReady || (isReady && !myAccount)) return null;

  if (isLoading) return <Skeleton animate className="h-8 w-1/2 rounded" />;

  if (!username) {
    return (
      <div>
        <Button
          variant="secondary"
          onClick={() => {
            modal.open(ClaimLemonadeUsernameModal, { props: { onComplete: () => refetch() } });
          }}
        >
          Claim Your Username
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button iconLeft="icon-lemonade" variant="tertiary" className="hover:bg-[var(--btn-tertiary)]!">
        {username}
      </Button>
    </div>
  );
}

function MintLemonHead() {
  const { account: myAccount } = useAccount();
  const { username, isLoading } = useLemonadeUsername(myAccount);

  // TODO: replace value here
  const value = '0.01337 ETH';

  if (!myAccount || !username) return null;

  if (isLoading) return <Skeleton animate className="h-8 w-1/2 rounded" />;

  return (
    <div>
      <Button variant="secondary" className="hover:bg-[var(--btn-tertiary)]!">
        Mint ‣ {value}
      </Button>
    </div>
  );
}
