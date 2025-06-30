'use client';
import clsx from 'clsx';
import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isMobile } from 'react-device-detect';
import { useDisconnect } from '@reown/appkit/react';
import { UseFormReturn } from 'react-hook-form';

import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { Button, drawer, Menu, MenuItem, modal, Skeleton } from '$lib/components/core';
import { useConnectWallet } from '$lib/hooks/useConnectWallet';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { chainsMapAtom, sessionClientAtom } from '$lib/jotai';
import { useClient } from '$lib/graphql/request';
import { trpc } from '$lib/trpc/client';
import { Trait, TraitType } from '$lib/services/lemonhead/core';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { formatWallet } from '$lib/utils/crypto';

import { SelectProfileModal } from '../../lens-account/SelectProfileModal';
import { ClaimLemonadeUsernameModal } from '../../lens-account/ClaimLemonadeUsernameModal';
import { ProfileMenu } from '../../lens-account/ProfileMenu';
import { ProfilePane } from '../../pane';
import { mintAtom } from '../store';
import { LemonHeadValues } from '../types';

const steps = [
  {
    title: 'Connect Account',
    subtitle: 'Link your crypto wallet to get started and securely mint your LemonHead on-chain.',
    component: ConnectAccount,
  },
  {
    title: 'Claim Username',
    subtitle: `Secure your Lemonade username—it'll also be the official name of your LemonHead.`,
    component: ClaimLemonadeUsername,
  },
  {
    title: 'Mint LemonHead',
    subtitle: `You're ready to mint! Lock in your LemonHead forever for 0.01337 ETH and show it off.`,
    component: MintLemonHead,
  },
  {
    component: MintSuccess,
  },
];

export function ClaimStep({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const { account: myAccount } = useAccount();
  const [currentStep, setCurrentStep] = React.useState(0);
  const mintState = useAtomValue(mintAtom);

  React.useEffect(() => {
    if (!myAccount) setCurrentStep(0);
  }, [myAccount]);

  if (mintState.minted || currentStep === 3) {
    return (
      <div className="flex flex-col gap-8 max-w-[680px]">
        <MintSuccess />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-5 md:gap-2">
        <h3 className="text-2xl md:text-3xl font-semibold">Claim LemonHead</h3>
        <p className="text-tertiary">
          Let’s bring your avatar to life. Just follow these quick steps to mint your one-of-a-kind LemonHead.
        </p>
      </div>

      <div className="flex flex-col px-4 md:p-0">
        {steps.map((i, idx) => {
          const Comp = i.component;

          return (
            idx < 3 && (
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
                  <Comp form={form} onHandleStep={(value: number) => setCurrentStep(value)} />
                </div>
              </div>
            )
          );
        })}
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
          {myAccount.username?.localName || myAccount.metadata?.name || formatWallet(myAccount.owner)}
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

  const { username, isLoading } = useLemonadeUsername(myAccount);

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
            modal.open(ClaimLemonadeUsernameModal);
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

function MintLemonHead({
  form,
  onHandleStep,
}: {
  form: UseFormReturn<LemonHeadValues>;
  onHandleStep?: (value: number) => void;
}) {
  const [isMinting, setIsMinting] = React.useState(false);
  const { account: myAccount } = useAccount();
  const { username, isLoading } = useLemonadeUsername(myAccount);
  const formValues = form.watch();
  const mutation = trpc.mintNft.useMutation();

  const convertFormValuesToTraits = (formValues: LemonHeadValues) => {
    const traits = [] as Trait[];
    Object.keys(TraitType).forEach((k) => {
      let value = '';

      if (typeof formValues[k] === 'string') value = formValues[k];
      if (typeof formValues[k] === 'object') value = formValues[k].value;

      const filterOpts = [];
      if (formValues[k]?.filters) {
        Object.entries(formValues[k].filters).map(([key, value]) => filterOpts.push({ key, value }));
      }

      // @ts-expect-error check wrong types
      if (value) traits.push({ type: k, value: value, filters: filterOpts });
    });

    return traits;
  };

  const handleMint = async () => {
    try {
      setIsMinting(true);
      const traits = convertFormValuesToTraits(formValues);
      console.log('Converted traits:', traits);

      if (!myAccount?.owner) {
        console.error('No wallet address found');
        return;
      }

      const mintData = await mutation.mutateAsync({ wallet: myAccount.owner, traits });
      console.log('Mint data:', mintData);

      // onHandleStep?.(3);
    } catch (error) {
      console.error('Error minting LemonHead:', error);
    } finally {
      setIsMinting(false);
    }
  };

  if (!myAccount || !username) return null;

  if (isLoading) return <Skeleton animate className="h-8 w-1/2 rounded" />;

  return (
    <div>
      <Button variant="secondary" onClick={handleMint} loading={isMinting}>
        Mint
      </Button>
    </div>
  );
}

function MintSuccess() {
  const [value, setValue] = useAtom(mintAtom);
  const me = useMe();
  const signIn = useSignIn();

  React.useEffect(() => {
    setValue({ ...value, video: true, minted: true });
  }, []);

  return (
    <>
      <div className="flex flex-col justify-between flex-1 text-secondary z-10 gap-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="md:text-xl">Welcome to</p>
            <h3 className="text-2xl md:text-[72px]! text-primary font-semibold" style={{ lineHeight: '110%' }}>
              United Stands of Lemonade
            </h3>
          </div>
          <p className="md:text-xl max-w-xl">
            You&apos;ve officially joined a bold new world of self-expression and onchain identity. Your LemonHead
            isn&apos;t just an avatar—it&apos;s your ticket to create, connect, and stand out in style.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="size-14 rounded-full items-center justify-center flex bg-(--btn-tertiary)/80">
            <i className="icon-user size-[32px]" />
          </div>
          <p className="w-xs">Personalize your profile and make your presence unforgettable.</p>
          {me && (
            <div>
              <Button
                iconLeft="icon-user-edit-outline"
                variant="secondary"
                onClick={() => {
                  if (me) drawer.open(ProfilePane);
                  else signIn();
                }}
              >
                Update Profile
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="fixed inset-0 z-0">
        <div className="fixed inset-0 bg-background/56 z-0" />
        {isMobile ? (
          <video autoPlay loop playsInline muted={value.mute} className="min-w-full min-h-full">
            <source src={`${ASSET_PREFIX}/assets/video/mint_mobile.mov`} />
          </video>
        ) : (
          <video autoPlay loop playsInline muted={value.mute} className="min-w-full min-h-full">
            <source src={`${ASSET_PREFIX}/assets/video/mint_web.mov`} />
          </video>
        )}
      </div>
    </>
  );
}
