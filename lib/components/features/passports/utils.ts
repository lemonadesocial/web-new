import { PassportProvider } from '$lib/graphql/generated/backend/graphql';
import { PASSPORT_PROVIDER } from './types';

export const PASSPORT_CHAIN_ID = [process.env.NEXT_PUBLIC_APP_ENV, process.env.APP_ENV].includes('production')
  ? '1'
  : '11155111';

export const MAPPING_PROVIDER: Record<PASSPORT_PROVIDER, PassportProvider> = {
  mint: PassportProvider.Lemonade,
  zugrama: PassportProvider.Zugrama,
  'vinyl-nation': PassportProvider.VinylNation,
  'drip-nation': PassportProvider.DripNation,
  'festival-nation': PassportProvider.FestivalNation,
  'alzena-world': PassportProvider.AlzenaWorld,
};
