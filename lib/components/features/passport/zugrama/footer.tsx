'use client';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';
import { useAtomValue } from 'jotai';
import * as Sentry from '@sentry/nextjs';
import React from 'react';

import { Button, modal, toast } from '$lib/components/core';
import { chainsMapAtom } from '$lib/jotai';
import { useAppKitAccount } from '$lib/utils/appkit';
import { formatError } from '$lib/utils/crypto';

import { PassportActionKind, PassportStep, usePassportContext } from './provider';
import { ConnectWallet } from '../../modals/ConnectWallet';
import { BeforeMintPassportModal } from './modals/BeforeMintPassportModal';
import { MintPassportModal } from './modals/MintPassportModal';
import { PASSPORT_CHAIN_ID } from './utils';
import { PassportEligibilityModal } from './modals/PassportEligibilityModal';

export function PassportFooter() {
  const router = useRouter();
  const [state, dispatch] = usePassportContext();
  const chainsMap = useAtomValue(chainsMapAtom);
  const { address } = useAppKitAccount();
  const [isMinting, setIsMinting] = React.useState(false);

  const currentStep = state.steps[state.currentStep];

  const handlePrev = () => {
    if (state.currentStep === PassportStep.intro) {
      router.back();
      return;
    }
    dispatch({ type: PassportActionKind.PrevStep });
  };

  const checkAccess = () => {
    modal.open(PassportEligibilityModal, {
      props: {
        onContinue: () => {
          dispatch({ type: PassportActionKind.NextStep });
        },
      },
    });
  }

  const handleMint = async () => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    setIsMinting(true);
    try {
      const response = await fetch(
        `/api/passport/zugrama?wallet=${address}&avatar=${encodeURIComponent(state.photo)}`
      );

      const mintData = await response.json();

      dispatch({ type: PassportActionKind.SetMintData, payload: mintData });

      modal.open(BeforeMintPassportModal, {
        props: {
          onContinue: () => {
            modal.open(MintPassportModal, {
              props: {
                onComplete: (txHash, tokenId) => {
                  dispatch({ type: PassportActionKind.SetMintState, payload: { txHash, tokenId } });
                  dispatch({ type: PassportActionKind.NextStep });
                },
                mintData: mintData,
              },
            });
          },
        },
      });
    } catch (error) {
      Sentry.captureException(error);
      toast.error(formatError(error));
    } finally {
      setIsMinting(false);
    }
  }

  const handleNext = async () => {
    match(state.currentStep)
      .with(PassportStep.intro, () => {
        modal.open(ConnectWallet, {
          props: {
            onConnect: () => {
              checkAccess();
            },
            chain: chainsMap[PASSPORT_CHAIN_ID],
          },
        });
      })
      .with(PassportStep.username, () => {
        handleMint();
      })
      .with(PassportStep.celebrate, () => {
        router.push('/');
      })
      .otherwise(() => dispatch({ type: PassportActionKind.NextStep }));
  };

  const disabled = (state.currentStep === PassportStep.photo && (!state.photo || !state.isSelfVerified)) || (state.currentStep === PassportStep.username && !state.ensName);

  return (
    <>
      <div className="md:hidden flex items-center gap-2 min-h-[64px] px-4 z-10">
        {state.currentStep !== PassportStep.celebrate && (
          <Button icon="icon-logout" onClick={handlePrev} variant="tertiary" />
        )}
        <Button variant="secondary" className="w-full" onClick={handleNext} loading={isMinting}>
          {currentStep?.btnText}
        </Button>
      </div>

      <div className="hidden md:flex justify-between items-center min-h-[64px] px-4 bg-background/80 backdrop-blur-md">
        <div className="flex-1">
          {state.currentStep !== PassportStep.celebrate && (
            <Button variant="tertiary" size="sm" onClick={handlePrev}>
              {state.currentStep === PassportStep.intro ? 'Exit' : 'Back'}
            </Button>
          )}
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
          <Button iconRight="icon-chevron-right" disabled={disabled} variant="secondary" size="sm" onClick={handleNext} loading={isMinting}>
            {currentStep?.btnText}
          </Button>
        </div>
      </div>
    </>
  );
}
