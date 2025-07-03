import { getApproval, getCache, setCache } from './admin';
import { calculateLookHash, getFinalTraits, formatString, Trait, validateTraits } from './core';
import { getFinalImage, getImageUrlsFromTraits } from './image';
import { uploadImage, uploadJSON } from './storage';

const gatewayPrefix = 'https://api.grove.storage/';
const DESCRIPTION = [
  'LemonHeads are residents of the United Stands of Lemonade, a digital nation for creators celebrating inclusivity, community and good vibes. Each LemonHead is unique- customized by its creator- no two are alike. All holders get exclusive access to events, experiences, rewards and more.',
  'LemonHeads create, collaborate, celebrate. When life deals lemons, LemonHeads #makelemonade!',
  'https://lemonheads.xyz || https://lemonade.social || https://lemonade.foundation',
].join('\n');

const createMetadata = (image: string, traits: Trait[]) => {
  return {
    description: DESCRIPTION,
    image,
    attributes: traits.map((trait) => ({
      trait_type: formatString(trait.type),
      value: formatString(trait.value),
    })),
  };
};

export const getMintNftData = async (traits: Trait[], wallet: string, sponsor?: string) => {
  const finalTraits = getFinalTraits(traits);

  //-- make sure to validate the traits before minting
  validateTraits(finalTraits);

  const lookHash = calculateLookHash(finalTraits);

  const cache = await getCache(lookHash);

  let imageUrl = cache?.image_url;

  if (!imageUrl) {
    //-- create and upload image
    const imageUrls = await getImageUrlsFromTraits(finalTraits);
    const finalImage = await getFinalImage(imageUrls);
    imageUrl = await uploadImage(lookHash, finalImage);
  }

  let metadataUrl = cache?.metadata_url;

  if (!metadataUrl) {
    //-- create and upload metadata
    const metadata = createMetadata(imageUrl, finalTraits);
    metadataUrl = await uploadJSON(lookHash, metadata);
  }

  const imageChanged = imageUrl !== cache?.image_url;
  const metadataChanged = metadataUrl !== cache?.metadata_url;

  if (imageChanged || metadataChanged) {
    await setCache(lookHash, {
      ...(imageChanged && { image_url: imageUrl }),
      ...(metadataChanged && { metadata_url: metadataUrl }),
    });
  }

  //-- call backend API and obtain the signature
  const data = await getApproval(wallet, lookHash, sponsor);

  if (!data) {
    throw new Error('Failed to get minting approval');
  }

  return {
    //-- use these to call the contract minting function
    look: lookHash,
    signature: data.signature,

    //-- for display purposes
    image: imageUrl,
    metadata: metadataUrl.replace(gatewayPrefix, ''),
  };
};
