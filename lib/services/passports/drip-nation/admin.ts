import { request } from '$lib/services/nft/admin';
import { PassportProvider } from '$lib/graphql/generated/backend/graphql';

export const getApproval = async (wallet: string, uri: string) => {
  const opts = {
    provider: PassportProvider.DripNation,
    wallet,
    uri,
  };
  return request<{ signature: string; price: string }>(`/passport/approval`, 'POST', opts);
};

export const getData = async () => {
  return request<{ userId: string; passportNumber: number; }>(
    `/passport/data?provider=${PassportProvider.DripNation}`,
    'GET',
  );
};
