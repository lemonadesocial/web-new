import { File } from '$lib/graphql/generated/backend/graphql';
import { Trait, TraitType } from '$lib/services/lemonhead/core';

export type SkinTone = 'soft' | 'medium' | 'rich' | 'bold';
export type Gender = 'male' | 'female';
export type BodyRace = 'human' | 'alien';
export type BodySize = 'regular' | 'skinny' | 'toned' | 'large';

export type LemonHeadsLayer = {
  _id: number;
  name: string;
  type: TraitType;
  art_style?: string | null;
  skin_tone?: SkinTone;
  gender?: Gender;
  size?: BodySize;
  race?: BodyRace;
  color?: LemonHeadsColor | null;
  file: File;
};

export type LemonHeadsColor = { name: string; value: { key: string; value: string }[] };

export type TraitExtends = Trait & { _id?: string | number; image?: string };
