import { image, MediaImageMimeType, textOnly } from "@lens-protocol/metadata";
import { Account } from "@lens-protocol/client";

import { MediaFile } from "../file";
import { randomUserImage } from "../user";

export function generatePostMetadata({ content, images }: { content: string, images?: MediaFile[] }) {
  if (images?.length) {
    return image({
      content,
      image: {
        item: images[0].url,
        type: images[0].type as MediaImageMimeType,
      },
      attachments: images.map(image => ({
        item: image.url,
        type: image.type as MediaImageMimeType,
      })),
    });
  }

  return textOnly({ content });
}

export function getAccountAvatar(account: Account) {
  return account.metadata?.picture || randomUserImage(account.owner);
}
