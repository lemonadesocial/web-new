import { request } from '$lib/services/nft/admin';

export const getApproval = async (wallet: string, userId: string, uri: string) => {
  return request<{ signature: string; price: string }>(`/passport/approval`, 'POST', {
    provider: 'zugrama',
    wallet,
    userId,
    uri,
  });
};

export const getData = async (authCookie?: string) => {
  const authParam = authCookie ? `&auth=${authCookie}` : '';
  return request<{ userId: string; passportNumber: number; selfVerifiedTimestamp: number }>(
    `/passport/data?provider=zugrama${authParam}`,
    'GET',
  );
};
