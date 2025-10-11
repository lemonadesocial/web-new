'use client';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import React from 'react';

import { Button, modal } from '$lib/components/core';

import { PassportActionKind, PassportStep, usePassportContext } from './provider';
import { ConnectWallet } from '../../modals/ConnectWallet';
import { LEMONHEAD_CHAIN_ID } from '../../lemonheads/mint/utils';
import { useAtomValue } from 'jotai';
import { chainsMapAtom } from '$lib/jotai';

export function PassportFooter() {
  const router = useRouter();
  const [state, dispatch] = usePassportContext();
  const chainsMap = useAtomValue(chainsMapAtom);

  const currentStep = state.steps[state.currentStep];

  const handlePrev = () => {
    if (state.currentStep === PassportStep.intro) {
      router.back();
      return;
    }
    dispatch({ type: PassportActionKind.PrevStep });
  };

  const handleNext = async () => {
    if (state.currentStep === PassportStep.intro) {
      modal.open(ConnectWallet, {
        props: {
          onConnect: () => {
            dispatch({ type: PassportActionKind.NextStep });
          },
          chain: chainsMap[LEMONHEAD_CHAIN_ID],
        },
      });

      return;
    }

    if (state.currentStep === PassportStep.photo) {
      dispatch({ type: PassportActionKind.NextStep });
      return;
    }

    if (state.currentStep === PassportStep.claim) {
      return;
    }

    if (state.currentStep === PassportStep.celebrate) {
      router.push('/passport');
      return;
    }

    dispatch({ type: PassportActionKind.NextStep });
  };

  return (
    <>
      <div className="md:hidden flex items-center gap-2 min-h-[64px] px-4 z-10">
        <Button icon="icon-logout" onClick={handlePrev} variant="tertiary" />
        <Button variant="secondary" className="w-full" onClick={handleNext}>
          {currentStep?.btnText}
        </Button>
      </div>

      <div className="hidden md:flex justify-between items-center min-h-[64px] px-4 bg-background/80 backdrop-blur-md">
        <div className="flex-1">
          <Button variant="tertiary" size="sm" onClick={handlePrev}>
            {state.currentStep === PassportStep.intro ? 'Exit' : 'Back'}
          </Button>
        </div>

        {PassportStep.intro !== state.currentStep && (
          <ul className="flex items-center justify-center flex-2 gap-1.5">
            {Object.entries(state.steps).map(([key, item]) => {
              const isActive = key === state.currentStep;
              return (
                <li key={key} className="flex items-center gap-1.5">
                  {item.label && <p className={twMerge('text-quaternary', isActive && 'text-primary')}>{item.label}</p>}
                  {item.label && (
                    <i className={twMerge('icon-chevron-right size-5 text-quaternary', isActive && 'text-primary')} />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-1 justify-end">
          <Button iconRight="icon-chevron-right" variant="secondary" size="sm" onClick={handleNext}>
            {currentStep?.btnText}
          </Button>
        </div>
      </div>
    </>
  );
}
