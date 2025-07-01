import { TraitType } from '$lib/services/lemonhead/core';

export type LemonHeadsPageInfo = {
  isFirstPage: boolean;
  isLastPage: boolean;
  page: number;
  pageSize: number;
  totalRows: number;
};

type Gender = 'male' | 'female';
export type BodySize = 'small' | 'medium' | 'large' | 'extra_large';
type Race = 'human' | 'alien';

export type LemonHeadsLayer = {
  Id: number;
  name: string;
  type: TraitType;
  art_style?: string | null;
  skin_tone: 'brown' | 'tan' | 'light' | 'dark';
  gender: Gender;
  size: BodySize;
  race: Race;
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
