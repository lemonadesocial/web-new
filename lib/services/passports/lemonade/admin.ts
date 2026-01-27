import { request } from '$lib/services/nft/admin';

export const getApproval = async (wallet: string, uri: string) => {
  return request<{ signature: string; price: string; }>(`/passport/approval`, 'POST', { provider: 'lemonade', wallet, uri });
};

export const getData = async (wallet: string, fluffleTokenId: string) => {
  return request<{ passportNumber: number; lemonheadImageUrl: string; fluffleImageUrl: string }>(
    `/passport/data?provider=lemonade&wallet=${wallet}&fluffleTokenId=${fluffleTokenId}`, 'GET'
  );
};
