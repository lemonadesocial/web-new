'use client';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import React from 'react';

import { Button, modal } from '$lib/components/core';

import { PassportActionKind, PassportStep, usePassportContext } from './provider';
import { ConnectWallet } from '../../modals/ConnectWallet';
import { useAtomValue } from 'jotai';
import { chainsMapAtom } from '$lib/jotai';
import { BeforeMintPassportModal } from './modals/BeforeMintPassportModal';
import { match } from 'ts-pattern';
import { MintPassportModal } from './modals/MintPassportModal';
import { PASSPORT_CHAIN_ID } from './utils';

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
    match(state.currentStep)
      .with(PassportStep.intro, () => {
        modal.open(ConnectWallet, {
          props: {
            onConnect: () => {
              dispatch({ type: PassportActionKind.NextStep });
            },
            chain: chainsMap[PASSPORT_CHAIN_ID],
          },
        });
      })
      .with(PassportStep.username, () => {        
        modal.open(BeforeMintPassportModal, {
          props: {
            onContinue: () => {
              modal.open(MintPassportModal, {
                props: { 
                  onComplete: () => dispatch({ type: PassportActionKind.NextStep }),
                  mintData: state.mintData!,
                },
              });
            },
          },
        });
      })
      .otherwise(() => dispatch({ type: PassportActionKind.NextStep }));
  };

  const disabled = (state.currentStep === PassportStep.photo && !state.photo) || (state.currentStep === PassportStep.username && !state.mintData);

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
            {Object.entries(state.steps).map(([key, item], idx) => {
              const isActive = idx <= currentStep.index;
              return (
                <li key={key} className="flex items-center gap-1.5">
                  {item.label && <p className={twMerge('text-quaternary', isActive && 'text-primary')}>{item.label}</p>}
                  {item.label && idx < Object.entries(state.steps).length - 1 && (
                    <i className={twMerge('icon-chevron-right size-5 text-quaternary', isActive && 'text-primary')} />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-1 justify-end">
          <Button iconRight="icon-chevron-right" disabled={disabled} variant="secondary" size="sm" onClick={handleNext}>
            {currentStep?.btnText}
          </Button>
        </div>
      </div>
    </>
  );
}
