import axios, { Axios } from 'axios';
import { LemonHeadAccessory, LemonHeadBodyType, LemonHeadPageInfo } from './types';

type PARAMS = {
  offset?: number;
  limit?: number;
  where?: string;
};

class LemonHead {
  instance: Axios;

  constructor() {
    const token = process.env.NOCODB_ACCESS_KEY;
    this.instance = axios.create({
      baseURL: 'https://app.nocodb.com/api/v2',
      headers: { 'xc-token': token },
    });
  }

  getBody(params: PARAMS = { limit: 100 }) {
    return this.instance.request<{ list: LemonHeadBodyType[]; pageInfo: LemonHeadPageInfo }>({
      method: 'get',
      url: '/tables/m4qe842pv8myt4x/records',
      params,
    });
  }

  async getAccessories(params: PARAMS = { limit: 100 }) {
    return this.instance.request<{ list: LemonHeadAccessory[]; pageInfo: LemonHeadPageInfo }>({
      method: 'get',
      url: '/tables/m8fys8d596wooeq/records',
      params,
    });
  }
}

export default new LemonHead();
