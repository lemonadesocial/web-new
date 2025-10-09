'use client';
import React from 'react';

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
    };
  };
  currentStep: PassportStep;
  useLemonhead: boolean;
  useFluffle: boolean;
  useUsername: boolean;
  useENS: boolean;
};

const defaultState: PassportState = {
  steps: {
    intro: { label: '', component: PassportIntro, btnText: 'Yes, I\'m In!' },
    photo: { label: 'Passport Photo', component: PassportPhoto, btnText: 'Continue' },
    username: { label: 'Username', component: PassportUsername, btnText: 'Claim Passport' },
    celebrate: { label: 'Celebrate', component: PassportCelebrate, btnText: 'View Passport' },
  },
  currentStep: PassportStep.intro,
  useLemonhead: true,
  useFluffle: false,
  useUsername: true,
  useENS: false,
};

export enum PassportActionKind {
  NextStep = 'NEXT_STEP',
  PrevStep = 'PREV_STEP',
  SelectLemonhead = 'SELECT_LEMONHEAD',
  SelectFluffle = 'SELECT_FLUFFLE',
  SelectUsername = 'SELECT_USERNAME',
  SelectENS = 'SELECT_ENS',
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

    case PassportActionKind.SelectUsername: {
      return { ...state, useUsername: true, useENS: false };
    }

    case PassportActionKind.SelectENS: {
      return { ...state, useUsername: false, useENS: true };
    }

    default:
      return state;
  }
}

