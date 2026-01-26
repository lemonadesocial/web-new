import { request } from '$lib/services/nft/admin';
import { PassportProvider } from '$lib/graphql/generated/backend/graphql';

export const getApproval = async (opts: { wallet: string; uri: string; opts: PassportProvider }) => {
  return request<{ signature: string; price: string }>(`/passport/approval`, 'POST', opts);
};

export const getData = async (opts: {
  provider: PassportProvider;
  /** @description wallet is required for lemonhead */
  wallet?: string;
  /** @description fluffleTokenId is required for lemonhead */
  fluffleTokenId?: string | null;
  /** @description authCookie is required for zugrama */
  auth?: string;
}) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(opts)) {
    if (value != null) {
      params.append(key, value.toString());
    }
  }
  return request<{ passportNumber: number }>(`/passport/data?${params.toString()}`, 'GET');
};
