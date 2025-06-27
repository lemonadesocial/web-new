'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '$lib/components/core';
import Header from '$lib/components/layouts/header';
import { LemonHeadBodyType } from '$lib/trpc/lemonheads/types';

import { AboutYou } from './steps/about';
import { LemonHeadValues } from './types';
import { LemonHeadPreview } from './preview';
import { CreateStep } from './steps/create';
import { ClaimStep } from './steps/claim';
import { trpc } from '$lib/trpc/client';
import { useAtom } from 'jotai';
import { mintAtom } from './store';
import { Collaborate } from './steps/collaborate';
import { Celebrate } from './steps/celebrate';

const steps = [
  { key: 'about', label: 'About You', component: AboutYou, btnText: 'Enter Customizer' },
  { key: 'create', label: 'Create', component: CreateStep, btnText: 'Claim' },
  { key: 'claim', label: 'Claim', component: ClaimStep, btnText: 'Continue' },
  { key: 'collaborate', label: 'Collaborate', component: Collaborate, btnText: 'Continue' },
  { key: 'celebrate', label: 'Celebrate', componenent: Celebrate, btnText: 'Continue' },
];

export function LemonHeadMain({ dataBody }: { dataBody: LemonHeadBodyType[] }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const Comp = steps[currentStep].component as any;

  const { data } = trpc.preselect.useQuery({ size: 'small', gender: 'female' });

  const form = useForm<LemonHeadValues>({
    defaultValues: {
      ...data,
      gender: 'female',
      body: 'human',
      size: 'small',
      skin_tone: { value: 'light', color: '#FDCCA8' },
    },
  });

  return (
    <main className="flex flex-col h-screen w-full divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex max-w-[1440px] mx-auto gap-18 p-11 max-h-full">
          <Comp form={form} bodyBase={dataBody} />
          <div className="flex-1">
            <LemonHeadPreview form={form} bodyBase={dataBody} />
          </div>
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
  const disabled = step === 2 && !mint.minted;

  return (
    <div className="flex justify-between items-center min-h-[64px] px-4 bg-background/80 backdrop-blur-md">
      <div className="flex-1">
        <Button variant="tertiary" size="sm" onClick={onPrev} iconLeft={step > 0 ? 'icon-chevron-left' : undefined}>
          {step === 0 ? 'Exit' : 'Back'}
        </Button>
      </div>

      <ul className="flex items-center flex-auto justify-center flex-1 gap-1.5">
        {steps.map((item, index) => {
          return (
            <li key={item.key} className="flex items-center gap-1.5">
              <p className={twMerge('text-quaternary', index <= step && 'text-primary')}>{item.label}</p>
              {index < steps.length - 1 && (
                <i
                  className={twMerge('icon-chevron-right size-5 text-quaternary', index <= step - 1 && 'text-primary')}
                />
              )}
            </li>
          );
        })}
      </ul>
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
