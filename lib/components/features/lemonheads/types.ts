import { Trait } from '$lib/services/lemonhead/core';
import { LemonHeadsLayer } from '$lib/trpc/lemonheads/types';

// export type LemonHeadBodyType = 'small' | 'medium' | 'large' | 'extra_large';

export type LemonHeadValues = {
  // gender: 'male' | 'female';
  // body: 'human' | 'alien';
  // size: LemonHeadBodyType;
  // skin_tone: { value: string; color: string };
  // eyes?: Partial<LemonHeadAccessory>;
  // mouth?: Partial<LemonHeadAccessory>;
  // hair?: Partial<LemonHeadAccessory>;
  // facial_hair?: Partial<LemonHeadAccessory>;
  // top?: Partial<LemonHeadAccessory>;
  // bottom?: Partial<LemonHeadAccessory>;
  // outfit?: Partial<LemonHeadAccessory>;
  // eyewear?: Partial<LemonHeadAccessory>;
  // mouthgear?: Partial<LemonHeadAccessory>;
  // headgear?: Partial<LemonHeadAccessory>;
  // footwear?: Partial<LemonHeadAccessory>;
  // background?: Partial<LemonHeadAccessory>;
  // pets?: Partial<LemonHeadAccessory>;
  // traits: Trait[];

  [key: string]: Trait & Partial<LemonHeadsLayer> & { filters: { [key: string]: string } };
};
