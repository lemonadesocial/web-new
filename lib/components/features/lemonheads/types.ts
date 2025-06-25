import { LemonHeadAttachment } from '$lib/lemonheads/types';

export type LemonHeadValues = {
  gender: 'male' | 'female';
  body: 'human' | 'alien';
  size: 'small' | 'medium' | 'large' | 'extra_large';
  skin_tone: { value: string; color: string };
  eyes?: { Id: number; attachment: LemonHeadAttachment[] };
  mouth?: { Id: number; attachment: LemonHeadAttachment[] };
  hair?: { Id: number; attachment: LemonHeadAttachment[] };
  facial_hair?: { Id: number; attachment: LemonHeadAttachment[] };
  top?: { Id: number; attachment: LemonHeadAttachment[] };
  bottom?: { Id: number; attachment: LemonHeadAttachment[] };
  outfit?: { Id: number; attachment: LemonHeadAttachment[] };
  eyewear?: { Id: number; attachment: LemonHeadAttachment[] };
  mouthgear?: { Id: number; attachment: LemonHeadAttachment[] };
  headgear?: { Id: number; attachment: LemonHeadAttachment[] };
  footwear?: { Id: number; attachment: LemonHeadAttachment[] };
  background?: { Id: number; attachment: LemonHeadAttachment[] };
  pets?: { Id: number; attachment: LemonHeadAttachment[] };
};
