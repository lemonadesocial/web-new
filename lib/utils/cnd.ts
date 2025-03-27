import { File } from '$lib/generated/backend/graphql';

export interface EditProps {
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    background?: {
      r?: number;
      g?: number;
      b?: number;
      alpha?: number;
    };
    flatten?: boolean;
    grayscale?: boolean;
    flip?: boolean;
    flop?: boolean;
    negate?: boolean;
    normalise?: boolean;
    smartCrop?: {
      faceIndex?: number;
      padding?: number;
    };
  };
}

export enum EDIT_KEY {
  EVENT_PHOTO = 'EVENT_PHOTO',
  PROFILE = 'PROFILE',
  TICKET_PHOTO = 'TICKET_PHOTO',
}

const EDIT_MAP: Record<string, EditProps> = {
  [EDIT_KEY.EVENT_PHOTO]: { resize: { height: 540, fit: 'cover' } },
  [EDIT_KEY.PROFILE]: { resize: { height: 48, width: 48, fit: 'cover' } },
  [EDIT_KEY.TICKET_PHOTO]: {
    resize: { width: 135, fit: 'cover' },
  },
};

export function generateUrl(file?: File | null, edits?: keyof typeof EDIT_KEY | EditProps) {
  if (!file || !file.bucket || !file.key) return '';

  if (file.type === 'image/gif') {
    return file.url || '';
  }

  const url = file.bucket.includes('eu-west-1')
    ? 'https://images.staging.lemonade.social'
    : 'https://images.lemonade.social';

  const params: Record<string, unknown> = {
    bucket: file.bucket,
    key: file.key,
  };

  if (typeof edits === 'string') {
    params.edits = EDIT_MAP[edits];
  } else if (edits) {
    params.edits = edits;
  }

  return `${url}/${btoa(JSON.stringify(params))}`;
}
