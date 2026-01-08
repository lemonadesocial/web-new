import vinylPassportConfig from './vinyl-nation';
import festivalPassportConfig from './festival-nation';
import dripPassportConfig from './drip-nation';
import gramaPassportConfig from './grama';
import { PassportTemplate } from './types';
import alzenaWorldPassportConfig from './alzena-world';

export const defaultPassportConfig: Record<string, PassportTemplate> = {
  'vinyl-nation': vinylPassportConfig,
  'festival-nation': festivalPassportConfig,
  'drip-nation': dripPassportConfig,
  grama: gramaPassportConfig,
  'alzena-world': alzenaWorldPassportConfig,
};
