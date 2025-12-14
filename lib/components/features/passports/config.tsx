'use client';

import React from 'react';
import { Metadata } from 'next';
import { ASSET_PREFIX } from '$lib/utils/constants';

import { MintPassportProvider } from './mint/provider';
import { PassportFooter as MintPassportFooter } from './mint/footer';
import { MintPassportContent } from './mint/content';
import * as mint from './mint/steps';

import { PassportFooter as ZugramaPassportFooter } from './zugrama/footer';
import { ZugramaPassportContent } from './zugrama/content';
import { PassportProvider as ZugramaPassportProvider } from './zugrama/provider';
import * as zugrama from './zugrama/steps';

import { PassportFooter as VinylNationPassportFooter } from './vinyl-nation/footer';
import { VinylNationPassportContent } from './vinyl-nation/content';
import { PassportProvider as VinylNationPassportProvider } from './vinyl-nation/provider';
import * as vinylNation from './vinyl-nation/steps';

export type PASSPORT_PROVIDER = 'mint' | 'zugrama' | 'vinyl-nation';

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

export const PASSPORT_METADATA: { [key: string]: object } = {
  mint: {
    metadata: {
      title: 'Lemonade Passport',
      description: 'Claim your verified on-chain identity and unlock exclusive benefits across the Lemonade ecosystem.',
      openGraph: {
        images: `${ASSET_PREFIX}/assets/images/passports/passport-preview.jpg`,
      },
    },
  },
  zugrama: {
    metadata: {
      title: 'Zugrama Passport',
      description: 'Become part of a new world.',
      openGraph: {
        images: `${ASSET_PREFIX}/assets/images/passports/zugrama-passport-placeholder.png`,
      },
    },
  },
  'vinyl-nation': {
    metadata: {
      title: 'Vinyl Nation Passport',
      openGraph: {
        images: `${ASSET_PREFIX}/assets/images/passports/vinyl-nation-passport-placeholder.png`,
      },
    },
  },
};

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
  'vinyl-nation': {
    steps: {
      intro: { label: '', component: vinylNation.PassportIntro, btnText: "Yes, I'm In!", index: 0 },
      photo: { label: 'Passport Photo', component: vinylNation.PassportPhoto, btnText: 'Continue', index: 1 },
      username: { label: 'Username', component: vinylNation.PassportUsername, btnText: 'Claim Passport', index: 2 },
      celebrate: { label: 'Celebrate', component: vinylNation.PassportCelebrate, btnText: 'Done', index: 3 },
    },
    provider: VinylNationPassportProvider,
    content: VinylNationPassportContent,
    footer: VinylNationPassportFooter,
  },
};
