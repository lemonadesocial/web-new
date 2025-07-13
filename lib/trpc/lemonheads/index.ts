import axios, { Axios } from 'axios';
import { TraitType, Trait as TraitCore } from '$lib/services/lemonhead/core';
import { GRAPHQL_URL } from '$lib/utils/constants';
import { LemonHeadsColor, LemonHeadsLayer, LemonHeadsPageInfo } from './types';
import Trait from './trait';
import { request, gql } from 'graphql-request';

/**
 * @description BuildQueryParams
 *
 * @param traits - the filters
 * @param limit  - limit of result per trait filter
 * @param page   - base-1 page number
 *
 */
export type BuildQueryParams = {
  traits: Partial<TraitCore>[];
  limit?: number;
  page?: number;
};

class LemonHead {
  private instance: Axios;
  trait: Trait = new Trait();

  constructor() {
    const endpoint = (process.env.INTERNAL_GRAPHQL_URL || GRAPHQL_URL)?.replace('/graphql', '');
    this.instance = axios.create({
      baseURL: `${endpoint}/lemonheads/layers`,
    });
  }

  async getLayers(params: BuildQueryParams) {
    return this.instance.request<{ items: LemonHeadsLayer[]; total: number }>({
      method: 'get',
      url: `?${this.buildQuery(params)}`,
    });
  }

  async getBodies() {
    const params = this.buildQuery({
      traits: [
        { type: TraitType.body, value: 'human' },
        { type: TraitType.body, value: 'alien' },
      ],
    });

    return this.instance.request<{ items: LemonHeadsLayer[]; total: number }>({
      method: 'get',
      url: `?${params}`,
    });
  }

  async getDefaultSet() {
    const traits = [
      { type: TraitType.background, value: 'lemon' },
      { type: TraitType.eyes, value: 'black' },
      { type: TraitType.mouth, value: 'happy' },
      { type: TraitType.mouth, value: 'smile' },
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
    ] as Partial<TraitCore>[];

    const params = this.buildQuery({ traits });

    return this.instance.request<{ items: LemonHeadsLayer[]; total: number }>({
      method: 'get',
      url: `?${params}`,
    });
  }

  async getColorSet() {
    const document = gql`
      query {
        getLemonheadSupportData(type: color) {
          name
          value
        }
      }
    `;

    const res = await request<{ getLemonheadSupportData: LemonHeadsColor[] }>(GRAPHQL_URL, document);
    return { data: { items: (res?.getLemonheadSupportData || []) as LemonHeadsColor[] } };
  }

  buildQuery({ traits, limit, page }: BuildQueryParams) {
    return new URLSearchParams({
      traits: JSON.stringify(
        traits?.map((trait) => ({
          ...Object.fromEntries(trait.filters?.map((filter) => [filter.type, filter.value]) || []),
          type: trait.type,
          name: trait.value,
        })),
      ),
      ...(limit !== undefined ? { limit: limit.toString() } : {}),
      ...(page !== undefined ? { page: page.toString() } : {}),
    }).toString();
  }
}

const lemonHead = new LemonHead();
export default lemonHead;
