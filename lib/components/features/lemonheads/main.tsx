'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAtom, useAtomValue } from 'jotai';
import { isMobile } from 'react-device-detect';
import clsx from 'clsx';
import { ethers } from 'ethers';

import { Button, Checkbox, modal, ModalContent, toast } from '$lib/components/core';
import Header from '$lib/components/layouts/header';
import { LemonHeadsLayer } from '$lib/trpc/lemonheads/types';
import { transformTrait } from '$lib/trpc/lemonheads/preselect';
import { LemonheadNFTContract } from '$lib/utils/crypto';
import { chainsMapAtom } from '$lib/jotai';
import { trpc } from '$lib/trpc/client';
import { TraitType } from '$lib/services/lemonhead/core';
import { ASSET_PREFIX } from '$lib/utils/constants';

import { AboutYou } from './steps/about';
import { LemonHeadValues } from './types';
import { LemonHeadPreview } from './preview';
import { CreateStep } from './steps/create';
import { ClaimStep } from './steps/claim';
import { mintAtom } from './store';
// import { Collaborate } from './steps/collaborate';
// import { Celebrate } from './steps/celebrate';
import { LemonHeadGetStarted } from './steps/get-started';

import { convertFormValuesToTraits, LEMONHEAD_CHAIN_ID } from './utils';
import { useAppKitAccount } from '@reown/appkit/react';
import { ConnectWallet } from '../modals/ConnectWallet';
import { useAccount } from '$lib/hooks/useLens';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import Link from 'next/link';

const steps = [
  { key: 'getstarted', label: '', component: LemonHeadGetStarted, btnText: 'Get Started' },
  { key: 'about', label: 'About You', component: AboutYou, btnText: 'Enter Customizer' },
  { key: 'create', label: 'Create', component: CreateStep, btnText: 'Claim' },
  { key: 'claim', label: 'Claim', component: ClaimStep, btnText: 'Continue' },
  // { key: 'collaborate', label: 'Collaborate', component: Collaborate, btnText: 'Continue' },
  // { key: 'celebrate', label: 'Celebrate', componenent: Celebrate, btnText: 'Continue' },
];

export function LemonHeadMain({ bodySet, defaultSet }: { bodySet: LemonHeadsLayer[]; defaultSet: LemonHeadsLayer[] }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const Comp = steps[currentStep].component as any;

  const bodyAttatchment = bodySet.find((i) => i.name === 'human' && i.skin_tone === 'tan')?.attachment;

  const form = useForm<LemonHeadValues>({
    defaultValues: {
      ...transformTrait({ data: defaultSet, gender: 'female', size: 'medium' }),
      body: {
        type: TraitType.body,
        value: 'human',
        race: 'human',
        filters: {
          skin_tone: 'tan',
          size: 'medium',
          gender: 'female',
          race: 'human',
        },
        attachment: bodyAttatchment,
      },
    },
  });

  const formValues = form.watch();

  const validateNft = trpc.validateNft.useMutation();
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[LEMONHEAD_CHAIN_ID];
  const contractAddress = chain?.lemonhead_contract_address;

  const checkMinted = async () => {
    let isValid = true;

    try {
      const traits = convertFormValuesToTraits(formValues);
      if (!traits.length || !contractAddress) return;

      const { lookHash } = await validateNft.mutateAsync({ traits });

      const provider = new ethers.JsonRpcProvider(chain.rpc_url);
      const contract = LemonheadNFTContract.attach(contractAddress).connect(provider);

      const owner = await contract.getFunction('uniqueLooks')(lookHash);
      if (owner && owner !== ethers.ZeroAddress) {
        toast.error('This LemonHead look has already been minted');
        isValid = false;
      }
    } catch (error: any) {
      toast.error(error.message);
      isValid = false;
    }

    return isValid;
  };

  return (
    <main className="flex flex-col h-screen w-full divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>
      <div className="flex-1 overflow-auto md:overflow-hidden">
        <div className="flex flex-col md:flex md:flex-row-reverse max-w-[1440px] mx-auto gap-5 overflow-auto md:gap-18 p-4 md:p-11 md:max-h-full no-scrollbar">
          <div className={clsx('flex-1 z-10', isMobile && currentStep > 2 && 'size-[80px]')}>
            {currentStep === 0 ? (
              <img
                src={`${ASSET_PREFIX}/assets/images/lemonheads-getstarted.gif`}
                className="rounded-sm w-full h-full"
              />
            ) : (
              <LemonHeadPreview form={formValues} bodySet={bodySet} />
            )}
          </div>

          <Comp form={form} bodySet={bodySet} defaultSet={defaultSet} />
        </div>
      </div>
      <Footer
        step={currentStep}
        bodySet={bodySet}
        form={form}
        onNext={async () => {
          if (currentStep < steps.length - 1) {
            // check valid traits before move next
            if (currentStep === 2) {
              const valid = await checkMinted();
              if (!valid) return;
            }
            setCurrentStep((prev) => prev + 1);
          }

          // FIXME: it's last step for now. should update logic here when implement 2 more steps
          if (steps[currentStep].key === 'claim') {
            router.push('/');
          }
        }}
        onPrev={() => {
          if (currentStep === 0) router.back();
          else {
            setCurrentStep((prev) => prev - 1);
          }
        }}
      />
    </main>
  );
}

