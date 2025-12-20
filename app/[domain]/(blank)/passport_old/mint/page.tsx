import { PassportMain } from '$lib/components/features/passport/mint/main';
import { ASSET_PREFIX } from '$lib/utils/constants';

export async function generateMetadata() {
  return {
    title: 'Lemonade Passport',
    description: 'Claim your verified on-chain identity and unlock exclusive benefits across the Lemonade ecosystem.',
    openGraph: {
      images: `${ASSET_PREFIX}/assets/images/passport-preview.jpg`,
    },
  };
}

export default function Page() {
  return <PassportMain />;
}

