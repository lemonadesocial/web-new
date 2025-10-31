'use client';
import React, { useEffect } from 'react';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';

import Header from '$lib/components/layouts/header';
import { PassportProvider, PassportStep, usePassportContext } from './provider';
import { PassportFooter } from './footer';
import { PassportPreview } from './preview';

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
  const session = useSession();
  const signIn = useSignIn();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  useEffect(() => {
    if (!session && mounted) {
      signIn(false);
    }
  }, [session, mounted]);

  return (
    <main className="h-dvh w-full flex flex-col divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-[1200px] h-full mx-auto flex flex-col-reverse md:flex-row gap-6 md:gap-18 p-4 md:p-0 overflow-auto">
          <Comp />
          {
            state.currentStep !== PassportStep.celebrate && <PassportPreview />
          }
        </div>
      </div>

      <PassportFooter />
    </main>
  );
}
