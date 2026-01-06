'use client';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';
import { useAtomValue } from 'jotai';

import { chainsMapAtom } from '$lib/jotai';

import { Button, modal } from '$lib/components/core';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';

import { MAPPING_PASSPORT_STEPS } from './config';
import { usePassportContext } from './provider';
import { PassportActionKind, PassportStep } from './types';
import { PassportEligibilityModal } from './modals/PassportEligibilityModal';
import { PASSPORT_CHAIN_ID } from './utils';
import { useRouter } from 'next/navigation';
import { BeforeMintPassportModal } from './modals/BeforeMintPassportModal';
import { MintPassportModal } from './modals/MintPassportModal';

export function Footer() {
  const chainsMap = useAtomValue(chainsMapAtom);
  const router = useRouter();

  const [state, dispatch] = usePassportContext();

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
            chain: chainsMap[PASSPORT_CHAIN_ID],
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

  const handleMint = () => {
    modal.open(BeforeMintPassportModal, {
      props: {
        config: state.modal.beforeMint,
        onContinue: () => {
          modal.open(MintPassportModal, {
            props: {
              provider: state.provider,
              onComplete: (txHash, tokenId) => {
                dispatch({ type: PassportActionKind.SetMintState, payload: { txHash, tokenId } });
                dispatch({ type: PassportActionKind.NextStep });
              },
              mintData: state.mintData!,
            },
          });
        },
      },
    });
  };

  const disabled = match(state.currentStep)
    .with(PassportStep.photo, () => !state.photo)
    .with(PassportStep.username, () => {
      if (state.enabled?.lemonadeUsername) return !state.lemonadeUsername && state.enabled?.ens && !state.ensName;
      else return state.enabled?.ens && !state.ensName;
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
          <Button iconRight="icon-chevron-right" disabled={disabled} variant="secondary" size="sm" onClick={handleNext}>
            {btnText}
          </Button>
        </div>
      </div>
    </>
  );
}
