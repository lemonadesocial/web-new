'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '$lib/components/core';
import Header from '$lib/components/layouts/header';
import { LemonHeadBodyType } from '$lib/lemon-heads/types';
import { useRouter } from 'next/navigation';

const STEPS = [
  { key: 'about', label: 'About You', component: AboutYou },
  { key: 'create', label: 'Create', component: () => null },
  { key: 'claim', label: 'Claim', component: () => null },
  { key: 'collaborate', label: 'Collaborate', component: () => null },
  { key: 'celebrate', label: 'Celebrate', componenent: () => null },
];

export function Content({ dataBody = [] }: { dataBody?: LemonHeadBodyType[] }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  console.log(STEPS[currentStep].component);
  const Comp = STEPS[currentStep].component;

  return (
    <div className="flex flex-col h-screen we-full divide-y divide-[var(--color-divider)]">
      <Header />
      <div className="flex-1 w-[1440px] mx-auto">
        <Comp />
      </div>
      <Footer
        step={currentStep}
        onNext={() => setCurrentStep((prev) => prev + 1)}
        onPrev={() => {
          if (currentStep === 0) router.back();
          else setCurrentStep((prev) => prev - 1);
        }}
      />
    </div>
  );
}

function Footer({ step, onNext, onPrev }: { step: number; onNext?: () => void; onPrev?: () => void }) {
  return (
    <div className="flex justify-between items-center h-[64px] px-4">
      <div className="flex-1">
        <Button variant="tertiary" size="sm" onClick={onPrev} iconLeft={step > 0 ? 'icon-chevron-left' : undefined}>
          {step === 0 ? 'Exit' : 'Back'}
        </Button>
      </div>

      <ul className="flex items-center flex-auto justify-center flex-1 gap-1.5">
        {STEPS.map((item, index) => {
          return (
            <li key={item.key} className="flex items-center gap-1.5">
              <p className={twMerge('text-quaternary', index <= step && 'text-primary')}>{item.label}</p>
              {index < STEPS.length && (
                <i
                  className={twMerge('icon-chevron-right size-5 text-quaternary', index <= step - 1 && 'text-primary')}
                />
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex flex-1 justify-end">
        <Button iconRight="icon-chevron-right" variant="secondary" size="sm" onClick={onNext}>
          Enter Customizer
        </Button>
      </div>
    </div>
  );
}

function AboutYou() {
  return (
    <div className="p-11 flex gap-18">
      <div className="flex flex-col gap-8 w-[588px]">
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-semibold">Build Your Base</h3>
          <p className="text-tertiary">Choose your gender, species & body type.</p>
        </div>

        <div>
          <p>Pick your persona</p>
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              <div className="border rounded aspect-square w-[108px]">col 1</div>
              <div className="border rounded aspect-square w-[108px]">col 1</div>
            </div>
            <div className="flex-1 border rounded aspect-square">col 2</div>
            <div className="flex-1 border rounded aspect-square">col 3</div>
          </div>
        </div>
      </div>
      <div className="flex-1">right</div>
    </div>
  );
}
