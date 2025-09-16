import { generateUrl } from '$lib/utils/cnd';
import { calculateLookHash, formatString, getFinalTraits, Trait, validateTraits } from './core';
import { getApproval, getCache, setCache } from './admin';
import { getFinalImage, getRenderLayersFromTraits } from './image';
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
    const layers = await getRenderLayersFromTraits(finalTraits);

    //-- when there is at least one jpeg layer, use jpeg, otherwise use png
    const outputFormat = layers.find((layer) => layer?.file?.type === 'image/jpeg') ? 'jpeg' : 'png';

    const finalImage = await getFinalImage(
      layers.flatMap((layer) => (layer?.file ? generateUrl(layer.file) : [])),
      outputFormat,
    );

    imageUrl = await uploadImage(lookHash, finalImage);
  }

  const imageChanged = imageUrl !== cache?.image_url;

  if (imageChanged) {
    await setCache(lookHash, {
      ...(imageChanged && { image_url: imageUrl }),
    });
  }

  //-- call backend API and obtain the signature
  const data = await getApproval(wallet, lookHash, sponsor);

  if (!data) {
    throw new Error('Failed to get minting approval');
  }

  //-- create and upload metadata
  const metadata = createMetadata(imageUrl, finalTraits);
  const metadataUrl = await uploadJSON(lookHash, { ...metadata, ...data?.inviter && { inviter: data.inviter } });

  return {
    //-- use these to call the contract minting function
    look: lookHash,
    signature: data.signature,
    price: data.price,

    //-- for display purposes
    image: imageUrl,
    metadata: metadataUrl.replace(gatewayPrefix, ''),
  };
};
