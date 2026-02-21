import React from 'react';
import dynamic from 'next/dynamic';

import { WidgetPassport } from '../../community/widgets/WidgetPassport';
import { WidgetMusicNFT } from '../../community/widgets/WidgetMusicNFT';
import { WidgetUpcomingEvents } from '../../community/widgets/WidgetUpcomingEvents';
import { WidgetConnectWallet } from '../../community/widgets/WidgetConnectWallet';
import { WidgetLaunchpad } from '../../community/widgets/WidgetLaunchpad';
import { WidgetCollectibles } from '../../community/widgets/WidgetCollectibles';
import { ThemeValues } from '../store';
import { WidgetPlaces } from '../../community/widgets/WidgetPlaces';
import { PASSPORT_PROVIDER } from '../../passports/types';

const WidgetCommunityCoin = dynamic(
  () => import('../../community/widgets/WidgetCommunityCoin').then((m) => ({ default: m.WidgetCommunityCoin })),
  { ssr: false },
);

type WidgetKey =
  | 'passport'
  | 'community-coin'
  | 'music-player'
  | 'upcoming-events'
  | 'wallet'
  | 'launchpad'
  | 'collectibles'
  | 'places';

export type PassportWidget = {
  key: WidgetKey;
  /** static allowed drag and drop */
  static?: boolean;
  component?: React.FC;
  props?: Record<string, string | number>;
  enable?: boolean;
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
  places: WidgetPlaces,
};
