'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { isMobile } from 'react-device-detect';
import clsx from 'clsx';

import { Button } from '$lib/components/core';
import Header from '$lib/components/layouts/header';
import { LemonHeadAccessory, LemonHeadBodyType } from '$lib/trpc/lemonheads/types';
import { transformPreselect } from '$lib/trpc/lemonheads/preselect';

import { AboutYou } from './steps/about';
import { LemonHeadValues } from './types';
import { LemonHeadPreview } from './preview';
import { CreateStep } from './steps/create';
import { ClaimStep } from './steps/claim';
import { mintAtom } from './store';
import { Collaborate } from './steps/collaborate';
import { Celebrate } from './steps/celebrate';
import { LemonHeadGetStarted } from './steps/get-started';

const steps = [
  { key: 'getstarted', label: '', component: LemonHeadGetStarted, btnText: 'Get Started' },
  { key: 'about', label: 'About You', component: AboutYou, btnText: 'Enter Customizer' },
  { key: 'create', label: 'Create', component: CreateStep, btnText: 'Claim' },
  { key: 'claim', label: 'Claim', component: ClaimStep, btnText: 'Continue' },
  { key: 'collaborate', label: 'Collaborate', component: Collaborate, btnText: 'Continue' },
  { key: 'celebrate', label: 'Celebrate', componenent: Celebrate, btnText: 'Continue' },
];

export function LemonHeadMain({
  dataBody,
  dataPreSelect,
}: {
  dataBody: LemonHeadBodyType[];
  dataPreSelect: LemonHeadAccessory[];
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const Comp = steps[currentStep].component as any;

  const form = useForm<LemonHeadValues>({
    defaultValues: {
      ...(transformPreselect({ data: dataPreSelect, gender: 'female', size: 'small' }) || {}),
      gender: 'female',
      body: 'human',
      size: 'small',
      skin_tone: { value: 'light', color: '#FDCCA8' },
    },
  });

  const formValues = form.watch();

  return (
    <main className="flex flex-col h-screen w-full divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>
      <div className="flex-1 overflow-auto md:overflow-hidden">
        <div className="flex flex-col md:flex md:flex-row-reverse max-w-[1440px] mx-auto gap-5 overflow-auto md:gap-18 p-4 md:p-11 md:max-h-full">
          <div className={clsx('flex-1', isMobile && currentStep > 1 && 'size-[80px] z-10')}>
            <LemonHeadPreview form={formValues} bodyBase={dataBody} />
          </div>

          <Comp form={form} bodyBase={dataBody} accessoriesBase={dataPreSelect} />
        </div>
      </div>
      <Footer
        step={currentStep}
        onNext={() => {
          if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
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

function Footer({ step, onNext, onPrev }: { step: number; onNext?: () => void; onPrev?: () => void }) {
  const [mint, setMintAtom] = useAtom(mintAtom);
  const disabled = step === 3 && !mint.minted;

  if (isMobile) {
    return (
      <div className="flex items-center gap-2 min-h-[64px] px-4">
        <Button icon="icon-logout" onClick={onPrev} variant="tertiary" />
        <Button variant="secondary" className="w-full" onClick={onNext} disabled={disabled}>
          {steps[step].btnText}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center min-h-[64px] px-4 bg-background/80 backdrop-blur-md">
      <div className="flex-1">
        <Button variant="tertiary" size="sm" onClick={onPrev} iconLeft={step > 0 ? 'icon-chevron-left' : undefined}>
          {step === 0 ? 'Exit' : 'Back'}
        </Button>
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
        <Button iconRight="icon-chevron-right" disabled={disabled} variant="secondary" size="sm" onClick={onNext}>
          {steps[step].btnText}
        </Button>
      </div>
    </div>
  );
}
