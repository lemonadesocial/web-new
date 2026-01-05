import { ASSET_PREFIX } from '$lib/utils/constants';
import { MAPPING_Widgets, PassportTemplate } from './types';

const vinylPassportConfig: PassportTemplate = {
  // theme: 'passport',
  config: {},
  template: {
    provider: 'vinyl-nation',
    passportTitle: 'Citizen',
    image: `${ASSET_PREFIX}/assets/images/passports/templates/vinyl-nation-bg.png`,
    widgets: [
      {
        key: 'passport',
        component: MAPPING_Widgets.passport,
        props: {
          title: 'Become a Citizen',
          subtitle: 'Mint your Vinyl Passport and join a community built by music lovers, collectors, and creators.',
        },
      },
      {
        key: 'community-coin',
        component: MAPPING_Widgets['community-coin'],
        props: {
          title: '$VINYL',
          subtitle: 'Launching soon',
        },
      },
      {
        key: 'music-player',
        component: MAPPING_Widgets['music-player'],
        props: {
          title: '$VINYL',
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
          title: 'Vinyl NFT Marketplace',
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
      '--color-accent-500': '#8F863D',
      '--color-accent-700': '#6E6C24',
    },
    light: {},
    dark: {},
    pattern: {},
  },
};

export default vinylPassportConfig;
