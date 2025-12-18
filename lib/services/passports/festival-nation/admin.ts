import { request } from '$lib/services/nft/admin';

export const getApproval = async (wallet: string, userId: string, uri: string) => {
  const opts = {
    provider: 'festival_nation',
    wallet,
    userId,
    uri,
  };
  return request<{ signature: string; price: string }>(`/passport/approval`, 'POST', opts);
};

export const getData = async () => {
  return request<{ userId: string; passportNumber: number; }>(
    `/passport/data?provider=festival_nation`,
    'GET',
  );
};
