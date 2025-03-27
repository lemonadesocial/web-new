import { User } from "$lib/generated/backend/graphql";
import { EDIT_KEY, generateUrl } from "./cnd";

export function userAvatar(user: User, edits: keyof typeof EDIT_KEY = 'PROFILE') {
  if (user && user.new_photos_expanded?.[0]) {
    return generateUrl(user.new_photos_expanded[0], edits) || '';
  }

  if (user && user.image_avatar) {
    return user.image_avatar;
  }

  return randomUserImage(user?._id || '');
}

function randomImage(id: string, length: number, template: (num: number) => string): string {
  const idLength = id ? id.length : 0;

  let hash = 0;
  for (let i = 0; i < idLength; i++) {
    hash += id.charCodeAt(i);
  }

  return template((hash % length) + 1);
}

export function randomUserImage(id: string): string {
  console.log(process.env.ASSET_PREFIX)
  return randomImage(id, 10, (num) => `${process.env.ASSET_PREFIX || ''}/assets/images/avatars/lemonade_davatar_${num}.png`);
}
