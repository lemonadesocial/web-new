'use client';
import React, { useEffect } from 'react';

import { trpc } from '$lib/trpc/client';
import { PassportIntro, PassportPhoto, PassportClaim, PassportCelebrate, PassportUsername } from './steps';

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
  useLemonhead: boolean;
  useFluffle: boolean;
  lemonadeUsername: string;
  useENS: boolean;
  photo: string;
  passportImage: string;
  mintData?: {
    signature: string;
    price: string;
    metadata: string;
  };
};

const defaultState: PassportState = {
  steps: {
    intro: { label: '', component: PassportIntro, btnText: "Yes, I'm In!", index: 0 },
    photo: { label: 'Passport Photo', component: PassportPhoto, btnText: 'Continue', index: 1 },
    username: { label: 'Username', component: PassportUsername, btnText: 'Claim Passport', index: 2 },
    celebrate: { label: 'Celebrate', component: PassportCelebrate, btnText: 'View Passport', index: 3 },
  },
  currentStep: PassportStep.intro,
  useLemonhead: true,
  useFluffle: false,
  lemonadeUsername: '',
  useENS: false,
  photo: '',
  passportImage: '',
  mintData: undefined,
};

export enum PassportActionKind {
  NextStep = 'NEXT_STEP',
  PrevStep = 'PREV_STEP',
  SelectLemonhead = 'SELECT_LEMONHEAD',
  SelectFluffle = 'SELECT_FLUFFLE',
  SetLemonadeUsername = 'SET_LEMONADE_USERNAME',
  SelectENS = 'SELECT_ENS',
  SetMintData = 'SET_MINT_DATA',
  SetPhoto = 'SET_PHOTO',
  SetPassportImage = 'SET_PASSPORT_IMAGE',
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

    case PassportActionKind.SelectLemonhead: {
      return { ...state, useLemonhead: true, useFluffle: false };
    }

    case PassportActionKind.SelectFluffle: {
      return { ...state, useLemonhead: false, useFluffle: true };
    }

    case PassportActionKind.SetLemonadeUsername: {
      return { ...state, lemonadeUsername: action.payload, useENS: false };
    }

    case PassportActionKind.SelectENS: {
      return { ...state, lemonadeUsername: '', useENS: true };
    }

    case PassportActionKind.SetMintData:
      return { ...state, mintData: { ...state.mintData, ...action.payload } };

    case PassportActionKind.SetPhoto:
      return { ...state, photo: action.payload };

    case PassportActionKind.SetPassportImage:
      return { ...state, passportImage: action.payload };

    default:
      return state;
  }
}
