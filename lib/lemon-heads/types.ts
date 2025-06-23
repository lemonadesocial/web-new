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

export type LemonHeadBodyType = {
  Id: number;
  name: string;
  skin_tone: string;
  gender: 'male' | 'female';
  body_type: 'small' | 'medium' | 'large' | 'extra_large';
  attachment: LemonHeadAttachment[];
  origin: 'alien' | 'human';
  CreatedAt: string;
};
