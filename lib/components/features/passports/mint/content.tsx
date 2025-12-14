'use client';

import React from 'react';
import { PassportActionKind, PassportStep, usePassportContext } from './provider';
import { PassportPreview } from './preview';
import { useAppKitAccount } from '$lib/utils/appkit';
import { trpc } from '$lib/trpc/client';

import { PASSPORT_CONFIG } from '../config';

export function MintPassportContent() {
  const [state, dispatch] = usePassportContext();
  const provider = state.provider;

  const [loading, setLoading] = React.useState(false);

  const { address } = useAppKitAccount();

  const mintPassportMutation = trpc.mintPassport.useMutation();

  React.useEffect(() => {
    if (!address || loading) return;

    if (state.lemonadeUsername || state.useENS) {
      const fluffleTokenId = state.useFluffle ? '1' : undefined;

      setLoading(true);
      mintPassportMutation
        .mutateAsync({
          wallet: address,
          lemonadeUsername: state.lemonadeUsername || undefined,
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

  const Comp = PASSPORT_CONFIG[provider].steps[state.currentStep].component;

  return (
    <>
      <Comp />
      {state.currentStep !== PassportStep.celebrate && <PassportPreview loading={loading} />}
    </>
  );
}
