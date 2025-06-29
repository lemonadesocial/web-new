import { getApproval } from "./admin";
import { calculateLookHash, getFinalTraits, formatString, Trait, validateTraits } from './core';
import { getFinalImage, getImageUrlsFromTraits } from './image';
import { uploadImage, uploadJSON } from './storage';

const gatewayPrefix = 'https://api.grove.storage/';
const DESCRIPTION = 'LemonHead is a collection of Lemonade avatars';

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

  //-- create and upload image
  const imageUrls = await getImageUrlsFromTraits(finalTraits);
  const finalImage = await getFinalImage(imageUrls);
  const imageUrl = await uploadImage(lookHash, finalImage);

  //-- create and upload metadata
  const metadata = createMetadata(imageUrl, finalTraits);
  const metadataUrl = await uploadJSON(lookHash, metadata);

  //-- call backend API and obtain the signature
  const data = await getApproval(wallet, lookHash, sponsor);

  return {
    //-- use these to call the contract minting function
    look: lookHash,
    signature: data.signature,

    //-- for display purposes
    image: imageUrl,
    metadata: metadataUrl.replace(gatewayPrefix, ''),
  };
};
