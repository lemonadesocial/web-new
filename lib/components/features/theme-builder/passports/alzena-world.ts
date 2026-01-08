import { ASSET_PREFIX } from '$lib/utils/constants';
import { MAPPING_Widgets, PassportTemplate } from './types';

const alzenaWorldPassportConfig: PassportTemplate = {
  theme: 'passport',
  config: {},
  template: {
    provider: 'alzena-world',
    passportTitle: 'Citizen',
    image: `${ASSET_PREFIX}/assets/images/passports/templates/alzena-world-bg.png`,
    widgets: [
      {
        key: 'passport',
        component: MAPPING_Widgets.passport,
        props: {
          title: 'Become a Citizen',
          subtitle:
            'Mint your Alzena World passport & lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
        },
      },
      {
        key: 'community-coin',
        component: MAPPING_Widgets['community-coin'],
        props: {
          title: '$ALZENA',
          subtitle: 'Launching soon',
        },
      },
      {
        key: 'music-player',
        component: MAPPING_Widgets['music-player'],
        props: {
          title: '$ALZENA',
          subtitle: 'Launching soon',
        },
      },
      {
        key: 'upcoming-events',
        component: MAPPING_Widgets['upcoming-events'],
      },
      {
        key: 'wallet',
        component: MAPPING_Widgets.wallet,
        props: {
          title: 'Connect Wallet',
          subtitle: 'Connect your wallet to access your tokens and rewards.',
        },
      },
      {
        key: 'launchpad',
        component: MAPPING_Widgets.launchpad,
        props: {
          title: 'Artist Coins',
          subtitle: 'Coming soon',
        },
      },
      {
        key: 'collectibles',
        component: MAPPING_Widgets.collectibles,
        props: {
          title: 'Collectibles',
          subtitle: 'Coming soon',
        },
      },

      {
        key: 'places',
        enable: false,
        component: MAPPING_Widgets.places,
        props: {
          title: 'Residencies',
          subtitle: 'Coming soon',
        },
      },
    ],
  },
  font_title: 'basePixel',
  font_body: 'antonio',
  variables: {
    font: {
      '--font-body': 'var(--font-antonio)',
      '--font-title': 'var(--font-base-pixel)',
    },
    custom: {},
    light: {},
    dark: {},
    pattern: {},
  },
};

export default alzenaWorldPassportConfig;
