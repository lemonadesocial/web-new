import { Chain } from '$lib/generated/graphql';

declare global {
  interface Window {
    supportedPaymentChains?: Chain[];
  }
}

export default global;
