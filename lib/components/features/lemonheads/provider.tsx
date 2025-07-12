'use client';
import React from 'react';
import { groupBy, merge } from 'lodash';

import { Filter, findConflictTraits, layerings } from '$lib/services/lemonhead/core';
import lemonHead from '$lib/trpc/lemonheads';
import { LemonHeadsLayer, TraitExtends, LemonHeadsColor, Gender } from '$lib/trpc/lemonheads/types';

import { LemonHeadGetStarted } from './steps/GetStarted';
import { LemonHeadAboutYou } from './steps/AboutYou';
import { LemonHeadCreate } from './steps/LemonHeadCreate';
import { ClaimLemonHead } from './steps/ClaimLemonHead';

export enum LemonHeadStep {
  'getstarted' = 'getstarted',
  'about' = 'about',
  'create' = 'create',
  'claim' = 'claim',
}

export type LemonHeadState = {
  steps: {
    [key: string]: {
      label?: string;
      component: React.FC;
      btnText?: string;
      mounted: boolean;
      hidePreview?: boolean;
    };
  };
  currentStep: LemonHeadStep;
  traits: TraitExtends[];
  resouces?: {
    [key: string]: TraitExtends[];
  };
  colorset: LemonHeadsColor[];
};

const defaultState: LemonHeadState = {
  steps: {
    getstarted: { label: '', component: LemonHeadGetStarted, btnText: 'Get Started', mounted: true },
    about: { label: 'About You', component: LemonHeadAboutYou, btnText: 'Enter Customizer', mounted: false },
    create: { label: 'Create', component: LemonHeadCreate, btnText: 'Claim', mounted: false },
    claim: { label: 'Claim', component: ClaimLemonHead, btnText: 'Continue', mounted: false, hidePreview: true },
    // { key: 'collaborate', label: 'Collaborate', component: Collaborate, btnText: 'Continue' },
    // { key: 'celebrate', label: 'Celebrate', componenent: Celebrate, btnText: 'Continue' },
  },
  currentStep: LemonHeadStep.getstarted,
  traits: [],
  colorset: [],
};

export enum LemonHeadActionKind {
  'set_resources',
  'set_default_traits',
  'set_colorset',
  'set_trait',
  'remove_traits',
  'next_step',
  'prev_step',
}

export type LemonHeadAction = { type: LemonHeadActionKind; payload?: any };

export const LemonHeadContext = React.createContext(null);

export function LemonHeadProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = React.useReducer(reducers, defaultState);
  const value: any = React.useMemo(() => [state, dispatch], [state]);

  return <LemonHeadContext.Provider value={value}>{children}</LemonHeadContext.Provider>;
}

export function useLemonHeadContext(): [state: LemonHeadState, dispatch: React.Dispatch<LemonHeadAction>] {
  const context = React.useContext(LemonHeadContext);
  if (!context) throw new Error('useLemonHeadContext must be used within a LemonHeadProvider');

  return context;
}

function reducers(state: LemonHeadState, action: LemonHeadAction) {
  switch (action.type) {
    case LemonHeadActionKind.set_resources: {
      return { ...state, resouces: { ...state.resouces, ...groupBy(action.payload.data, 'type') } };
    }
    case LemonHeadActionKind.set_default_traits: {
      const data = action.payload.data;
      const traitSet = lemonHead.trait.getDefaultSet(data)[data.gender as Gender];
      const traits = Object.entries(traitSet).map(([key, item]) => {
        const trait = lemonHead.trait.getTraitFilter({ type: key, ...item });
        return lemonHead.trait.getTrait({ resouces: state.resouces, data: trait });
      });

      return { ...state, traits };
    }

    case LemonHeadActionKind.set_trait: {
      const { data } = action.payload;
      let traits = [...state.traits];

      const conflicts = findConflictTraits(traits, data);
      if (conflicts.length) traits = traits.filter((i) => !conflicts.map((c) => c.type).includes(i.type));

      const idx = traits.findIndex((item) => item.type === data.type);
      if (idx !== -1) traits[idx] = data;
      else traits.push(data);
      return { ...state, traits };
    }

    case LemonHeadActionKind.remove_traits: {
      const traits = state.traits.filter((item) => !action.payload.data?.includes(item.type));
      return { ...state, traits };
    }

    case LemonHeadActionKind.set_colorset: {
      return { ...state, colorset: action.payload.data };
    }

    case LemonHeadActionKind.next_step: {
      if (state.currentStep === LemonHeadStep.getstarted) {
        const step = { about: { ...state.steps[LemonHeadStep.about], mounted: true } };
        return { ...state, steps: merge(state.steps, step), currentStep: LemonHeadStep.about };
      }
      if (state.currentStep === LemonHeadStep.about) {
        const step = { create: { ...state.steps[LemonHeadStep.create], mounted: true } };
        return { ...state, steps: merge(state.steps, step), currentStep: LemonHeadStep.create };
      }
      if (state.currentStep === LemonHeadStep.create) {
        const step = { claim: { ...state.steps[LemonHeadStep.claim], mounted: true } };
        return { ...state, steps: merge(state.steps, step), currentStep: LemonHeadStep.claim };
      }
      return state;
    }

    case LemonHeadActionKind.prev_step: {
      let obj = { ...state };
      if (state.currentStep === LemonHeadStep.about) {
        const about = { ...obj.steps[LemonHeadStep.about], mounted: false };
        obj = { ...obj, steps: merge(state.steps, about), currentStep: LemonHeadStep.getstarted };
      }
      if (state.currentStep === LemonHeadStep.create) {
        const step = { create: { ...obj.steps[LemonHeadStep.create], mounted: false } };
        obj = { ...obj, steps: merge(state.steps, step), currentStep: LemonHeadStep.getstarted };
      }
      if (state.currentStep === LemonHeadStep.claim) {
        const step = { claim: { ...obj.steps[LemonHeadStep.claim], mounted: false } };
        obj = { ...obj, steps: merge(state.steps, step), currentStep: LemonHeadStep.create };
      }
      return obj;
    }

    default:
      return state;
  }
}

export async function tranformTrait(data: LemonHeadsLayer) {
  const filters: Filter[] = [];
  layerings[data.type].filterTypes.forEach((key) => filters.push({ type: key, value: data[key] }));

  return {
    _id: data._id,
    type: data.type,
    value: data.name,
    filters,
    image: data.file,
  } as TraitExtends;
}
