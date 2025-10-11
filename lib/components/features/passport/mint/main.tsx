'use client';
import React from 'react';

import Header from '$lib/components/layouts/header';
import { PassportProvider, usePassportContext } from './provider';
import { PassportFooter } from './footer';

export function PassportMain() {
  return (
    <PassportProvider>
      <Content />
    </PassportProvider>
  );
}

function Content() {
  const [state] = usePassportContext();
  const Comp = state.steps[state.currentStep].component;

  return (
    <main className="h-dvh w-full flex flex-col divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <Comp />
      </div>

      <PassportFooter />
    </main>
  );
}
