import axios, { Axios } from 'axios';
import { LemonHeadAccessory, LemonHeadBodyType, LemonHeadPageInfo } from './types';

type PARAMS = {
  offset?: string | null;
  limit?: string | null;
  where?: string | null;
  viewId?: string;
};

type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };

class Response<T extends JSONValue> {
  private data: { success: boolean; data?: T; error?: string };

  constructor(data: { success: boolean; data?: T; error?: string }) {
    this.data = data;
  }

  toJSON(): { success: boolean; data?: T; error?: string } {
    return this.data;
  }

  static success<T extends JSONValue>(data: T): Response<T> {
    return new Response<T>({ success: true, data });
  }

  static error(error: string): Response<never> {
    return new Response({ success: false, error });
  }
}

class LemonHead {
  instance: Axios;

  constructor() {
    const token = process.env.NOCODB_ACCESS_KEY;
    this.instance = axios.create({
      baseURL: 'https://app.nocodb.com/api/v2',
      headers: { 'xc-token': token },
    });
  }

  async getBody(params: PARAMS = { limit: '100' }) {
    try {
      const res = await this.instance.request<{ list: LemonHeadBodyType[]; pageInfo: LemonHeadPageInfo }>({
        method: 'get',
        url: '/tables/m4qe842pv8myt4x/records',
        params,
      });

      return Response.success(res.data).toJSON();
    } catch (err: any) {
      return Response.error(err.message).toJSON();
    }
  }

  async getAccessories(params: PARAMS = { limit: '100' }) {
    try {
      const res = await this.instance.request<{ list: LemonHeadAccessory[]; pageInfo: LemonHeadPageInfo }>({
        method: 'get',
        url: '/tables/m8fys8d596wooeq/records',
        params,
      });

      return Response.success(res.data).toJSON();
    } catch (err: any) {
      return Response.error(err.message).toJSON();
    }
  }
}

export default new LemonHead();
