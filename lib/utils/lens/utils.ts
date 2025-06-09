import { image, link, MediaImageMimeType, textOnly } from "@lens-protocol/metadata";
import { Account } from "@lens-protocol/client";


import { MediaFile } from "../file";
import { randomUserImage } from "../user";

export function generatePostMetadata({ content, images, sharingLink }: { content: string, images?: MediaFile[]; sharingLink?: string; }) {
  if (sharingLink) {
    return link({
      content,
      sharingLink
    })
  }

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

export function getTokenRequirementMessage(validationResult: any): string | null {
  if (validationResult.__typename !== 'NamespaceOperationValidationFailed') {
    return null;
  }

  const requiredRules = validationResult.unsatisfiedRules?.required || [];
  const tokenRule = requiredRules.find((rule: any) => rule.reason === 'TOKEN_GATED_NOT_A_TOKEN_HOLDER');
  
  if (!tokenRule) {
    return null;
  }

  const config = tokenRule.config || [];
  const amount = config.find((c: any) => c.key === 'amount')?.bigDecimal;
  const symbol = config.find((c: any) => c.key === 'assetSymbol')?.string;
  const name = config.find((c: any) => c.key === 'assetName')?.string;

  if (!amount || !symbol) {
    return null;
  }

  return `You need to hold at least ${amount} ${symbol} (${name}) to claim this username`;
};
