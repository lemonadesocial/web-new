import { Trait } from '$lib/services/lemonhead/core';
import { BodySize, LemonHeadsAttachment, LemonHeadsLayer } from './types';

const mapping: Record<string, any> = {
  male: {
    eyes: 'focus',
    mouth: 'smile',
    hair: 'funky',
    top: 'polo_tee',
    bottom: 'shorts',
    background: 'regular_03',
  },
  female: {
    eyes: 'focus',
    mouth: 'happy',
    hair: 'fringe',
    top: 'bralette',
    bottom: 'shorts',
    background: 'regular_10',
  },
};

// FIXME: UPDATE COLOR HERE
function getFilters({
  key,
  size,
  gender,
  color,
}: {
  key: string;
  gender: 'male' | 'female';
  size: BodySize;
  color?: string;
}) {
  if (key === 'background') return {};
  if (key === 'eyes') return { size };
  if (key === 'mouth') return { size };
  if (key === 'hair') return { size, gender, color };
  if (key === 'top') return { size, gender, color };
  if (key === 'bottom') return { size, gender, color };
}

export function transformTrait({
  data,
  gender,
  size,
  race = 'human',
}: {
  data: LemonHeadsLayer[];
  gender: 'male' | 'female';
  size: BodySize;
  race?: 'alien' | 'human';
}) {
  const acc = {} as Record<string, Trait & { Id: string; attachment: LemonHeadsAttachment[] }>;

  Object.entries(mapping[gender]).forEach(([key, value]) => {
    if (race === 'alien' && ['hair', 'mouth', 'eyes'].includes(key)) return;

    let obj = (data.find(
      (i) => (!i.gender || i.gender === gender) && i.name === value && (!i.size || i.size === size),
    ) || {}) as any;

    if (key === 'background') obj = (data.find((i) => i.name === value) || {}) as any;

    acc[obj.type] = {
      Id: obj.Id,
      type: obj.type,
      value: obj.name,
      attachment: obj.attachment,
      color: obj.color,
      race: obj.race,
      filters: getFilters({ size, gender, key: obj.type, color: obj.color }),
    };
  });

  return acc;
}
