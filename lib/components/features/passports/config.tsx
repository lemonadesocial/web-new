'use client';

import React from 'react';

import { MintPassportProvider } from './mint/provider';
import { PassportFooter as MintPassportFooter } from './mint/footer';
import { MintPassportContent } from './mint/content';
import * as mint from './mint/steps';

import { PassportFooter as ZugramaPassportFooter } from './zugrama/footer';
import { ZugramaPassportContent } from './zugrama/content';
import { PassportProvider as ZugramaPassportProvider } from './zugrama/provider';
import * as zugrama from './zugrama/steps';

export type PASSPORT_PROVIDER = 'mint' | 'zugrama';

export interface PassportConfig {
  steps: {
    [key: string]: {
      label?: string;
      component: () => React.ReactElement;
      btnText?: string;
      index: number;
    };
  };
  provider: React.FC<any>;
  content: () => React.ReactElement;
  footer: () => React.ReactElement;
}

export const PASSPORT_CONFIG: Record<PASSPORT_PROVIDER, PassportConfig> = {
  mint: {
    steps: {
      intro: { label: '', component: mint.PassportIntro, btnText: "Yes, I'm In!", index: 0 },
      photo: { label: 'Passport Photo', component: mint.PassportPhoto, btnText: 'Continue', index: 1 },
      username: { label: 'Username', component: mint.PassportUsername, btnText: 'Claim Passport', index: 2 },
      celebrate: { label: 'Celebrate', component: mint.PassportCelebrate, btnText: 'LemonHeads Zone', index: 3 },
    },
    provider: MintPassportProvider,
    content: MintPassportContent,
    footer: MintPassportFooter,
  },
  zugrama: {
    steps: {
      intro: { label: '', component: zugrama.PassportIntro, btnText: "Yes, I'm In!", index: 0 },
      photo: { label: 'Passport Photo', component: zugrama.PassportPhoto, btnText: 'Continue', index: 1 },
      username: { label: 'Username', component: zugrama.PassportUsername, btnText: 'Claim Passport', index: 2 },
      celebrate: { label: 'Celebrate', component: zugrama.PassportCelebrate, btnText: 'Done', index: 3 },
    },
    provider: ZugramaPassportProvider,
    content: ZugramaPassportContent,
    footer: ZugramaPassportFooter,
  },
};
