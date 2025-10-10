import { request } from '$lib/services/nft/admin';

export const getApproval = async (wallet: string, uri: string) => {
  return request<{ signature: string; price: string; }>(`/passport/approval`, 'POST', { wallet, uri });
};
