'use client';
import { useRouter } from 'next/navigation';

import { LensFeed } from '$lib/components/features/lens-feed/LensFeed';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';

export function HomePageContent() {
  const router = useRouter();

  return (
    <div>
      <LensFeed feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={(slug) => router.push(`/posts/${slug}`)} />
    </div>
  );
}
