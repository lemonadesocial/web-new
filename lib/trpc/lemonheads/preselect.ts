import { LemonHeadValues } from '$lib/components/features/lemonheads/types';
import { LemonHeadAccessory } from './types';

const mapping: Record<string, any> = {
  male: {
    eyes: 'focus',
    mouth: 'smile',
    hair: 'funky',
    top: 'white_polo_tee',
    bottom: 'red_shorts',
    background: 'regular_03',
  },
  female: {
    eyes: 'focus',
    mouth: 'happy',
    hair: 'fringe',
    top: 'yellow_bralette',
    bottom: 'yellow_shorts',
    background: 'regular_10',
  },
};

export function transformPreselect({
  gender,
  size,
  data = [],
}: {
  gender: string;
  size: string;
  data?: LemonHeadAccessory[];
}) {
  let result: Partial<LemonHeadValues> = {};
  const ds = data.filter((i) => {
    let condition = false;
    if (i.body_type && i.body_type === size) condition = i.body_type === size;
    return condition;
  });

  Object.entries(mapping[gender]).forEach(([key, value]) => {
    result = {
      ...result,
      [key]: ds.find((i) => i.type === key && i.name === value),
    };
  });

  if (gender === 'male') result.background = data.find((i) => i.name === 'regular_03');
  if (gender === 'female') result.background = data.find((i) => i.name === 'regular_10');

  return result;
}
