import dynamic from 'next/dynamic';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportIntro } from './steps/Intro';
import { PassportPhoto } from './steps/Photo';
import { PassportUsername } from './steps/Username';
import { PASSPORT_PROVIDER, PassportConfig, PassportStep } from './types';

const PassportCelebrate = dynamic(() => import('./steps/Celebrate').then((m) => ({ default: m.PassportCelebrate })), {
  ssr: false,
});

export const PASSPORT_METADATA: { [key: string]: object } = {
  mint: {
    metadata: {
      title: 'Lemonade Passport',
      description: 'Claim your verified on-chain identity and unlock exclusive benefits across the Lemonade ecosystem.',
      openGraph: {
        images: `${ASSET_PREFIX}/assets/images/passports/passport-preview.jpg`,
      },
    },
  },
  zugrama: {
    metadata: {
      title: 'Zugrama Passport',
      description: 'Become part of a new world.',
      openGraph: {
        images: `${ASSET_PREFIX}/assets/images/passports/zugrama-passport-placeholder.png`,
      },
    },
  },
  'vinyl-nation': {
    metadata: {
      title: 'Vinyl Nation Passport',
      openGraph: {
        images: `${ASSET_PREFIX}/assets/images/passports/vinyl-nation-passport-mini.png`,
      },
    },
  },
  'drip-nation': {
    metadata: {
      title: 'Drip Nation Passport',
      openGraph: {
        images: `${ASSET_PREFIX}/assets/images/passports/drip-nation-passport-mini.png`,
      },
    },
  },
};

export const MAPPING_PASSPORT_STEPS: Record<PassportStep, React.FC> = {
  intro: PassportIntro,
  photo: PassportPhoto,
  username: PassportUsername,
  celebrate: PassportCelebrate,
};

