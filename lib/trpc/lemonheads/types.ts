import { Trait, TraitType } from '$lib/services/lemonhead/core';

export type LemonHeadsPageInfo = {
  isFirstPage: boolean;
  isLastPage: boolean;
  page: number;
  pageSize: number;
  totalRows: number;
};

/**
 * @description data layer from nocodb
 * */
export type SkinTone = 'brown' | 'tan' | 'light' | 'dark';
export type Gender = 'male' | 'female';
export type BodyRace = 'human' | 'alien';
export type BodySize = 'small' | 'medium' | 'large' | 'extra_large';

export type LemonHeadsLayer = {
  Id: number;
  name: string;
  type: TraitType;
  art_style?: string | null;
  skin_tone: SkinTone;
  gender: Gender;
  size: BodySize;
  race: BodyRace;
  color: any | null;
  attachment: LemonHeadsAttachment[];
};

export type LemonHeadsThumnail = {
  card_cover: {
    signedUrl: string;
  };
  small: {
    signedUrl: string;
  };
  tiny: {
    signedUrl: string;
  };
};

export type LemonHeadsAttachment = {
  url: string;
  height: number;
  id: string;
  mimetype: string;
  signedUrl: string;
  size: number;
  title: 'alien.png';
  width: number;
  thumbnails: LemonHeadsThumnail;
};

export type LemonHeadsColor = { name: string; value: { key: string; value: string }[] };

export type TraitExtends = Trait & { Id?: string | number; image?: string };
