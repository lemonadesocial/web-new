import * as ethers from 'ethers';
import _ from 'lodash';

export enum TraitType {
  background = 'background',
  body = 'body',
  footwear = 'footwear',
  bottom = 'bottom',
  top = 'top',
  outfit = 'outfit',
  mouth = 'mouth',
  facial_hair = 'facial_hair',
  hair = 'hair',
  necklace = 'necklace',
  bowtie = 'bowtie',
  earrings = 'earrings',
  headgear = 'headgear',
  mouthgear = 'mouthgear',
  eyes = 'eyes',
  eyewear = 'eyewear',
  pet = 'pet',
  instrument = 'instrument',
}

export enum FilterType {
  race = 'race',
  gender = 'gender',
  skin_tone = 'skin_tone',
  size = 'size',
  color = 'color',
  art_style = 'art_style',
}

export const requiredTraits = [
  TraitType.background,
  TraitType.body,
  TraitType.mouth,
  TraitType.hair,
  TraitType.eyes,
  //-- top and bottom are mutually exclusive with outfit so they are not always required
];

export interface Filter {
  type: FilterType;
  value: string;
}

export interface Trait {
  type: TraitType;
  value: string;
  filters?: Filter[];
}

export const layerings: Record<TraitType, { order: number[]; filterTypes: FilterType[] }> = {
  [TraitType.background]: { order: [10], filterTypes: [FilterType.art_style] },
  [TraitType.body]: { order: [20], filterTypes: [FilterType.race, FilterType.gender, FilterType.skin_tone] },
  [TraitType.footwear]: { order: [30], filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.bottom]: { order: [40], filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.top]: { order: [50], filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.outfit]: { order: [40, 50], filterTypes: [FilterType.gender, FilterType.size] }, //-- mutually exclusive with top and bottom
  [TraitType.mouth]: { order: [60], filterTypes: [FilterType.size] },
  [TraitType.facial_hair]: { order: [70], filterTypes: [FilterType.gender, FilterType.size, FilterType.color] }, //-- optional
  [TraitType.hair]: { order: [80], filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.necklace]: { order: [85], filterTypes: [FilterType.size, FilterType.color] },
  [TraitType.bowtie]: { order: [85], filterTypes: [] },
  [TraitType.earrings]: { order: [90], filterTypes: [FilterType.gender, FilterType.size] }, //-- optional
  [TraitType.headgear]: { order: [100], filterTypes: [FilterType.gender, FilterType.size, FilterType.color] }, //-- optional
  [TraitType.mouthgear]: { order: [120], filterTypes: [FilterType.size] }, //-- optional
  [TraitType.eyes]: { order: [130], filterTypes: [FilterType.size] },
  [TraitType.eyewear]: { order: [140], filterTypes: [FilterType.size, FilterType.color] }, //-- optional
  [TraitType.pet]: { order: [150], filterTypes: [FilterType.race, FilterType.color] }, //-- optional
  [TraitType.instrument]: { order: [160], filterTypes: [] }, //-- optional
};

export function findConflictTraits(existingTraits: Trait[], newTrait: Trait) {
  //-- make sure the new trait layer is not already in the traits array
  return existingTraits.filter((trait) => {
    // If trait types are the same, they conflict
    if (trait.type === newTrait.type) return true;

    // Check if the layers conflict between renderable traits
    const traitLayers = layerings[trait.type] || [];
    const newTraitLayers = layerings[newTrait.type] || [];

    // If any layer overlaps, there's a conflict
    return traitLayers.order.some((layer) => newTraitLayers.order.includes(layer));
  });
}

export function validateTraits(traits: Trait[]) {
  //-- make sure:

  //-- 0. trait types are valid
  if (traits.some((trait) => !layerings[trait.type])) {
    throw new Error('Invalid trait type');
  }

  //-- 1. no layer conflict
  const layers = traits.flatMap((trait) => layerings[trait.type].order).sort();

  for (let i = 0; i < layers.length - 1; i++) {
    if (layers[i] === layers[i + 1]) {
      throw new Error('Layer conflict detected');
    }
  }

  //-- 2. required traits are present
  if (requiredTraits.some((trait) => !traits.some((t) => t.type === trait))) {
    throw new Error('Required traits are missing');
  }

  //-- 3. custom trait validations

  //-- if no outfit then there must be top & bottom
  if (
    !traits.some((trait) => trait.type === TraitType.outfit) &&
    [TraitType.top, TraitType.bottom].some((trait) => !traits.some((t) => t.type === trait))
  ) {
    throw new Error('Top and bottom are required if no outfit is present');
  }

  //-- 4. filters validation

  //-- 4.1 filter must not be duplicated
  for (const trait of traits) {
    const filters = trait.filters?.map((filter) => filter.type).sort() || [];

    for (let i = 0; i < filters.length - 1; i++) {
      if (filters[i] === filters[i + 1]) {
        throw new Error('Duplicated filter detected');
      }
    }
  }

  //-- 4.2 gender and size must be consistent between traits
  for (const filterType of [FilterType.gender, FilterType.size]) {
    const filterValues = traits
      .flatMap((trait) => trait.filters || [])
      .filter((filter) => filter.type === filterType)
      .map((filter) => filter.value);

    if (_.uniq(filterValues).length > 1) {
      throw new Error('Gender and size must be consistent between traits');
    }
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
      return Math.max(...(layerings[a.type].order || [0])) - Math.max(...(layerings[b.type].order || [0]));
    })
    .map((trait) => ({
      ...trait,
      filter: layerings[trait.type].filterTypes
        //-- only include filters that are in the trait type's filterTypes
        .flatMap((filterType) => {
          const filter = trait.filters?.find((filter) => filter.type === filterType);
          return filter ? [filter] : [];
        })
        //-- sort the filters by type alphabetically
        .sort((a, b) => a.type.localeCompare(b.type)),
    }));
}

//-- this assumes that the traits are final
export function calculateLookHash(finalTraits: Trait[]) {
  const content = finalTraits
    .map((trait) =>
      [
        '--',
        `${formatString(trait.type)}:${formatString(trait.value)}`,
        ...(trait.filters?.map((filter) => `${formatString(filter.type)}:${formatString(filter.value)}`) || []),
      ].join('\n'),
    )
    .join('\n');

  return ethers.keccak256(ethers.toUtf8Bytes(content));
}
