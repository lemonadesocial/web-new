import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';
import * as thumbs from '@dicebear/thumbs';

import { User } from "$lib/graphql/generated/backend/graphql";

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

export function randomEventDP(id?: string) {
  const avatar = createAvatar(identicon, {
    seed: id,
    radius: 0,
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
    backgroundType: ['solid'],
    rowColor: ['00897b', '3949ab', '5e35b1', '6d4c41', '8e24aa', 'd81b60', 'e53935', 'f4511e'],
    row1: ['xoxox', 'oxxxo', 'xxoxx', 'xooox', 'xxxxx', 'oxoxo', 'ooxoo'],
    row2: ['xoxox', 'oxxxo', 'xxoxx', 'xooox', 'xxxxx', 'oxoxo', 'ooxoo'],
    row3: ['xoxox', 'oxxxo', 'xxoxx', 'xooox', 'xxxxx', 'oxoxo', 'ooxoo'],
    row4: ['xoxox', 'oxxxo', 'xxoxx', 'xooox', 'xxxxx', 'oxoxo', 'ooxoo'],
    row5: ['xoxox', 'oxxxo', 'xxoxx', 'xooox', 'xxxxx', 'oxoxo', 'ooxoo'],
  });

  return avatar.toDataUri();

}
