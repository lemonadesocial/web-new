import { PassportProvider } from '$lib/graphql/generated/backend/graphql';
import { PASSPORT_PROVIDER } from './types';

export const MAPPING_PROVIDER: Record<PASSPORT_PROVIDER, PassportProvider> = {
  mint: PassportProvider.Lemonade,
  zugrama: PassportProvider.Zugrama,
  'vinyl-nation': PassportProvider.VinylNation,
  'drip-nation': PassportProvider.DripNation,
  'festival-nation': PassportProvider.FestivalNation,
  'alzena-world': PassportProvider.AlzenaWorld,
};
