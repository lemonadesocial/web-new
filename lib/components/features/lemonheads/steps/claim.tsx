'use client';
import clsx from 'clsx';
import React from 'react';
import { useAtomValue } from 'jotai';

import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { Button, modal, Skeleton } from '$lib/components/core';
import { useConnectWallet } from '$lib/hooks/useConnectWallet';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { chainsMapAtom } from '$lib/jotai';
import { SelectProfileModal } from '../../lens-account/SelectProfileModal';
import { ClaimLemonadeUsernameModal } from '../../lens-account/ClaimLemonadeUsernameModal';
import { ProfileMenu } from '../../lens-account/ProfileMenu';

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
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Claim LemonHead</h3>
        <p className="text-tertiary">
          Let’s bring your avatar to life. Just follow these quick steps to mint your one-of-a-kind LemonHead.
        </p>
      </div>

      <div>
        <div className="flex flex-col gap-8">
          {steps.map((i, idx) => {
            const Comp = i.component;

            return (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className={clsx('text-xl font-medium text-primary', currentStep !== idx && 'opacity-50')}>
                    {i.title}
                  </h3>
                  <p className={clsx('font-medium text-secondary', currentStep !== idx && 'opacity-50')}>
                    {i.subtitle}
                  </p>
                </div>
                <Comp />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConnectAccount() {
  const { account: myAccount } = useAccount();
  const { username, isLoading, refetch } = useLemonadeUsername(myAccount);

  const chainsMap = useAtomValue(chainsMapAtom);
  const { connect, isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);

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
    <div>
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
    </div>
  );
}

function ClaimLemonadeUsername() {
  const { account: myAccount } = useAccount();
  const chainsMap = useAtomValue(chainsMapAtom);
  const { isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);

  const { username, isLoading, refetch } = useLemonadeUsername(myAccount);

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
