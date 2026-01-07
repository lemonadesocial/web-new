'use client';
import React from 'react';
import { notFound } from 'next/navigation';
import { useAppKitAccount } from '@reown/appkit/react';

import Header from '$lib/components/layouts/header';
import { trpc } from '$lib/trpc/client';

import { MAPPING_PASSPORT_STEPS, PASSPORT_CONFIG } from './config';
import { PASSPORT_PROVIDER, PASSPORT_PROVIDERS, PassportActionKind, PassportStep } from './types';
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
  const [state, dispatch] = usePassportContext();
  const Comp = state.currentStep ? MAPPING_PASSPORT_STEPS[state.currentStep] : React.Fragment;

  const [loading, setLoading] = React.useState(false);

  const { address } = useAppKitAccount();

  const mintPassportMutation = trpc.passport.getMintData.useMutation();

  React.useEffect(() => {
    if (!address || loading) return;

    // PERF: ONLY CHECK WITH MINT (Lemonade) provider
    if (state.lemonadeUsername || state.useENS) {
      const fluffleTokenId = state.useFluffle ? '1' : undefined;

      setLoading(true);
      mintPassportMutation
        .mutateAsync({
          provider: state.provider,
          wallet: address,
          username: state.lemonadeUsername || undefined,
          fluffleTokenId,
        })
        .then((data) => {
          dispatch({ type: PassportActionKind.SetMintData, payload: data });
          dispatch({ type: PassportActionKind.SetPassportImage, payload: data.image });
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [address, state.lemonadeUsername, state.useENS, state.useFluffle]);

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
