import { request } from '$lib/services/nft/admin';

export const getApproval = async (wallet: string, user: string, uri: string) => {
  const opts = {
    provider: 'drip_nation',
    wallet,
    user,
    uri,
  };
  return request<{ signature: string; price: string }>(`/passport/approval`, 'POST', opts);
};

export const getData = async () => {
  return request<{ userId: string; passportNumber: number; }>(
    `/passport/data?provider=drip_nation}`,
    'GET',
  );
};
