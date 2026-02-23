'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';
import { useAtomValue } from 'jotai';
import * as Sentry from '@sentry/nextjs';

import { chainsMapAtom } from '$lib/jotai';

import { Button, modal, toast } from '$lib/components/core';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';

import { MAPPING_PASSPORT_STEPS } from './config';
import { usePassportContext } from './provider';
import { PassportActionKind, PassportStep } from './types';
import { PassportEligibilityModal } from './modals/PassportEligibilityModal';
import { MAPPING_PROVIDER, PASSPORT_CHAIN_ID } from './utils';
import { useRouter } from 'next/navigation';
import { BeforeMintPassportModal } from './modals/BeforeMintPassportModal';
import { MintPassportModal } from './modals/MintPassportModal';
import { useAppKitAccount } from '@reown/appkit/react';
import { formatError } from '$lib/utils/crypto';
import { usePassportChain } from '$lib/hooks/usePassportChain';

export function Footer() {
  const chainsMap = useAtomValue(chainsMapAtom);
  const router = useRouter();

  const { address } = useAppKitAccount();
  const [isMinting, setIsMinting] = React.useState(false);

  const [state, dispatch] = usePassportContext();
  const chain = usePassportChain(state.provider);

  const checkLemonhead = () => {
    if (state.enabled?.shouldMintedLemonhead) {
      modal.open(PassportEligibilityModal.CheckMintedLemonheadModal, {
        props: {
          provider: state.provider,
          onContinue: () => {
            canAccess();
          },
        },
      });
    } else {
      canAccess();
    }
  };

  const canAccess = () => {
    if (state.enabled?.whitelist) {
      modal.open(PassportEligibilityModal.CheckWhiteListModal, {
        props: {
          provider: state.provider,
          passportTitle: state.passportTitle,
          onContinue: () => {
            dispatch({ type: PassportActionKind.NextStep });
          },
        },
      });
    } else {
      dispatch({ type: PassportActionKind.NextStep });
    }
  };

  const handleNext = () => {
    match(state.currentStep)
      .with(PassportStep.intro, () => {
        modal.open(ConnectWallet, {
          props: {
            onConnect: () => {
              checkLemonhead();
            },
            chain: chainsMap[PASSPORT_CHAIN_ID],
          },
        });
      })
      .with(PassportStep.username, () => {
        modal.open(ConnectWallet, {
          props: {
            onConnect: () => {
              handleMint();
            },
            chain: chain,
          },
        });
      })
      .with(PassportStep.celebrate, () => {
        // router.push('/lemonheads');
      })
      .otherwise(() => dispatch({ type: PassportActionKind.NextStep }));
  };

  const handlePrev = () => {
    if (state.currentStep === PassportStep.intro) {
      router.back();
      return;
    }
    dispatch({ type: PassportActionKind.PrevStep });
  };

  const handleMint = async () => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    setIsMinting(true);

    try {
      let query = `wallet=${address}&provider=${MAPPING_PROVIDER[state.provider]}`;
      if (state.photo) {
        query += `&avatar=${encodeURIComponent(state.photo)}`;
      }

      if (state.lemonadeUsername) {
        query += `&username=${encodeURIComponent(state.lemonadeUsername)}`;
      } else if (state.useENS && state.ensName) {
        query += `&username=${encodeURIComponent(state.ensName)}`;
      }
      
      if (state.useFluffle && state.fluffleTokenId) {
        query += `&fluffleTokenId=${encodeURIComponent(state.fluffleTokenId)}`;
      }

      const response = await fetch(`/api/passport/${state.provider}?${query}`);
      const data = await response.json();

      if (!response.ok) {
        const message = data?.message ?? data?.error ?? `Request failed (${response.status})`;
        throw new Error(message);
      }

      dispatch({ type: PassportActionKind.SetMintData, payload: data });

      modal.open(BeforeMintPassportModal, {
        props: {
          config: state.modal.beforeMint,
          onContinue: () => {
            modal.open(MintPassportModal, {
              props: {
                provider: state.provider,
                passportImage: state.passportImage,
                onComplete: (txHash, tokenId) => {
                  dispatch({ type: PassportActionKind.SetMintState, payload: { txHash, tokenId } });
                  dispatch({ type: PassportActionKind.NextStep });
                },
                mintData: data,
              },
            });
          },
        },
      });
    } catch (error: any) {
      Sentry.captureException(error);
      toast.error(error.message);
    } finally {
      setIsMinting(false);
    }
  };

  const disabled = match(state.currentStep)
    .with(PassportStep.photo, () => !state.photo)
    .with(PassportStep.username, () => {
      if (state.enabled?.lemonadeUsername) return !state.lemonadeUsername;
      else if (state.enabled?.ens) return !state.ensName;
      else return false;
    })
    .otherwise(() => false);

  const btnText = state.ui?.[state.currentStep!]?.footer?.btnText;

  return (
    <>
      <div className="md:hidden flex items-center gap-2 min-h-[64px] px-4 z-10">
        {state.currentStep !== PassportStep.celebrate && (
          <Button icon="icon-logout" onClick={handlePrev} variant="tertiary" />
        )}
        <Button variant="secondary" className="w-full" onClick={handleNext}>
          {btnText}
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
            {(Object.keys(MAPPING_PASSPORT_STEPS) as PassportStep[]).map((key, idx) => {
              const footerConf = state.ui?.[key]?.footer;
              const isActive = idx <= (state.ui?.[state.currentStep!]?.footer?.index || 0);
              return (
                <li key={key} className="flex items-center gap-1.5">
                  {footerConf?.label && (
                    <p className={twMerge('text-quaternary', isActive && 'text-primary')}>{footerConf.label}</p>
                  )}
                  {footerConf?.label && idx < Object.entries(MAPPING_PASSPORT_STEPS).length - 1 && (
                    <i className={twMerge('icon-chevron-right size-5 text-quaternary', isActive && 'text-primary')} />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-1 justify-end">
          <Button
            iconRight="icon-chevron-right"
            loading={isMinting}
            disabled={disabled}
            variant="secondary"
            size="sm"
            onClick={handleNext}
          >
            {btnText}
          </Button>
        </div>
      </div>
    </>
  );
}