export const PASSPORT_CONFIG: Record<PASSPORT_PROVIDER, PassportConfig> = {
  mint: {
    provider: 'mint',
    passportTitle: 'Lemonade',
    currentStep: PassportStep.intro,
    useLemonhead: true,
    ui: {
      intro: {
        title: 'Join the <br /> United Stands of Lemonade',
        subtitle:
          'Become part of a new world built for creators and communities. Your free passport unlocks access across the Lemonade universe.',
        footer: {
          label: '',
          btnText: "Yes, I'm In",
          index: 0,
        },
      },
      photo: {
        title: 'Choose Your Passport Photo',
        subtitle: 'Select the avatar you’d like on your passport.',
        footer: {
          label: 'Passport Photo',
          btnText: 'Continue',
          index: 1,
        },
      },
      username: {
        title: 'Customize Your Passport',
        subtitle: 'Select your passport name.',
        footer: {
          label: 'Username',
          btnText: 'Claim Passport',
          index: 2,
        },
      },
      celebrate: {
        showBgVideo: true,
        footer: {
          label: 'Celebrate',
          btnText: 'Done',
          index: 3,
        },
      },
    },
    modal: {
      beforeMint: {
        description: 'By minting your Passport, you agree to our Terms of Use and acknowledge that:',
        li: [
          'Lemonade Passport NFT is non-transferable & non-tradable (soul-bound).',
          'Your Passport will be permanently recorded on-chain.',
          'It will be publicly visible and tied to your wallet address.',
          'All claims are final.',
        ],
      },
    },
    enabled: {
      lemonhead: true,
      fluffePhoto: true,
      ens: true,
      lemonadeUsername: true,
      shouldMintedLemonhead: true,
      sharePassport: true,
    },
  },
  'vinyl-nation': {
    provider: 'vinyl-nation',
    passportTitle: 'Vinyl Nation',
    currentStep: PassportStep.intro,
    useLemonhead: true,
    ui: {
      intro: {
        title: 'Join the <br /> Vinyl Nation',
        subtitle: 'Mint your Vinyl Passport and join a community built by music lovers, collectors, and creators.',
        footer: {
          label: '',
          btnText: "Yes, I'm In",
          index: 0,
        },
      },
      photo: {
        title: 'Choose Your Passport Photo',
        subtitle: 'Select the avatar you’d like on your passport.',
        footer: {
          label: 'Passport Photo',
          btnText: 'Continue',
          index: 1,
        },
      },
      username: {
        title: 'Select passport name.',
        subtitle: 'Choose what appears on your passport, your username or ENS.',
        footer: {
          label: 'Username',
          btnText: 'Claim Passport',
          index: 2,
        },
      },
      celebrate: {
        showBgVideo: true,
        footer: {
          label: 'Celebrate',
          btnText: 'Done',
          index: 3,
        },
      },
    },
    enabled: {
      lemonhead: true,
      fluffePhoto: true,
      shouldMintedLemonhead: true,
      ens: true,
      lemonadeUsername: true,
      whitelist: true,
      sharePassport: true,
    },
    modal: {
      beforeMint: {
        description: 'By minting your Passport, you agree to our Terms of Use and acknowledge that:',
        li: [
          'Vinyl Nation Passport NFT is non-transferable & non-tradable (soul-bound).',
          'Your Passport will be permanently recorded on-chain.',
          'It will be publicly visible and tied to your wallet address.',
          'All claims are final.',
        ],
      },
    },
  },
  'festival-nation': {
    provider: 'festival-nation',
    passportTitle: 'Festival Nation',
    currentStep: PassportStep.intro,
    useLemonhead: true,
    ui: {
      intro: {
        title: 'Join the <br /> Festival Nation',
        subtitle: 'Mint your Festival Passport and join a community built by music lovers, collectors, and creators.',
        footer: {
          label: '',
          btnText: "Yes, I'm In",
          index: 0,
        },
      },
      photo: {
        title: 'Choose Your Passport Photo',
        subtitle: 'Select the avatar you’d like on your passport.',
        footer: {
          label: 'Passport Photo',
          btnText: 'Continue',
          index: 1,
        },
      },
      username: {
        title: 'Select passport name.',
        subtitle: 'Choose what appears on your passport, your username or ENS.',
        footer: {
          label: 'Username',
          btnText: 'Claim Passport',
          index: 2,
        },
      },
      celebrate: {
        showBgVideo: true,
        footer: {
          label: 'Celebrate',
          btnText: 'Done',
          index: 3,
        },
      },
    },
    enabled: {
      lemonhead: true,
      fluffePhoto: true,
      shouldMintedLemonhead: true,
      ens: true,
      lemonadeUsername: true,
      whitelist: true,
      sharePassport: true,
    },
    modal: {
      beforeMint: {
        description: 'By minting your Passport, you agree to our Terms of Use and acknowledge that:',
        li: [
          'Festival Nation Passport NFT is non-transferable & non-tradable (soul-bound).',
          'Your Passport will be permanently recorded on-chain.',
          'It will be publicly visible and tied to your wallet address.',
          'All claims are final.',
        ],
      },
    },
  },
  'drip-nation': {
    provider: 'drip-nation',
    passportTitle: 'Drip Nation',
    currentStep: PassportStep.intro,
    useLemonhead: true,
    ui: {
      intro: {
        title: 'Join the <br /> Drip Nation',
        subtitle: 'Mint your DRIP Passport and join a community built by music lovers, collectors, and creators.',
        footer: {
          label: '',
          btnText: "Yes, I'm In",
          index: 0,
        },
      },
      photo: {
        title: 'Choose Your Passport Photo',
        subtitle: 'Select the avatar you’d like on your passport.',
        footer: {
          label: 'Passport Photo',
          btnText: 'Continue',
          index: 1,
        },
      },
      username: {
        title: 'Select passport name.',
        subtitle: 'Choose what appears on your passport, your username or ENS.',
        footer: {
          label: 'Username',
          btnText: 'Claim Passport',
          index: 2,
        },
      },
      celebrate: {
        showBgVideo: true,
        footer: {
          label: 'Celebrate',
          btnText: 'Done',
          index: 3,
        },
      },
    },
    enabled: {
      lemonhead: true,
      fluffePhoto: true,
      lemonadeUsername: true,
      ens: true,
      lemonadeUsername: true,
      whitelist: true,
      sharePassport: true,
    },
    modal: {
      beforeMint: {
        description: 'By minting your Passport, you agree to our Terms of Use and acknowledge that:',
        li: [
          'DRIP Nation Passport NFT is non-transferable & non-tradable (soul-bound).',
          'Your Passport will be permanently recorded on-chain.',
          'It will be publicly visible and tied to your wallet address.',
          'All claims are final.',
        ],
      },
    },
  },
  zugrama: {
    provider: 'zugrama',
    passportTitle: 'Zugrama',
    currentStep: PassportStep.intro,
    useLemonhead: true,
    ui: {
      intro: {
        title: 'Join Zugrama',
        subtitle:
          'Mint your ZuGrama passport & lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.',
        footer: {
          label: '',
          btnText: "Yes, I'm In",
          index: 0,
        },
      },
      photo: {
        title: 'Choose Your Passport Photo',
        subtitle: 'Select the avatar you’d like on your passport.',
        footer: {
          label: 'Passport Photo',
          btnText: 'Continue',
          index: 1,
        },
      },
      username: {
        title: 'Select passport name.',
        subtitle: 'Choose what appears on your passport, your username or ENS.',
        footer: {
          label: 'Username',
          btnText: 'Claim Passport',
          index: 2,
        },
      },
      celebrate: {
        footer: {
          label: 'Celebrate',
          btnText: 'Done',
          index: 3,
        },
      },
    },
    modal: {
      beforeMint: {
        description: 'By minting your Zugrama Passport, you agree to our Terms of Use and acknowledge that:',
        li: [
          'Zugrama Passport NFT is non-transferable & non-tradable (soul-bound).',
          'Your Passport will be permanently recorded on-chain.',
          'It will be publicly visible and tied to your wallet address.',
          'All claims are final.',
        ],
      },
    },
    enabled: {
      lemonhead: true,
      shouldMintedLemonhead: true,
      fluffePhoto: true,
      // selfVerify: true,
      // uploadPhoto: true,
      ens: true,
      whitelist: true,
    },
  },
  'alzena-world': {
    provider: 'alzena-world',
    passportTitle: 'Alzena World',
    currentStep: PassportStep.intro,
    useLemonhead: true,
    ui: {
      intro: {
        title: 'Join <br />  Alzena World',
        subtitle: `Mint your Alzena World passport.`,
        footer: {
          label: '',
          btnText: "Yes, I'm In",
          index: 0,
        },
      },
      photo: {
        title: 'Choose Your Passport Photo',
        subtitle: 'Select the avatar you’d like on your passport.',
        footer: {
          label: 'Passport Photo',
          btnText: 'Next',
          index: 1,
        },
      },
      username: {
        title: 'Select Passport Name',
        subtitle: 'Choose what appears on your passport, your username or ENS.',
        footer: {
          label: 'Username',
          btnText: 'Claim Passport',
          index: 2,
        },
      },
      celebrate: {
        showBgVideo: false,
        footer: {
          label: 'Celebrate',
          btnText: 'Done',
          index: 3,
        },
      },
    },
    modal: {
      beforeMint: {
        description: 'By minting your Passport, you agree to our Terms of Use and acknowledge that:',
        li: [
          'Alzena World Passport NFT is non-transferable & non-tradable (soul-bound).',
          'Your Passport will be permanently recorded on-chain.',
          'It will be publicly visible and tied to your wallet address.',
          'All claims are final.',
        ],
      },
    },
    enabled: {
      lemonhead: true,
      fluffePhoto: true,
      lemonadeUsername: true,
      whitelist: true,
      shouldMintedLemonhead: true,
      sharePassport: true,
    },
  },
};
