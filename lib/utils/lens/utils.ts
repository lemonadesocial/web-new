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

export function getUsernameValidationMessage(validationResult: any, usernameLength?: number): string | null {
  if (validationResult.__typename !== 'NamespaceOperationValidationFailed') {
    return null;
  }

  const requiredRules = validationResult.unsatisfiedRules?.required || [];
  
  const tokenRule = requiredRules.find((rule: any) => rule.reason === 'TOKEN_GATED_NOT_A_TOKEN_HOLDER');
  if (tokenRule) {
    const config = tokenRule.config || [];
    const amount = config.find((c: any) => c.key === 'amount')?.bigDecimal;
    const symbol = config.find((c: any) => c.key === 'assetSymbol')?.string;
    const name = config.find((c: any) => c.key === 'assetName')?.string;

    if (amount && symbol) {
      return `You need to hold at least ${amount} ${symbol} (${name}) to claim this username`;
    }
  }

  const priceRule = requiredRules.find((rule: any) => rule.reason === 'USERNAME_PRICE_PER_LENGTH_NOT_ENOUGH_BALANCE');
  if (priceRule) {
    const config = priceRule.config || [];
    const symbol = config.find((c: any) => c.key === 'assetSymbol')?.string;
    const overrides = config.find((c: any) => c.key === 'overrides')?.array || [];

    if (symbol && overrides.length > 0) {
      if (usernameLength !== undefined) {
        const specificOverride = overrides.find((override: any) => {
          const length = override.dictionary?.find((d: any) => d.key === 'length')?.int;
          return length === usernameLength;
        });
        
        if (specificOverride) {
          const amount = specificOverride.dictionary?.find((d: any) => d.key === 'amount')?.bigDecimal;
          return `You do not have sufficient balance. Username with ${usernameLength} ${usernameLength > 1 ? 'characters' : 'character'} costs ${amount} ${symbol}.`;
        }
      }
      
      const pricingInfo = overrides.map((override: any) => {
        const length = override.dictionary?.find((d: any) => d.key === 'length')?.int;
        const amount = override.dictionary?.find((d: any) => d.key === 'amount')?.bigDecimal;
        return `${length} chars: ${amount} ${symbol}`;
      }).join(', ');

      return `Username pricing: ${pricingInfo}`;
    }
  }

  return null;
};
