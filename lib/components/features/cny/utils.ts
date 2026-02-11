import { formatUnits } from 'ethers';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { formatNumber } from '$lib/utils/number';

const ASSET_MAP: Record<number, string> = {
  1: `${ASSET_PREFIX}/assets/images/red-envelope-packs/1-envelope.png`,
  10: `${ASSET_PREFIX}/assets/images/red-envelope-packs/10-envelopes.png`,
  25: `${ASSET_PREFIX}/assets/images/red-envelope-packs/25-envelopes.png`,
  50: `${ASSET_PREFIX}/assets/images/red-envelope-packs/50-envelopes.png`,
  100: `${ASSET_PREFIX}/assets/images/red-envelope-packs/100-envelopes.png`,
  500: `${ASSET_PREFIX}/assets/images/red-envelope-packs/500-envelopes.png`,
  1000: `${ASSET_PREFIX}/assets/images/red-envelope-packs/1000-envelopes.png`,
};

export const getAsset = (quantity: number) =>
  ASSET_MAP[quantity] ?? `${ASSET_PREFIX}/assets/images/red-envelope-packs/1-envelope.png`;

export const formatPriceLabel = (price: bigint, decimals: number) => {
  const formatted = formatUnits(price, decimals);
  const n = Number(formatted);
  return `$${formatNumber(n)}`;
};
