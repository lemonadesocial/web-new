const ASSET_MAP: Record<number, string> = {
  1: '/assets/images/red-envelope-packs/1-envelope.png',
  10: '/assets/images/red-envelope-packs/10-envelopes.png',
  25: '/assets/images/red-envelope-packs/25-envelopes.png',
  50: '/assets/images/red-envelope-packs/50-envelopes.png',
  100: '/assets/images/red-envelope-packs/100-envelopes.png',
  500: '/assets/images/red-envelope-packs/500-envelopes.png',
  1000: '/assets/images/red-envelope-packs/1000-envelopes.png',
};

export const getAsset = (quantity: number) =>
  ASSET_MAP[quantity] ?? '/assets/images/red-envelope-packs/1000-envelopes.png';
