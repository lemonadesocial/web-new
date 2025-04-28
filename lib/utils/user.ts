import { createAvatar } from '@dicebear/core';
import * as thumbs from '@dicebear/thumbs';

import { User } from "$lib/generated/backend/graphql";

import { EDIT_KEY, generateUrl } from "./cnd";

export function userAvatar(user?: User | null, edits: keyof typeof EDIT_KEY = 'PROFILE') {
  if (user && user.new_photos_expanded?.[0]) {
    return generateUrl(user.new_photos_expanded[0], edits) || '';
  }

  if (user && user.image_avatar) {
    return user.image_avatar;
  }

  return randomUserImage(user?._id || '');
}

export function randomUserImage(id?: string): string {
  const avatar = createAvatar(thumbs, {
    seed: id,
    flip: false,
    rotate: 0,
    scale: 100,
    radius: 0,
    size: 64,
    backgroundColor: ['b6e3f4', 'd1d4f9', 'f1f4dc', 'ffd5dc', 'ffdfbf'],
    backgroundType: ['gradientLinear'],
    backgroundRotation: [-90],
    translateX: 0,
    translateY: 0,
    clip: false,
    eyes: ['variant2W16', 'variant3W16', 'variant4W16', 'variant5W16', 'variant6W16', 'variant7W16', 'variant8W16', 'variant9W16'],
    eyesColor: ['000000'],
    face: ['variant1'],
    mouth: ['variant1', 'variant2', 'variant3', 'variant4'],
    mouthColor: ['000000'],
    shapeColor: ['transparent'],
  });

  return avatar.toDataUri();
}
