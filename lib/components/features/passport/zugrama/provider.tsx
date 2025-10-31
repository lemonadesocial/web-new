'use client';
import React from 'react';

import { PassportIntro, PassportPhoto, PassportCelebrate, PassportUsername } from './steps';

export enum PassportStep {
  'intro' = 'intro',
  'photo' = 'photo',
  'username' = 'username',
  'celebrate' = 'celebrate',
}

export type PassportState = {
  steps: {
    [key: string]: {
      label?: string;
      component: React.FC;
      btnText?: string;
      index: number;
    };
  };
  currentStep: PassportStep;

  photo: string;
  isSelfVerified: boolean;

  ensName: string;

  passportImage: string;
  mintData?: {
    signature: string;
    price: string;
    metadata: string;
  };
  mintState?: {
    txHash: string;
    tokenId: string;
  };
};

const defaultState: PassportState = {
  steps: {
    intro: { label: '', component: PassportIntro, btnText: "Yes, I'm In!", index: 0 },
    photo: { label: 'Passport Photo', component: PassportPhoto, btnText: 'Continue', index: 1 },
    username: { label: 'Username', component: PassportUsername, btnText: 'Claim Passport', index: 2 },
    celebrate: { label: 'Celebrate', component: PassportCelebrate, btnText: 'LemonHeads Zone', index: 3 },
  },
  currentStep: PassportStep.intro,

  photo: '',
  isSelfVerified: false,
  ensName: '',
  passportImage: '',
  mintData: undefined,
  mintState: undefined,
};

export enum PassportActionKind {
  NextStep = 'NEXT_STEP',
  PrevStep = 'PREV_STEP',
  SetPhoto = 'SET_PHOTO',
  SetSelfVerified = 'SET_SELF_VERIFIED',
  SetEnsName = 'SET_ENS_NAME',

  SetMintData = 'SET_MINT_DATA',
  SetPassportImage = 'SET_PASSPORT_IMAGE',
  SetMintState = 'SET_MINT_STATE',
}

export type PassportAction = { type: PassportActionKind; payload?: any };

export const PassportContext = React.createContext(null);

export function PassportProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = React.useReducer(reducers, defaultState);
  const value: any = React.useMemo(() => [state, dispatch], [state]);

  return <PassportContext.Provider value={value}>{children}</PassportContext.Provider>;
}

export function usePassportContext(): [state: PassportState, dispatch: React.Dispatch<PassportAction>] {
  const context = React.useContext(PassportContext);
  if (!context) throw new Error('usePassportContext must be used within a PassportProvider');

  return context;
}

function reducers(state: PassportState, action: PassportAction) {
  switch (action.type) {
    case PassportActionKind.NextStep: {
      if (state.currentStep === PassportStep.intro) {
        return { ...state, currentStep: PassportStep.photo };
      }
      if (state.currentStep === PassportStep.photo) {
        return { ...state, currentStep: PassportStep.username };
      }
      if (state.currentStep === PassportStep.username) {
        return { ...state, currentStep: PassportStep.celebrate };
      }
      return state;
    }

    case PassportActionKind.PrevStep: {
      if (state.currentStep === PassportStep.photo) {
        return { ...state, currentStep: PassportStep.intro };
      }
      if (state.currentStep === PassportStep.username) {
        return { ...state, currentStep: PassportStep.photo };
      }
      if (state.currentStep === PassportStep.celebrate) {
        return { ...state, currentStep: PassportStep.username };
      }
      return state;
    }

    case PassportActionKind.SetMintData:
      return { ...state, mintData: action.payload };

    case PassportActionKind.SetPhoto:
      return { ...state, photo: action.payload };

    case PassportActionKind.SetSelfVerified:
      return { ...state, isSelfVerified: action.payload };

    case PassportActionKind.SetEnsName:
      return { ...state, ensName: action.payload };

    case PassportActionKind.SetPassportImage:
      return { ...state, passportImage: action.payload };

    case PassportActionKind.SetMintState:
      return { ...state, mintState: { ...state.mintState, ...action.payload } };

    default:
      return state;
  }
}
