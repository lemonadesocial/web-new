import { Filter, layerings, TraitType } from '$lib/services/lemonhead/core';
import { merge } from 'lodash';
import { BodyRace, BodySize, Gender, LemonHeadsLayer, SkinTone, TraitExtends } from './types';
import { generateUrl } from '$lib/utils/cnd';
import { isMobile } from 'react-device-detect';

type FilterType = {
  type: TraitType;
  name: string;
  race: BodyRace;
  gender: Gender;
  skin_tone: SkinTone;
  size: BodySize;
  color: string;
  art_style: string;
};

export default class Trait {
  tranformTrait(data: LemonHeadsLayer) {
    const filters: Filter[] = [];
    layerings[data.type]?.filterTypes?.forEach((key) => filters.push({ type: key, value: data[key] }));

    return {
      _id: data._id,
      type: data.type,
      value: data.name,
      filters,
      image: generateUrl(data.file, { resize: { width: isMobile ? 492 : 692, height: isMobile ? 492 : 692 } }),
    } as TraitExtends;
  }

  getTraitFilter(params: Partial<FilterType>) {
    if (!params.type) throw Error('Type is missing');

    const layer = layerings[params.type!];
    const filters = layer?.filterTypes?.map((type) => ({ type: type, value: params[type] }));
    return {
      type: params.type,
      value: params.name,
      filters,
    };
  }

  getPreSelectTrait({ name, color, size, skin_tone, art_style, gender, race }: Partial<FilterType>) {
    const traitSet = {
      background: { name, art_style },
      body: { name, skin_tone, race, gender, size },
      eye: { name, color, size },
      mouth: { name, size },
      top: { name, gender, size, color },
      bottom: { name, gender, size, color },
    };

    Object.entries(traitSet).map(([_key, item]) => this.getTraitFilter(item));
  }

  getDefaultSet({ race, size, gender }: { race: BodyRace; size: BodySize; gender: Gender }) {
    let ds = {
      female: {
        background: { name: 'lemon', art_style: 'regular' },
        body: { name: race, skin_tone: 'rich', race, gender, size },
        top: { name: 'yellow_bralette', gender, size, color: 'yellow' },
        bottom: { name: 'yellow_shorts', gender, size, color: 'yellow' },
      },
      male: {
        background: { name: 'lemon', art_style: 'regular' },
        body: { name: race, skin_tone: 'rich', race, gender, size },
        top: { name: 'white_polo_tee', gender, size, color: 'white' },
        bottom: { name: 'red_shorts', gender, size, color: 'red' },
      },
    };

    if (race === 'human') {
      ds = merge(ds, {
        female: {
          hair: { name: 'black_fringe', color: 'black', gender, size },
          eyes: { name: 'black', size },
          mouth: { name: 'happy', size, color: 'black' },
        },
        male: {
          hair: { name: 'black_funky', color: 'black', gender, size },
          eyes: { name: 'black', size },
          mouth: { name: 'happy', size, color: 'black' },
        },
      });
    }
    return ds;
  }

  getTrait({ resouces, data }: { resouces?: { [key: string]: TraitExtends[] }; data: TraitExtends }) {
    if (!resouces || !resouces[data.type]) return null;
    return resouces[data.type].find((i) => i.value === data.value && this.deepCompareArrays(data.filters, i.filters));
  }

  private deepCompareArrays(arr1: Filter[] = [], arr2: Filter[] = []) {
    if (arr1.length !== arr2.length) return false;

    return arr1.every((item1, index) => {
      const item2 = arr2[index];
      return item1.type === item2.type && item1.value === item2.value;
    });
  }
}
