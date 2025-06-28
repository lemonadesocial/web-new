import * as ethers from 'ethers';

export enum TraitType {
  origin = 'origin',
  gender = 'gender',
  body_type = 'body_type',
  skin_tone = 'skin_tone',
  background = 'background',
  top = 'top',
  bottom = 'bottom',
  outfit = 'outfit',
  eyes = 'eyes',
  earrings = 'earrings',
  eyewear = 'eyewear',
  hair = 'hair',
  headgear = 'headgear',
  mouth = 'mouth',
  mouthgear = 'mouthgear',
  facial_hair = 'facial_hair',
  footwear = 'footwear',
}

export const baseTraitTypes = [TraitType.origin, TraitType.gender, TraitType.skin_tone] as const;

export const requiredTraits = [
  ...baseTraitTypes,
  TraitType.background,
  TraitType.body_type,
  TraitType.eyes,
  TraitType.hair,
  TraitType.mouth,
];

export type BaseTraitType = (typeof baseTraitTypes)[number];

export interface Trait {
  type: TraitType;
  value: string;
}

export const layerings: { [key in TraitType]?: number[] } = {
  [TraitType.background]: [10],
  [TraitType.body_type]: [20],
  [TraitType.footwear]: [30], //-- optional
  [TraitType.bottom]: [40],
  [TraitType.top]: [50],
  [TraitType.outfit]: [40, 50], //-- mutually exclusive with top and bottom
  [TraitType.mouth]: [60],
  [TraitType.facial_hair]: [70], //-- optional
  [TraitType.hair]: [80],
  [TraitType.earrings]: [90], //-- optional
  [TraitType.headgear]: [100], //-- optional
  [TraitType.mouthgear]: [120], //-- optional
  [TraitType.eyes]: [130],
  [TraitType.eyewear]: [140], //-- optional
};

export function findConflictTraits(existingTraits: Trait[], newTrait: Trait) {
  //-- make sure the new trait layer is not already in the traits array
  return existingTraits.filter((trait) => {
    // If trait types are the same, they conflict
    if (trait.type === newTrait.type) return true;

    // If newTrait is a base trait type, it's always valid (no conflicts)
    if (newTrait.type in baseTraitTypes) {
      return false;
    }

    // If trait is a base trait type, it doesn't conflict with renderable traits
    if (trait.type in baseTraitTypes) {
      return false;
    }

    // Check if the layers conflict between renderable traits
    const traitLayers = layerings[trait.type] || [];
    const newTraitLayers = layerings[newTrait.type] || [];

    // If any layer overlaps, there's a conflict
    return traitLayers.some((layer) => newTraitLayers.includes(layer));
  });
}

export function validateTraits(traits: Trait[]) {
  //-- make sure:

  //-- 1. no layer conflict
  const layers = traits.flatMap((trait) => layerings[trait.type] || []).sort();

  for (let i = 0; i < layers.length - 1; i++) {
    if (layers[i] === layers[i + 1]) {
      throw new Error('Layer conflict detected');
    }
  }

  //-- 2. required traits are present
  if (requiredTraits.some((trait) => !traits.some((t) => t.type === trait))) {
    throw new Error('Required traits are missing');
  }

  //-- 3. custom validations

  //-- if no outfit then there must be top & bottom
  if (
    !traits.some((trait) => trait.type === TraitType.outfit) &&
    [TraitType.top, TraitType.bottom].some((trait) => !traits.some((t) => t.type === trait))
  ) {
    throw new Error('Top and bottom are required if no outfit is present');
  }
}

export function formatString(value: string) {
  //-- replace underscores with spaces and capitalize the first letter of each word
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

//-- filter out traits with empty values and sort them
export function getFinalTraits(traits: Trait[]) {
  return traits
    .filter((trait) => !!trait.value)
    .sort((a, b) => {
      const aType = a.type;
      const bType = b.type;

      //-- base traits, sort by index within baseTraitTypes
      if (aType in baseTraitTypes && bType in baseTraitTypes) {
        return baseTraitTypes.indexOf(aType as BaseTraitType) - baseTraitTypes.indexOf(bType as BaseTraitType);
      }

      //-- renderable traits, sort by max layer
      if (!(aType in baseTraitTypes) && !(bType in baseTraitTypes)) {
        return Math.max(...(layerings[aType] || [0])) - Math.max(...(layerings[bType] || [0]));
      }

      return aType in baseTraitTypes ? -1 : 1;
    });
}

//-- this assumes that the traits are final
export function calculateLookHash(finalTraits: Trait[]) {
  const content = finalTraits.map((trait) => `${formatString(trait.type)}:${formatString(trait.value)}`).join('\n');

  return ethers.keccak256(ethers.toUtf8Bytes(content));
}
