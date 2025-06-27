import assert from 'assert';
import { Canvas, Image } from 'canvas';

import { Trait, TraitType } from './core';

const baseUrl = 'https://app.nocodb.com/api/v2';
const apikey = process.env.NOCODB_ACCESS_KEY!;

const accessoryTable = 'm8fys8d596wooeq';
const bodyBaseTable = 'm4qe842pv8myt4x';

const readUrlToBuffer = async (url: string) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

const getImageUrl = async (url: string) => {
  const response = await fetch(`${baseUrl}${url}`, {
    headers: {
      accept: 'application/json',
      'xc-token': apikey,
    },
  });

  const data = (await response.json()) as { list: { attachment: { signedUrl: string }[] }[] };

  const image = data.list?.[0].attachment[0].signedUrl;

  if (!image) {
    throw new Error(`No image found for ${url}`);
  }

  return image;
};

const buildQuery = (table: string, filterTraits: Trait[], mainTrait?: Trait) => {
  const query = filterTraits
    .map((trait) => `(${trait.type},eq,${trait.value})`)
    .concat(...(mainTrait ? [`(type,eq,${mainTrait.type})`, `(name,eq,${mainTrait.value})`] : []))
    .join('~and');

  const uri = `/tables/${table}/records?where=${query}&limit=1&shuffle=0&offset=0`;

  return uri;
};

const queryBuilder =
  (table: string, traitTypes: TraitType[], mainTraitType?: TraitType, force?: boolean) => (finalTraits: Trait[]) => {
    const traits = finalTraits.filter((trait) => traitTypes.includes(trait.type) && trait.value);
    const mainTrait = mainTraitType && finalTraits.find((trait) => trait.type === mainTraitType && trait.value);

    if (!force && !mainTrait) {
      return;
    }

    return buildQuery(table, traits, mainTrait);
  };

const backgroundQuery = queryBuilder(accessoryTable, [], TraitType.background);
const bodyBaseQuery = queryBuilder(
  bodyBaseTable,
  [TraitType.body_type, TraitType.gender, TraitType.origin, TraitType.skin_tone],
  undefined,
  true,
);
const footwearQuery = queryBuilder(accessoryTable, [TraitType.gender, TraitType.body_type], TraitType.footwear);
const bottomQuery = queryBuilder(accessoryTable, [TraitType.gender, TraitType.body_type], TraitType.bottom);
const topQuery = queryBuilder(accessoryTable, [TraitType.gender, TraitType.body_type], TraitType.top);
const outfitQuery = queryBuilder(accessoryTable, [TraitType.gender, TraitType.body_type], TraitType.outfit);
const mouthQuery = queryBuilder(accessoryTable, [TraitType.body_type], TraitType.mouth);
const facialHairQuery = queryBuilder(accessoryTable, [TraitType.gender, TraitType.body_type], TraitType.facial_hair);
const hairQuery = queryBuilder(accessoryTable, [TraitType.gender, TraitType.body_type], TraitType.hair);
const earringsQuery = queryBuilder(accessoryTable, [TraitType.gender, TraitType.body_type], TraitType.earrings);
const headgearQuery = queryBuilder(accessoryTable, [TraitType.gender, TraitType.body_type], TraitType.headgear);
const mouthgearQuery = queryBuilder(accessoryTable, [TraitType.body_type], TraitType.mouthgear);
const eyesQuery = queryBuilder(accessoryTable, [TraitType.body_type], TraitType.eyes);
const eyeWearQuery = queryBuilder(accessoryTable, [TraitType.body_type], TraitType.eyewear);

const queries = [
  backgroundQuery,
  bodyBaseQuery,
  footwearQuery,
  bottomQuery,
  topQuery,
  outfitQuery,
  mouthQuery,
  facialHairQuery,
  hairQuery,
  earringsQuery,
  headgearQuery,
  mouthgearQuery,
  eyesQuery,
  eyeWearQuery,
];

//-- this function expects the final traits
export const getImageUrlsFromTraits = async (finalTraits: Trait[]) => {
  const queryUrls = queries.flatMap((query) => {
    const url = query(finalTraits);
    return url ? [url] : [];
  });

  //-- nocoDB is throtlting, let's apply it setrially
  const imageUrls: string[] = [];

  //--TODO: improve this by getting all images at a same time using OR on the nocodb query?
  for (const url of queryUrls) {
    const imageUrl = await getImageUrl(url);
    imageUrls.push(imageUrl);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return imageUrls;
};

const outputWith = 1024;
const outputHeight = 1024;

export const getFinalImage = async (imageUrls: string[]) => {
  const buffers = await Promise.all(imageUrls.map(readUrlToBuffer));

  //-- this is run in nodejs, please use a library to create a canvas
  const canvas = new Canvas(outputWith, outputHeight);
  canvas.width = outputWith;
  canvas.height = outputHeight;

  //-- merge all images into a single image
  const ctx = canvas.getContext('2d');
  assert.ok(ctx);

  // Load and draw all images sequentially
  for (const buffer of buffers) {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        // Scale the image to fit the canvas dimensions
        ctx.drawImage(img, 0, 0, outputWith, outputHeight);
        resolve();
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = buffer;
    });
  }

  // Return the final merged image as buffer
  return canvas.toBuffer('image/png');
};
