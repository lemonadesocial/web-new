export type LemonHeadPageInfo = {
  isFirstPage: boolean;
  isLastPage: boolean;
  page: number;
  pageSize: number;
  totalRows: number;
};

export type LemonHeadThumnail = {
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

export type LemonHeadAttachment = {
  url: string;
  height: number;
  id: string;
  mimetype: string;
  signedUrl: string;
  size: number;
  title: 'alien.png';
  width: number;
  thumbnails: LemonHeadThumnail;
};

type GenderType = 'male' | 'female';
type BodyType = 'small' | 'medium' | 'large' | 'extra_large';

export type LemonHeadBodyType = {
  Id: number;
  name: string;
  skin_tone: string;
  gender: GenderType;
  body_type: BodyType;
  attachment: LemonHeadAttachment[];
  origin: 'alien' | 'human';
  CreatedAt: string;
};

export type LemonHeadAccessory = {
  Id: number;
  name: string;
  skin_tone?: string | null;
  gender: GenderType;
  body_type: BodyType;
  attachment: LemonHeadAttachment[];
  type:
    | 'top'
    | 'bottom'
    | 'background'
    | 'earings'
    | 'eyes'
    | 'eyewear'
    | 'facial_hair'
    | 'footwear'
    | 'hair'
    | 'headgear'
    | 'mouth'
    | 'mouthgear'
    | 'outfit'
    | 'outfits';
};