function Footer({
  step,
  form,
  bodySet,
  onNext,
  onPrev,
}: {
  step: number;
  onNext?: () => void;
  onPrev?: () => void;
  form: UseFormReturn<LemonHeadValues>;
  bodySet: LemonHeadsLayer[];
}) {
  const [mint, setMintAtom] = useAtom(mintAtom);
  const disabled = step === 3 && !mint.minted;
  const currentStep = steps[step];

  const { account: myAccount } = useAccount();
  const chainsMap = useAtomValue(chainsMapAtom);
  const { isConnected } = useAppKitAccount();

  const handleNext = () => {
    if (currentStep.key === 'create') {
      if (!isConnected) {
        modal.open(ConnectWallet, {
          props: {
            onConnect: () => {
              modal.close();

              setTimeout(() => {
                if (!myAccount) {
                  modal.open(BeforMintModal, { dismissible: true, props: { form: form, bodySet } });
                  return;
                }
              });
            },
            chain: chainsMap[LENS_CHAIN_ID],
          },
          dismissible: true,
        });

        return;
      }
    }
    onNext?.();
  };

  if (isMobile) {
    return (
      <div className="flex items-center gap-2 min-h-[64px] px-4">
        <Button icon="icon-logout" onClick={onPrev} variant="tertiary" />
        <Button variant="secondary" className="w-full" onClick={handleNext} disabled={disabled}>
          {steps[step].btnText}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center min-h-[64px] px-4 bg-background/80 backdrop-blur-md">
      <div className="flex-1">
        {step <= 3 && !mint.minted && (
          <Button variant="tertiary" size="sm" onClick={onPrev} iconLeft={step > 0 ? 'icon-chevron-left' : undefined}>
            {step === 0 ? 'Exit' : 'Back'}
          </Button>
        )}
      </div>

      {step > 0 && (
        <ul className="flex items-center justify-center flex-1 gap-1.5">
          {steps.map((item, index) => {
            if (index === 0) return null;
            return (
              <li key={item.key} className="flex items-center gap-1.5">
                <p className={twMerge('text-quaternary', index <= step && 'text-primary')}>{item.label}</p>
                {index < steps.length - 1 && (
                  <i
                    className={twMerge(
                      'icon-chevron-right size-5 text-quaternary',
                      index <= step - 1 && 'text-primary',
                    )}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex gap-2 flex-1 justify-end">
        {mint.video && (
          <Button
            size="sm"
            variant="tertiary-alt"
            icon={mint.mute ? 'icon-speaker-wave' : 'icon-speaker-x-mark'}
            onClick={() => setMintAtom({ ...mint, mute: !mint.mute })}
          />
        )}
        <Button iconRight="icon-chevron-right" disabled={disabled} variant="secondary" size="sm" onClick={handleNext}>
          {steps[step].btnText}
        </Button>
      </div>
    </div>
  );
}

function BeforMintModal({ form, bodySet }: { form: UseFormReturn<LemonHeadValues>; bodySet: LemonHeadsLayer[] }) {
  return (
    <ModalContent icon="icon-signature" onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Before You Mint</p>
          <p className="text-sm">Please review and agree to the terms.</p>
          <p className="text-sm">By minting your LemonHead, you agree to our Terms of Use and acknowledge that:</p>
          <ul className="list-disc pl-5.5 text-sm">
            <li>Your avatar will be permanently recorded on-chain.</li>
            <li>It will be publicly visible and tied to your wallet address.</li>
            <li>You won’t be able to edit the name or artwork after minting. All sales are final.</li>
          </ul>

          <div className="flex gap-1 items-center">
            <Link href="" target="_blank" className="text-accent-400 text-sm">
              View Full Terms of Use
            </Link>
            <i className="icon-arrow-outward size-[18px] text-quaternary" />
          </div>
        </div>

        <Checkbox containerClass="text-sm items-center [&_i]:size-5" id="term">
          I’ve read and agree to the Terms of Use.
        </Checkbox>

        <Button
          variant="secondary"
          onClick={() => {
            modal.close();
            modal.open(MintModal, { props: { form, bodySet } });
          }}
        >
          Continue
        </Button>
      </div>
    </ModalContent>
  );
}

function MintModal({ form, bodySet }: { form: UseFormReturn<LemonHeadValues>; bodySet: LemonHeadsLayer[] }) {
  const formValues = form.watch();
  return (
    <ModalContent
      icon={<LemonHeadPreview className="size-[80px]" form={formValues} bodySet={bodySet} />}
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Claim Your LemonHead</p>
          <p className="text-sm">
            You’re just one step away from owning your unique & personalized LemonHead. Mint & claim your on-chain
            identity.
          </p>
        </div>
        <Button variant="secondary">Continue</Button>
      </div>
    </ModalContent>
  );
}
