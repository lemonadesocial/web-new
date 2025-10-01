import * as ethers from 'ethers';
import _ from 'lodash';

//-- the order in TraitType enum is also the layer render order
export enum TraitType {
  background = 'background',
  body = 'body',
  footwear = 'footwear',
  bottom = 'bottom',
  top = 'top',
  mouth = 'mouth',
  facial_hair = 'facial_hair',
  hair = 'hair',
  earrings = 'earrings',
  headgear = 'headgear',
  outfit = 'outfit',
  neckwear = 'neckwear',
  mouthgear = 'mouthgear',
  eyes = 'eyes',
  eyewear = 'eyewear',
  bag = 'bag',
  instrument = 'instrument',
  pet = 'pet',
}

export enum FilterType {
  race = 'race',
  gender = 'gender',
  skin_tone = 'skin_tone',
  size = 'size',
  color = 'color',
  art_style = 'art_style',
}

export interface Filter {
  type: FilterType;
  value: string;
}

export interface Trait {
  type: TraitType;
  value: string;
  filters?: Filter[];
}

export const layerings: Record<
  TraitType,
  { mutualExclusive?: TraitType[]; filterTypes: FilterType[]; required?: boolean }
> = {
  [TraitType.background]: { filterTypes: [FilterType.art_style], required: true },
  [TraitType.body]: {
    filterTypes: [FilterType.race, FilterType.gender, FilterType.skin_tone, FilterType.size],
    required: true,
  },
  [TraitType.footwear]: { filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.bottom]: {
    mutualExclusive: [TraitType.outfit],
    filterTypes: [FilterType.gender, FilterType.size, FilterType.color],
  },
  [TraitType.top]: {
    mutualExclusive: [TraitType.outfit],
    filterTypes: [FilterType.gender, FilterType.size, FilterType.color],
  },
  [TraitType.mouth]: { filterTypes: [FilterType.size, FilterType.color] },
  [TraitType.facial_hair]: { filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.hair]: { filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.earrings]: { filterTypes: [FilterType.gender, FilterType.size] },
  [TraitType.headgear]: { filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.outfit]: {
    mutualExclusive: [TraitType.top, TraitType.bottom],
    filterTypes: [FilterType.gender, FilterType.size],
  },
  [TraitType.neckwear]: { filterTypes: [FilterType.size, FilterType.color] },
  [TraitType.mouthgear]: { filterTypes: [FilterType.size] },
  [TraitType.eyes]: { filterTypes: [FilterType.size] },
  [TraitType.eyewear]: { filterTypes: [FilterType.size, FilterType.color] },
  [TraitType.bag]: { filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.instrument]: { filterTypes: [FilterType.gender, FilterType.size, FilterType.color] },
  [TraitType.pet]: { filterTypes: [FilterType.race, FilterType.color] },
};

export const requiredTraits = Object.entries(layerings).flatMap(([key, value]) =>
  value.required ? [key as TraitType] : [],
);

export function findConflictTraits(existingTraits: Trait[], newTrait: Trait) {
  //-- make sure the new trait layer is not already in the traits array
  return existingTraits.filter((trait) => {
    // If trait types are the same, they conflict
    if (trait.type === newTrait.type) return true;

    // check for mutual exclusivity
    return layerings[trait.type].mutualExclusive?.includes(newTrait.type) || false;
  });
}

export function validateTraits(traits: Trait[]) {
  //-- make sure:

  //-- 0. trait types are valid
  if (traits.some((trait) => !layerings[trait.type])) {
    throw new Error('Invalid trait type');
  }

  //-- 1. no layer conflict, add the trait one by one again
  const tmpTraits: Trait[] = [];
  for (const trait of traits) {
    const conflictTraits = findConflictTraits(tmpTraits, trait);

    if (conflictTraits.length > 0) {
      throw new Error('Layer conflict detected');
    }

    tmpTraits.push(trait);
  }

  //-- 2. required traits are present
  if (requiredTraits.some((trait) => !traits.some((t) => t.type === trait))) {
    throw new Error('Required traits are missing');
  }

  //-- 3. custom trait validations

  //-- 3.1 if no outfit then there must be top & bottom
  // if (
  //   !traits.some((trait) => trait.type === TraitType.outfit) &&
  //   [TraitType.top, TraitType.bottom].some((trait) => !traits.some((t) => t.type === trait))
  // ) {
  //   throw new Error('Top and bottom are required if no outfit is present');
  // }

  //-- 3.2 alien cannot have eyes, mouth, or hair
  const bodyTrait = traits.find((trait) => trait.type === TraitType.body);
  if (
    bodyTrait?.value === 'alien' &&
    bodyTrait.filters?.some((filter) => filter.type === FilterType.race && filter.value === 'alien')
  ) {
    if (traits.some((trait) => [TraitType.eyes, TraitType.mouth, TraitType.hair].includes(trait.type))) {
      throw new Error('Alien cannot have eyes, mouth, or hair');
    }
  } else {
    //-- must have eyes, mouth, and hair
    if (!traits.some((trait) => [TraitType.eyes, TraitType.mouth, TraitType.hair].includes(trait.type))) {
      throw new Error('Eyes, mouth, and hair are required');
    }
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
      .flatMap((filter) => (filter.value ? [filter.value] : []));

    if (_.uniq(filterValues).length > 1) {
      throw new Error('Gender and size must be consistent between traits');
    }
  }
}

export function formatString(value: string) {
  //-- replace underscores with spaces and capitalize the first letter of each word
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const TraitOrders = Object.values(TraitType);

//-- filter out traits with empty values and sort them
export function getFinalTraits(traits: Trait[]) {
  return traits
    .filter((trait) => !!trait.value)
    .sort((a, b) => TraitOrders.indexOf(a.type) - TraitOrders.indexOf(b.type))
    .map((trait) => ({
      ...trait,
      filters: layerings[trait.type].filterTypes
        //-- only include filters that are in the trait type's filterTypes
        .flatMap((filterType) => {
          const filter = trait.filters?.find((filter) => filter.type === filterType);
          return filter?.value ? [filter] : [];
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
