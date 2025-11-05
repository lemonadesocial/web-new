import { PassportMain } from '$lib/components/features/passport/zugrama/main';
import { ASSET_PREFIX } from '$lib/utils/constants';

export async function generateMetadata() {
  return {
    title: 'Zugrama Passport',
    description: 'Become part of a new world.',
    openGraph: {
      images: `${ASSET_PREFIX}/assets/images/zugrama-passport-placeholder.png`,
    },
  };
}

export default function Page() {
  return <PassportMain />;
}
