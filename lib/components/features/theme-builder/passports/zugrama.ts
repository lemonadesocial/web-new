import { ASSET_PREFIX } from '$lib/utils/constants';
import { MAPPING_Widgets, PassportTemplate } from './types';

const zugramaPassportConfig: PassportTemplate = {
  theme: 'passport',
  config: {
    mode: 'light',
    color: '',
  },
  template: {
    provider: 'zugrama',
    passportTitle: 'Citizen',
    image: `${ASSET_PREFIX}/assets/images/passports/templates/zugrama-bg.png`,
    widgets: [
      {
        key: 'passport',
        component: MAPPING_Widgets.passport,
        props: {
          title: 'Become a Citizen',
          image: `${ASSET_PREFIX}/assets/images/passports/zugrama-passport-mini-dark.png`,
          subtitle:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
        },
      },
      {
        key: 'community-coin',
        component: MAPPING_Widgets['community-coin'],
        props: {
          title: '$GRAMA',
          subtitle: 'Launching soon',
        },
      },
      {
        key: 'music-player',
        component: MAPPING_Widgets['music-player'],
        props: {
          title: '$GRAMA',
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
          title: 'Projects',
          subtitle: 'Coming soon',
        },
      },
      {
        key: 'collectibles',
        enable: false,
        component: MAPPING_Widgets.collectibles,
        props: {
          title: 'Collectibles',
          subtitle: 'Coming soon',
        },
      },

      {
        key: 'places',
        enable: true,
        component: MAPPING_Widgets.places,
        props: {
          title: 'Residencies',
          subtitle: 'Coming soon',
        },
      },
    ],
  },
  font_title: 'default',
  font_body: 'default',
  variables: {
    font: {
      '--font-body': 'var(--font-orbitron)',
      '--font-title': 'var(--font-orbitron-bold)',
    },
    custom: {
      '--color-accent-500': '#388F6C',
      '--color-accent-700': '#21664A',
    },
    light: {},
    dark: {},
    pattern: {},
  },
};

export default zugramaPassportConfig;
