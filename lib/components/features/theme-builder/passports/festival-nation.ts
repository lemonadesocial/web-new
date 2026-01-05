import { ASSET_PREFIX } from '$lib/utils/constants';
import { MAPPING_Widgets, PassportTemplate } from './types';

const festivalPassportConfig: PassportTemplate = {
  // theme: 'passport',
  config: {},
  template: {
    provider: 'festival-nation',
    passportTitle: 'Citizen',
    image: `${ASSET_PREFIX}/assets/images/passports/templates/festival-nation-bg.png`,
    widgets: [
      {
        key: 'passport',
        component: MAPPING_Widgets.passport,
        props: {
          title: 'Become a Citizen',
          subtitle: 'Mint your Festival Passport and join a community built by music lovers, collectors, and creators.',
        },
      },
      {
        key: 'community-coin',
        component: MAPPING_Widgets['community-coin'],
        props: {
          title: '$FESTIVAL',
          subtitle: 'Launching soon',
        },
      },
      {
        key: 'music-player',
        component: MAPPING_Widgets['music-player'],
        props: {
          title: '$FESTIVAL',
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
          subtitle: 'Connect Wallet',
        },
      },
      {
        key: 'collectibles',
        component: MAPPING_Widgets.collectibles,
        props: {
          title: 'Festival Coins',
          subtitle: 'Coming soon',
        },
      },
    ],
  },
  font_title: 'default',
  font_body: 'default',
  variables: {
    font: {},
    custom: {
      '--color-accent-500': '#FDE047',
      '--color-accent-700': '#EAB308',
      '--btn-content': '#000000',
      '--btn-content-hover': '#000000',
    },
    light: {},
    dark: {},
    pattern: {},
  },
};

export default festivalPassportConfig;
