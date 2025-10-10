import { request } from '$lib/services/nft/admin';

type Cache = {
  metadata_url?: string;
  image_url?: string;
}

export const getApproval = async (wallet: string, look: string, sponsor?: string) => {
  return request<{ signature: string; price: string; inviter?: string }>(`/lemonhead/approval`, 'POST', { wallet, look, sponsor });
};

export const getCache = async (look: string) => {
  return request<Cache | undefined>(`/lemonhead/get_cache?look=${look}`, 'GET');
};

export const setCache = async (look: string, cache: Cache) => {
  return request<void>(`/lemonhead/set_cache?look=${look}`, 'POST', cache);
};

export const getData = async (wallet: string, fluffleTokenId: string) => {
  return request<{ lemonheadTokenId: string; lemonheadImageUrl: string; fluffleImageUrl: string }>(
    `/passport/data?wallet=${wallet}&fluffleTokenId=${fluffleTokenId}`, 'GET'
  );
};
