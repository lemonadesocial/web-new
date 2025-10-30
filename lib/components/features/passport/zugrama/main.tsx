'use client';
import React, { useEffect } from 'react';

import Header from '$lib/components/layouts/header';
import { PassportActionKind, PassportProvider, PassportStep, usePassportContext } from './provider';
import { PassportFooter } from './footer';
import { PassportPreview } from './preview';
import { useAppKitAccount } from '$lib/utils/appkit';
import { trpc } from '$lib/trpc/client';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';

export function PassportMain() {
  return (
    <PassportProvider>
      <Content />
    </PassportProvider>
  );
}

function Content() {
  const [state, dispatch] = usePassportContext();
  const Comp = state.steps[state.currentStep].component;
  const [loading, setLoading] = React.useState(false);
  const session = useSession();
  const signIn = useSignIn();

  const { address } = useAppKitAccount();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  useEffect(() => {
    if (!session && mounted) {
      signIn(false);
    }
  }, [session, mounted]);

  // useEffect(() => {
  //   if (!address || loading) return;

  //   if (state.lemonadeUsername || state.useENS) {
  //     const fluffleTokenId = state.useFluffle ? '1' : undefined;
      
  //     setLoading(true);
  //     mintPassportMutation.mutateAsync({
  //       wallet: address,
  //       ensForUserName: state.useENS,
  //       lemonadeUsername: state.lemonadeUsername || undefined,
  //       fluffleTokenId,
  //     }).then((data) => {
  //       dispatch({ type: PassportActionKind.SetMintData, payload: data });
  //       dispatch({ type: PassportActionKind.SetPassportImage, payload: data.image });
  //       setLoading(false);
  //     }).catch(() => {
  //       setLoading(false);
  //     });
  //   }
  // }, [address, state.lemonadeUsername, state.useENS, state.useFluffle]);

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
