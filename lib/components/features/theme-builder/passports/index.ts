import vinylPassportConfig from './vinyl-nation';
import festivalPassportConfig from './festival-nation';
import dripPassportConfig from './drip-nation';
import zugramaPassportConfig from './zugrama';
import { PassportTemplate } from './types';
import alzenaWorldPassportConfig from './alzena-world';

export const defaultPassportConfig: Record<string, PassportTemplate> = {
  'vinyl-nation': vinylPassportConfig,
  'festival-nation': festivalPassportConfig,
  'drip-nation': dripPassportConfig,
  zugrama: zugramaPassportConfig,
  'alzena-world': alzenaWorldPassportConfig,
};
