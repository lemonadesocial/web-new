import { Metadata } from 'next';
import { LemonHeadMain } from '$lib/components/features/lemonheads/main';

export const metadata: Metadata = {
  title: 'LemonHead',
  description: 'Just claimed my LemonHead 🍋 Fully onchain, totally me. Yours is waiting—go mint it now.',
  openGraph: {
    // images: `${process.env.NEXT_PUBLIC_HOST_URL}/api/og/event/${event.shortid}?file=${fileId}`,
  },
};

export default async function Page() {
  return <LemonHeadMain />;
}
