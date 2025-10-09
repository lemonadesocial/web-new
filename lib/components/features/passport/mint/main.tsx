'use client';
import React from 'react';

import Header from '$lib/components/layouts/header';
import { PassportProvider, PassportStep, usePassportContext } from './provider';
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

  return (
    <main className="h-dvh w-full flex flex-col divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        {(() => {
          const Comp = state.steps[state.currentStep].component;
          return <Comp />;
        })()}
      </div>
      
      <PassportFooter />
    </main>
  );
}

