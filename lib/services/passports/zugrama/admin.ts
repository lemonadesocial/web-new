import { request } from '$lib/services/nft/admin';

export const getApproval = async (wallet: string, user: string, uri: string) => {
  return request<{ signature: string; price: string; }>(`/passport/zugrama/approval`, 'POST', { wallet, user, uri });
};

export const getData = async (authCookie: string) => {
  return request<{userId: string; passportNumber: number; selfVerifiedTimestamp: number; }>(
    `/passport/zugrama/data?auth=${authCookie}`, 'GET'
  );
};
