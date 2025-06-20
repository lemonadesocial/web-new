export const LENS_CHAIN_ID = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? '232' : '37111';

/**
 * @description list of key existing can sync
 */
export const ATTRIBUTES_SAFE_KEYS = [
  'website',
  'handle_farcaster',
  'handle_github',
  'handle_instagram',
  'handle_twitter',
  'handle_linkedin',
  'calendly_url',
  'job_title',
  'pronoun',
  'company_name',
];
