import { createAvatar } from '@dicebear/core';
import * as glass from '@dicebear/glass';

import { generateUrl } from "./cnd";
import { Space } from "$lib/graphql/generated/backend/graphql";

export const communityAvatar = (community?: Space | null) => {
  if (!community || !community?.image_avatar_expanded) {
    return randomUserImage(community?._id);
  }

  return generateUrl(community?.image_avatar_expanded, { resize: { width: 384, height: 384, fit: 'contain' } });
};

export function randomCommunityImage(id?: string): string {
  const avatar = createAvatar(glass, {
    seed: id,
    flip: false,
    rotate: 0,
    scale: 100,
    radius: 0,
    size: 64,
    backgroundColor: ['4799eb', '47d0eb', '47ebeb', 'b6e3f4', 'c0aede', 'd1d4f9', 'ebd047', 'ffd5dc', 'ffdfbf'],
    backgroundType: ['gradientLinear'],
    backgroundRotation: [-90],
    translateX: 0,
    translateY: 0,
    shape1: ['a', 'd', 'e', 'g', 'i', 'n', 'r', 't'],
    shape2: ['a', 'd', 'e', 'g', 'i', 'n', 'r', 't'],
  });

  return avatar.toDataUri();
}
