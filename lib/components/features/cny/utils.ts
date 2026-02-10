import { ASSET_PREFIX } from '$lib/utils/constants';

const ASSET_MAP: Record<number, string> = {
  1: `${ASSET_PREFIX}/assets/images/red-envelope-packs/Asset-1-env.png`,
  10: `${ASSET_PREFIX}/assets/images/red-envelope-packs/Asset-10-env.png`,
  25: `${ASSET_PREFIX}/assets/images/red-envelope-packs/Asset-25-env.png`,
  50: `${ASSET_PREFIX}/assets/images/red-envelope-packs/Asset-50-env.png`,
  100: `${ASSET_PREFIX}/assets/images/red-envelope-packs/Asset-100-env.png`,
  500: `${ASSET_PREFIX}/assets/images/red-envelope-packs/Asset-500-env.png`,
  1000: `${ASSET_PREFIX}/assets/images/red-envelope-packs/Asset-1000-env.png`,
};

export const getAsset = (quantity: number) =>
  ASSET_MAP[quantity] ?? `${ASSET_PREFIX}/assets/images/red-envelope-packs/Asset-1000-env.png`;
