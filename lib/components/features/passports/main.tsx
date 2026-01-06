'use client';
import React from 'react';
import { notFound } from 'next/navigation';

import Header from '$lib/components/layouts/header';

import { MAPPING_PASSPORT_STEPS, PASSPORT_CONFIG } from './config';
import { PASSPORT_PROVIDER, PassportStep } from './types';
import { PassportProvider, usePassportContext } from './provider';
import { Footer } from './footer';
import { PassportPreview } from './preview';

interface Props {
  provider: PASSPORT_PROVIDER;
}

export function MainPassport({ provider }: Props) {
  if (!PASSPORT_CONFIG[provider]) return notFound();

  return (
    <PassportProvider value={PASSPORT_CONFIG[provider]}>
      <Content />
    </PassportProvider>
  );
}

function Content() {
  const [state] = usePassportContext();
  const Comp = state.currentStep ? MAPPING_PASSPORT_STEPS[state.currentStep] : React.Fragment;

  return (
    <main className="h-dvh w-full flex flex-col divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-[1200px] h-full mx-auto flex flex-col-reverse md:flex-row gap-6 md:gap-18 p-4 md:p-0 overflow-auto">
          <Comp />
          {state.currentStep !== PassportStep.celebrate && <PassportPreview />}
        </div>
      </div>

      <Footer />
    </main>
  );
}
