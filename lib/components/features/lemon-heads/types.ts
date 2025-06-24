import { LemonHeadAccessory } from '$lib/lemon-heads/types';

export type LemonHeadValues = {
  gender: 'male' | 'female';
  body: 'human' | 'alien';
  size: 'small' | 'medium' | 'large' | 'extra_large';
  skin_tone: string;
  eyes?: LemonHeadAccessory;
  mouth?: LemonHeadAccessory;
  hair?: LemonHeadAccessory;
  facial_hair?: LemonHeadAccessory;
};
