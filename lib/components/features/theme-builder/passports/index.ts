import vinylPassportConfig from './vinyl-nation';
import festivalPassportConfig from './festival-nation';
import dripPassportConfig from './drip-nation';
import { PassportTemplate } from './types';

export const defaultPassportConfig: Record<string, PassportTemplate> = {
  'vinyl-nation': vinylPassportConfig,
  'festival-nation': festivalPassportConfig,
  'drip-nation': dripPassportConfig,
};
