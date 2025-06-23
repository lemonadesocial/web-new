import axios, { Axios } from 'axios';
import { LemonHeadBodyType, LemonHeadPageInfo } from './types';

type PARAMS = {
  offset?: string;
  limit?: string;
  where?: string;
  viewId?: string;
};

export default class LemonHead {
  instance: Axios;

  constructor() {
    const token = process.env.LEMONHEAD_KEY;
    this.instance = axios.create({
      baseURL: 'https://app.nocodb.com/api/v2',
      headers: { 'xc-token': token },
    });
  }

  async getBody(params: PARAMS = {}) {
    const response: { data: { list: LemonHeadBodyType[]; pageInfo: LemonHeadPageInfo } | null; error: any } = {
      data: null,
      error: null,
    };
    try {
      const res = await this.instance.request({ method: 'get', url: '/tables/m4qe842pv8myt4x/records', params });
      response.data = res.data;
      console.log(res.data);
    } catch (err) {
      response.error = err;
    } finally {
      return response;
    }
  }
}
