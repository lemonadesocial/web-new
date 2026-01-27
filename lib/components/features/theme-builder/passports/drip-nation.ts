import { ASSET_PREFIX } from '$lib/utils/constants';
import { MAPPING_Widgets, PassportTemplate } from './types';

const dripPassportConfig: PassportTemplate = {
  // theme: 'passport',
  config: {},
  template: {
    provider: 'drip-nation',
    passportTitle: 'Citizen',
    image: `${ASSET_PREFIX}/assets/images/passports/templates/drip-nation-bg.png`,
    widgets: [
      {
        key: 'passport',
        component: MAPPING_Widgets.passport,
        props: {
          title: 'Become a Citizen',
          subtitle: 'Mint your Drip Passport and join a community built by music lovers, collectors, and creators.',
        },
      },
      {
        key: 'community-coin',
        component: MAPPING_Widgets['community-coin'],
        props: {
          title: '$DRIP',
          subtitle: 'Launching soon',
        },
      },
      {
        key: 'music-player',
        component: MAPPING_Widgets['music-player'],
        props: {
          title: '$DRIP',
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
          title: 'Fashion Coins',
          subtitle: 'Coming soon',
        },
      },
      {
        key: 'collectibles',
        component: MAPPING_Widgets.collectibles,
        props: {
          title: 'DRIP NFT Marketplace',
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
      '--color-accent-500': '#9BFF77',
      '--color-accent-700': '#41D33C',
      '--btn-content': '#000000',
      '--btn-content-hover': '#000000',
    },
    light: {},
    dark: {},
    pattern: {},
  },
};

export default dripPassportConfig;
