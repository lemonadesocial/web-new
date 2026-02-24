'use client';
import React from 'react';
import { PassportActionKind, PassportConfig, PassportState, PassportStep } from './types';
import { match } from 'ts-pattern';

export type PassportAction = { type: PassportActionKind; payload?: unknown };

export const PassportContext = React.createContext(null);

export function PassportProvider({
  children,
  value: defaultState,
}: React.PropsWithChildren & { value: PassportState }) {
  const [state, dispatch] = React.useReducer(reducers, defaultState);
  const value = React.useMemo(() => [state, dispatch] as const, [state]);

  return <PassportContext.Provider value={value}>{children}</PassportContext.Provider>;
}

export function usePassportContext(): [state: PassportConfig, dispatch: React.Dispatch<PassportAction>] {
  const context = React.useContext(PassportContext);
  if (!context) throw new Error('usePassportContext must be used within a PassportProvider');

  return context;
}

function reducers(state: PassportState, action: PassportAction) {
  const { type, payload } = action;

  switch (type) {
    case PassportActionKind.NextStep:
      return match(state.currentStep)
        .with(PassportStep.intro, () => ({ ...state, currentStep: PassportStep.photo }))
        .with(PassportStep.photo, () => ({ ...state, currentStep: PassportStep.username }))
        .with(PassportStep.username, () => ({ ...state, currentStep: PassportStep.celebrate }))
        .otherwise(() => state);

    case PassportActionKind.PrevStep:
      return match(state.currentStep)
        .with(PassportStep.celebrate, () => ({ ...state, currentStep: PassportStep.username }))
        .with(PassportStep.username, () => ({ ...state, currentStep: PassportStep.photo }))
        .with(PassportStep.photo, () => ({ ...state, currentStep: PassportStep.intro }))
        .otherwise(() => state);

    case PassportActionKind.SelectLemonhead: {
      return { ...state, useLemonhead: true, useFluffle: false };
    }

    case PassportActionKind.SelectFluffle: {
      return { ...state, useLemonhead: false, useFluffle: true };
    }

    case PassportActionKind.SetFluffleTokenId: {
      return { ...state, fluffleTokenId: action.payload };
    }

    case PassportActionKind.SetLemonadeUsername: {
      return { ...state, lemonadeUsername: action.payload, useENS: false };
    }

    case PassportActionKind.SelectENS: {
      return { ...state, lemonadeUsername: '', useENS: true };
    }

    case PassportActionKind.SetSelfVerified:
      return { ...state, isSelfVerified: action.payload };

    case PassportActionKind.SetEnsName:
      return { ...state, ensName: action.payload };

    case PassportActionKind.SetMintData:
      return { ...state, mintData: { ...state.mintData, ...action.payload } };

    case PassportActionKind.SetPhoto:
      return { ...state, photo: action.payload };

    case PassportActionKind.SetPassportImage:
      return { ...state, passportImage: action.payload };

    case PassportActionKind.SetMintState:
      return { ...state, mintState: { ...state.mintState, ...action.payload } };

    default:
      return state;
  }
}
