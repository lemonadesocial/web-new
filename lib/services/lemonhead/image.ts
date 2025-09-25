import assert from 'assert';
import { Canvas, Image } from 'canvas';
import fetch from 'node-fetch';

import { SystemFile } from '$lib/graphql/generated/backend/graphql';
import { getOrSet } from '$lib/utils/cache';

import { FilterType, TraitType, type Trait } from './core';

type Paginated<T> = {
  total: number;
  items: T[];
};

export type Layer = { [K in FilterType]?: string } & {
  type: string;
  name: string;
  order?: string;
  file?: Pick<SystemFile, 'bucket' | 'key' | 'type' | 'url'>;
}

const outputSize = 3000;

const readUrlToBuffer = async (url: string) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

const traitToQuery = (trait: Partial<Trait>) => {
  return {
    ...Object.fromEntries(trait.filters?.map((filter) => [filter.type, filter.value]) || []),
    type: trait.type,
    name: trait.value,
  } as Partial<Layer>;
};

export const searchLayers = async (
  serverUrl: string, //-- use the internal graphql url if request from backend, use the public url if request from frontend
  traits: (Partial<Trait>)[], //-- the filters
  limit?: number, //-- limit of result per trait filter
  page?: number, //-- base-1 page number
) => {
  const query = new URLSearchParams({
    traits: JSON.stringify(traits.map(traitToQuery)),
    ...limit !== undefined ? { limit: limit.toString() } : {},
    ...page !== undefined ? { page: page.toString() } : {},
  }).toString();

  const response = await fetch(`${serverUrl}/lemonheads/layers?${query}`);

  const data = await response.json();

  return data as Paginated<Layer>;
}

export const randomLayers = async (
  serverUrl: string, //-- use the internal graphql url if request from backend, use the public url if request from frontend
  traits: Partial<Trait>[], //-- the filters
) => {
  const query = new URLSearchParams({
    traits: JSON.stringify(traits.map(traitToQuery)),
  }).toString();

  const response = await fetch(`${serverUrl}/lemonheads/layers/random?${query}`);

  const data = await response.json();

  return data as Layer[];
}

export const getRandomLayersFromTraits = async (finalTraits: Omit<Trait, 'value'>[]) => {
  return await randomLayers(process.env.INTERNAL_GRAPHQL_URL!, finalTraits);
};

//-- this function expects the final traits
export const getRenderLayersFromTraits = async (finalTraits: Trait[]) => {
  const layers = await searchLayers(process.env.INTERNAL_GRAPHQL_URL!, finalTraits);

  assert.ok(layers.items.length === finalTraits.length && layers.items.every((layer) => !!layer.file));

  return finalTraits.map((trait) => {
    const query = traitToQuery(trait);

    return layers.items.find((layer) => Object.entries(query).every(([key, value]) => layer[key as keyof Layer] === value))
  });
};

export const getFinalImage = async (imageUrls: string[], outputFormat: 'png' | 'jpeg') => {
  const buffers = await Promise.all(imageUrls.map(readUrlToBuffer));

  //-- this is run in nodejs, please use a library to create a canvas
  const canvas = new Canvas(outputSize, outputSize);

  //-- merge all images into a single image
  const ctx = canvas.getContext('2d');
  assert.ok(ctx);

  // Load and draw all images sequentially
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        // Scale the image to fit the canvas dimensions
        ctx.drawImage(img, 0, 0, outputSize, outputSize);
        resolve();
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = buffer;
    });
  }

  // Return the final merged image as buffer
  if (outputFormat === 'png') {
    return canvas.toBuffer('image/png');
  }
  else {
    return canvas.toBuffer('image/jpeg');
  }
};

const countLayers = async (serverUrl: string, traits: Omit<Trait, 'value'>[]) => {
  const query = new URLSearchParams({
    traits: JSON.stringify(traits.map(traitToQuery)),
  }).toString();

  const response = await fetch(`${serverUrl}/lemonheads/layers/count?${query}`);

  const data = await response.json();

  return data as { count: number };
};

export const randomUseOutfit = async () => {
  //-- cache for a day
  const [outfitCount, topCount, bottomCount] = await getOrSet('lemonhead_layers_count', async () => {
    return await Promise.all([
      [{ type: TraitType.outfit }],
      [{ type: TraitType.top }],
      [{ type: TraitType.bottom }],
    ].map((traits) => countLayers(process.env.INTERNAL_GRAPHQL_URL!, traits).then((count) => count.count)));
  }, 86400000);

  const top_and_bottom = topCount + bottomCount;

  //-- if there is no top and bottom, then use outfit
  if (top_and_bottom == 0) {
    return true;
  }

  return Math.random() < outfitCount / (outfitCount + top_and_bottom);
};
