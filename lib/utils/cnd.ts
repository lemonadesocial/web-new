import { File } from '$lib/generated/graphql';

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
  SPACE_IMAGE_COVER,
}

const EDIT_MAP: Record<string, EditProps> = {};

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
