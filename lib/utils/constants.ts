export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL as string;
export const LEMONADE_DOMAIN = process.env.NEXT_PUBLIC_LEMONADE_DOMAIN as string;
export const HYDRA_PUBLIC_URL = process.env.NEXT_PUBLIC_HYDRA_PUBLIC_URL as string;
export const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string;
export const ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
export const KRATOS_PUBLIC_URL = process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL as string;
export const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_URL as string;
export const LEMONADE_FEED_ADDRESS = process.env.NEXT_PUBLIC_LEMONADE_FEED_ADDRESS as string;
export const LENS_NAMESPACE = process.env.NEXT_PUBLIC_LENS_NAMESPACE as string;

export const SEPOLIA_ETHERSCAN = 'https://sepolia.etherscan.io';

export const ETHNICITIES = [
  'African American',
  'Alaska Native',
  'Arab',
  'Asian',
  'Black',
  'Han Chinese',
  'Hispanic / Latino',
  'Indian',
  'Native American',
  'Native Hawaiian',
  'Pacific Islander',
  'White',
  'Other',
];

export const PRONOUNS = ['She', 'He', 'They'];

export const INDUSTRY_OPTIONS = [
  'Arts',
  'Civic / Social',
  'Consumer Goods',
  'Design',
  'Education',
  'Engineering',
  'Entertainment',
  'Environment',
  'Financial',
  'Government',
  'Healthcare',
  'International Affairs',
  'Manufacturing',
  'Marketing and Advertising',
  'Media',
  'Museums',
  'Public Policy',
  'Public Relations and Communications',
  'Real Estate',
  'Sports & Gaming',
  'Technology',
  'Wellness',
  'Other',
];

export const PROFILE_SOCIAL_LINKS = [
  { icon: 'icon-twitter', name: 'handle_twitter', prefix: 'x.com/', placeholder: 'username' },
  { icon: 'icon-linkedin', name: 'handle_linkedin', prefix: 'linkedin.com', placeholder: '/us/handle' },
  { icon: 'icon-farcaster', name: 'handle_farcaster', prefix: 'farcaster.xyz/', placeholder: 'username' },
  { icon: 'icon-instagram', name: 'handle_instagram', prefix: 'instagram.com/', placeholder: 'username' },
  { icon: 'icon-github-fill', name: 'handle_github', prefix: 'github.com/', placeholder: 'username' },
  { icon: 'icon-calendly', name: 'calendly_url', prefix: 'calendly.com/', placeholder: 'username' },
];

export const DEFAULT_LAYOUT_SECTIONS = [
  { id: 'registration', hidden: false },
  { id: 'about', hidden: false },
  { id: 'collectibles', hidden: false },
  { id: 'location', hidden: false },
];

export const IDENTITY_TOKEN_KEY = 'identity_token';

export const SELF_VERIFICATION_CONFIG = {
  minimumAge: 13,
  ofac: true,
  nationality: true,
};
