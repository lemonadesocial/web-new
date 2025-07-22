import { LemonHeadMain } from '$lib/components/features/lemonheads/main';

export async function generateMetadata({ params }: { params: Promise<{ shortid: string }> }) {
  return {
    metadataBase: null,
    title: 'LemonHead',
    description: 'Just claimed my LemonHead 🍋 Fully onchain, totally me. Yours is waiting—go mint it now.',
    openGraph: {
      // images: `${process.env.NEXT_PUBLIC_HOST_URL}/api/og/event/${event.shortid}?file=${fileId}`,
    },
  };
}

export default async function Page() {
  return <LemonHeadMain />;
}
