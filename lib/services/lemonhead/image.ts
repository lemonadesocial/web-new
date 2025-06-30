import assert from 'assert';
import { Canvas, Image } from 'canvas';

import { type Trait } from './core';

const baseUrl = 'https://app.nocodb.com/api/v2';
const apikey = process.env.NOCODB_ACCESS_KEY!;

const tableId = 'mksrfjc38xpo4d1';

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
    console.log("data", data);
    
    throw new Error(`No image found for ${url}`);
  }

  return image;
};

const buildQuery = (trait: Trait) => {
  const query = [
    `(type,eq,${trait.type})`,
    `(name,eq,${trait.value})`,
    ...(trait.filters?.map((filter) => `(${filter.type},eq,${filter.value})`) || []),
  ].join('~and');

  const uri = `/tables/${tableId}/records?where=${query}&limit=1&shuffle=0&offset=0`;

  return uri;
};

//-- this function expects the final traits
export const getImageUrlsFromTraits = async (finalTraits: Trait[]) => {
  const queryUrls = finalTraits.map(buildQuery);

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
