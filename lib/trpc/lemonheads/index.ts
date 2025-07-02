import axios, { Axios } from 'axios';
import { FilterType, TraitType } from '$lib/services/lemonhead/core';
import { LemonHeadsColor, LemonHeadsLayer, LemonHeadsPageInfo } from './types';

type PARAMS = {
  offset?: number;
  limit?: number;
  where?: string;
  viewId?: string;
};

export type BuildQueryParams = {
  type: TraitType;
  ops?: 'anyof' | 'eq';
  value?: string;
  filters: { type: FilterType; value?: string }[];
};

class LemonHead {
  private instance: Axios;

  constructor() {
    const token = process.env.NOCODB_ACCESS_KEY;
    this.instance = axios.create({
      baseURL: 'https://app.nocodb.com/api/v2',
      headers: { 'xc-token': token },
    });
  }

  getLayers(params: PARAMS = { limit: 100 }) {
    return this.instance.request<{ list: LemonHeadsLayer[]; pageInfo: LemonHeadsPageInfo }>({
      method: 'get',
      url: '/tables/mksrfjc38xpo4d1/records',
      params,
    });
  }

  getBodies() {
    return this.instance.request<{ list: LemonHeadsLayer[]; pageInfo: LemonHeadsPageInfo }>({
      method: 'get',
      url: '/tables/mksrfjc38xpo4d1/records',
      params: {
        where: '(name,anyof,human,alien)',
        limit: 100,
      },
    });
  }

  getDefaultSet() {
    const traitSets: any = [
      { type: TraitType.background, value: 'lemon', ops: 'anyof' },
      { type: TraitType.eyes, value: 'black' },
      { type: TraitType.mouth, value: 'happy,smile', ops: 'anyof' },
      {
        type: TraitType.hair,
        value: 'black_funky',
        filters: [
          { type: 'color', value: 'black' },
          { type: 'gender', value: 'male' },
        ],
      },
      {
        type: TraitType.hair,
        value: 'black_fringe',
        filters: [
          { type: 'color', value: 'black' },
          { type: 'gender', value: 'female' },
        ],
      },
      {
        type: TraitType.top,
        value: 'white_polo_tee',
        filters: [
          { type: 'color', value: 'white' },
          { type: 'gender', value: 'male' },
        ],
      },
      {
        type: TraitType.bottom,
        value: 'red_shorts',
        filters: [
          { type: 'color', value: 'red' },
          { type: 'gender', value: 'male' },
        ],
      },
      {
        type: TraitType.top,
        value: 'yellow_bralette',
        filters: [
          { type: 'color', value: 'yellow' },
          { type: 'gender', value: 'female' },
        ],
      },
      {
        type: TraitType.bottom,
        value: 'yellow_shorts',
        filters: [
          { type: 'color', value: 'yellow' },
          { type: 'gender', value: 'female' },
        ],
      },
    ];

    const where = traitSets.map(this.buildQuery).join('~or');

    return this.instance.request<{ list: LemonHeadsLayer[]; pageInfo: LemonHeadsPageInfo }>({
      method: 'get',
      url: '/tables/mksrfjc38xpo4d1/records',
      params: {
        where,
        limit: 100,
      },
    });
  }

  getColorSet() {
    return this.instance.request<{
      list: LemonHeadsColor[];
      pageInfo: LemonHeadsPageInfo;
    }>({
      method: 'get',
      url: '/tables/mgdpc3xfu1xmgzm/records',
      params: {
        limit: 100,
      },
    });
  }

  buildQuery(params: BuildQueryParams) {
    const { type, value, ops = 'eq', filters } = params;
    let arr = [`(type,${ops},${type})`];
    if (value) arr.push(`(name,${ops},${value})`);
    if (filters?.length) {
      arr = [...arr, ...filters.filter((i) => i.value).map((f) => `(${f.type},eq,${f.value})`)];
    }

    return arr.join('~and');
  }
}

const lemonHead = new LemonHead();
export default lemonHead;
