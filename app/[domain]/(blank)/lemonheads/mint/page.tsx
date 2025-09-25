import { Metadata } from 'next';
import { LemonHeadMain } from '$lib/components/features/lemonheads/mint/main';
import { ASSET_PREFIX } from '$lib/utils/constants';

export const metadata: Metadata = {
  title: 'LemonHead',
  description: 'Just claimed my LemonHead 🍋 Fully onchain, totally me. Yours is waiting—go mint it now.',
  openGraph: {
    images: `${ASSET_PREFIX}/assets/images/lemonheads-preview.jpg`,
  },
};

export default async function Page() {
  return <LemonHeadMain />;
}
