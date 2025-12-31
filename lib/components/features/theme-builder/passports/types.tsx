import React from 'react';

import { PASSPORT_PROVIDER } from '$lib/components/features/passports/config';
import { WidgetPassport } from '../../community/widgets/WidgetPassport';
import { WidgetCommunityCoin } from '../../community/widgets/WidgetCommunityCoin';
import { WidgetMusicNFT } from '../../community/widgets/WidgetMusicNFT';
import { WidgetUpcomingEvents } from '../../community/widgets/WidgetUpcomingEvents';
import { WidgetConnectWallet } from '../../community/widgets/WidgetConnectWallet';
import { WidgetLaunchpad } from '../../community/widgets/WidgetLaunchpad';
import { WidgetCollectibles } from '../../community/widgets/WidgetCollectibles';
import { ThemeValues } from '../store';
import { Space } from '$lib/graphql/generated/backend/graphql';

type WidgetKey =
  | 'passport'
  | 'community-coin'
  | 'music-player'
  | 'upcoming-events'
  | 'wallet'
  | 'launchpad'
  | 'collectibles';

export type PassportWidget = {
  key: WidgetKey;
  /** static allowed drag and drop */
  static?: boolean;
  component?: React.FC;
  props?: Record<string, string | number>;
};

export type PassportTemplate = ThemeValues & {
  template: {
    provider: PASSPORT_PROVIDER;
    image?: string;
    passportTitle: string;
    widgets: PassportWidget[];
  };
};

export const MAPPING_Widgets: { [key: string]: React.FC<any> } = {
  passport: WidgetPassport,
  'community-coin': WidgetCommunityCoin,
  'music-player': WidgetMusicNFT,
  'upcoming-events': WidgetUpcomingEvents,
  wallet: WidgetConnectWallet,
  launchpad: WidgetLaunchpad,
  collectibles: WidgetCollectibles,
};
