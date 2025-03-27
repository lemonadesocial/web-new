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