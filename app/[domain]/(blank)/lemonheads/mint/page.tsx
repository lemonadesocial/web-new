import { LemonHeadMain } from '$lib/components/features/lemonheads/mint/main';
import { ASSET_PREFIX } from '$lib/utils/constants';

export async function generateMetadata() {
  const miniapp = {
    version: 'next',
    imageUrl: `${ASSET_PREFIX}/assets/images/lemonheads-frame.png`,
    button: {
      title: 'Mint LemonHead',
      action: {
        type: 'launch_miniapp',
        name: 'Mint LemonHead',
      }
    }
  }

  return {
    title: 'LemonHead',
    description: 'Just claimed my LemonHead 🍋 Fully onchain, totally me. Yours is waiting—go mint it now.',
    openGraph: {
      images: `${ASSET_PREFIX}/assets/images/lemonheads-preview.jpg`,
    },
    other: {
      'fc:miniapp': JSON.stringify(miniapp),
      'fa:frame': JSON.stringify(miniapp),
    }
  };
}

export default async function Page() {
  return <LemonHeadMain />;
}
